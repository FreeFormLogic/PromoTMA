// Используем Gemini 2.5 Pro через прямые HTTP запросы
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

export interface BusinessAnalysis {
  industry: string;
  size: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
  persona: string;
}

export async function analyzeBusinessContext(
  messages: string[],
): Promise<BusinessAnalysis> {
  try {
    const prompt = `Ты - эксперт по бизнес-анализу с глубоким пониманием различных отраслей. Проанализируй разговор и извлеки полную картину бизнеса клиента.

ТВОЯ ЗАДАЧА - ИЗУЧИТЬ НИШУ КЛИЕНТА:
1. Определи тип бизнеса и его специфику
2. Выяви болевые точки и потребности  
3. Пойми бизнес-модель и процессы
4. Найди возможности для цифровизации

ГЛУБОКИЙ АНАЛИЗ ЛЮБОЙ НИШИ

ДЛЯ КАЖДОЙ НИШИ АНАЛИЗИРУЙ:
- Ключевые процессы и workflow
- Типичные проблемы и узкие места  
- Потребности в автоматизации
- Возможности роста через цифровизацию

Верни подробный JSON:
- industry: точное описание ниши
- size: размер бизнеса 
- challenges: детальные проблемы конкретной ниши
- goals: специфические цели для данного типа бизнеса
- relevantCategories: категории модулей для этой ниши
- keywords: профессиональные термины ниши
- persona: детальный профиль клиента и его бизнеса

Разговор:
${messages.join("\n")}

Отвечай только валидным JSON без дополнительного текста.`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Ты - эксперт по бизнес-анализу. Изучай любую нишу и отвечай только валидным JSON без дополнительного текста.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.1,
        },
      }),
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (content) {
      let responseText = content.trim();

      // Remove markdown code blocks if present
      if (responseText.startsWith("```json")) {
        responseText = responseText
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (responseText.startsWith("```")) {
        responseText = responseText
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      return JSON.parse(responseText);
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error analyzing business context:", error);
    return {
      industry: "general",
      size: "medium",
      challenges: [],
      goals: [],
      relevantCategories: [],
      keywords: [],
      persona: "general business",
    };
  }
}

export async function generateAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[] = [],
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import("./storage");
    const allModules = await storage.getAllModules();
    console.log(`🔍 AI processing ${allModules.length} modules`);

    // Не передаем полный список модулей для уменьшения размера запроса

    const systemPrompt = `Ты эксперт по Telegram Mini Apps. У тебя более 250 модулей для разных бизнес-задач.

АНАЛИЗИРУЙ бизнес пользователя и рекомендуй 3-4 самых подходящих модуля из доступных.

УЖЕ ПОКАЗАННЫЕ: [${alreadyShownModules.join(", ")}] - НЕ повторяй!

ФОРМАТ ОТВЕТА:
[MODULE:НОМЕР] Краткое объяснение без повтора названия.

СТРОГО ЗАПРЕЩЕНО:
- Повторять названия модулей после [MODULE:X]
- Использовать **, * , ** - символы
- Начинать с маленькой буквы

ПРАВИЛЬНО: "[MODULE:120] Поможет принимать платежи через GoPay."
НЕПРАВИЛЬНО: "**[MODULE:120] Название** - описание"

Отвечай четко на русском.`;

    const apiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nДиалог:\n${messages.map((msg) => `${msg.role === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}`).join("\n")}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.1,
        },
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Gemini API Error:", apiResponse.status, errorText);
      throw new Error(`API failed: ${apiResponse.status} - ${errorText}`);
    }

    const apiData = await apiResponse.json();
    console.log("Full API Response:", JSON.stringify(apiData, null, 2));

    const aiContent = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiContent) {
      console.error("No AI content found in response:", apiData);
      console.error("Candidates:", apiData.candidates);
      throw new Error("No AI response content");
    }

    console.log("AI Response Preview:", aiContent.substring(0, 100));

    // Дополнительная очистка форматирования для устранения проблем
    let cleanedContent = aiContent
      .replace(/\*\*\s*\[MODULE:(\d+)\]\s*([^*]+)\*\*\s*[:-]/gi, "[MODULE:$1]") // Убираем **[MODULE:X] Название** -
      .replace(/\*\s*\*\*\s*/g, "") // Убираем * **
      .replace(/\*\*\s*-\s*/g, "") // Убираем ** -
      .replace(/\*\*([^*]+)\*\*:/g, "$1:") // Заменяем **Текст**: на Текст:
      .replace(/\n\*\s*\*\*/g, "\n") // Убираем переносы с * **
      .trim();

    const moduleMatches = cleanedContent.match(/\[MODULE:(\d+)\]/gi) || [];
    const recommendedModules: number[] = [];

    for (const match of moduleMatches) {
      const numberMatch = match.match(/\[MODULE:(\d+)\]/i);
      if (numberMatch) {
        const moduleNumber = parseInt(numberMatch[1]);
        if (!alreadyShownModules.includes(moduleNumber)) {
          recommendedModules.push(moduleNumber);
        }
      }
    }

    return {
      response: cleanedContent,
      recommendedModules: Array.from(new Set(recommendedModules)).sort(
        (a, b) => a - b,
      ),
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      response: "Извините, произошла ошибка при генерации ответа.",
      recommendedModules: [],
    };
  }
}

export function calculateModuleRelevance(
  module: any,
  analysis: BusinessAnalysis,
): number {
  let score = 0;

  // Category match
  if (analysis.relevantCategories.includes(module.category)) {
    score += 50;
  }

  // Keyword matches in name and description
  for (const keyword of analysis.keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (module.name.toLowerCase().includes(lowerKeyword)) {
      score += 30;
    }
    if (module.description.toLowerCase().includes(lowerKeyword)) {
      score += 20;
    }
    // Check keyFeatures
    if (module.keyFeatures) {
      const features = Array.isArray(module.keyFeatures)
        ? module.keyFeatures
        : [];
      for (const feature of features) {
        if (
          typeof feature === "string" &&
          feature.toLowerCase().includes(lowerKeyword)
        ) {
          score += 10;
        }
      }
    }
  }


  const industryLower = analysis.industry.toLowerCase();

  // Продвинутый анализ отрасли
  for (const [industryKey, industryData] of Object.entries(industryPatterns)) {
    if (industryLower.includes(industryKey)) {
      // Проверяем ключевые слова отрасли
      for (const keyword of industryData.keywords) {
        if (
          module.name.toLowerCase().includes(keyword) ||
          module.description.toLowerCase().includes(keyword)
        ) {
          score += 20;
        }
      }

      // Проверяем процессы отрасли
      for (const process of industryData.processes) {
        if (
          module.name.toLowerCase().includes(process) ||
          module.description.toLowerCase().includes(process)
        ) {
          score += 25;
        }
      }

      // Проверяем решения для болевых точек
      for (const solution of industryData.solutions) {
        if (
          module.name.toLowerCase().includes(solution) ||
          module.description.toLowerCase().includes(solution)
        ) {
          score += 30;
        }
      }
    }
  }

  // УНИВЕРСАЛЬНЫЙ АНАЛИЗ СООТВЕТСТВИЯ МОДУЛЯ НИШЕ
  // Глубокий семантический анализ потребностей бизнеса vs возможностей модуля

  // 1. Анализ ключевых бизнес-процессов
  const businessProcesses = analysis.keywords.concat(analysis.keywords); // Fixed: removed undefined painPoints
  const moduleCapabilities = [
    module.name.toLowerCase(),
    module.description.toLowerCase(),
    ...(module.features || []).map((f: any) => f.toLowerCase()),
    ...(module.benefits || "").toLowerCase().split(" "),
  ];

  // 2. Семантическое сопоставление процессов и возможностей
  let processMatchScore = 0;
  for (const process of businessProcesses) {
    for (const capability of moduleCapabilities) {
      if (
        capability.includes(process.toLowerCase()) ||
        process.toLowerCase().includes(capability)
      ) {
        processMatchScore += 15;
      }
    }
  }

  // 3. Анализ решения болевых точек
  let painPointScore = 0;
  for (const pain of analysis.keywords) {
    // Fixed: use keywords instead of non-existent painPoints
    for (const capability of moduleCapabilities) {
      if (
        capability.includes(pain.toLowerCase()) ||
        pain.toLowerCase().includes(capability)
      ) {
        painPointScore += 25; // Больший вес за решение проблем
      }
    }
  }

  // 4. Анализ категориальной релевантности
  let categoryScore = 0;
  const industryCategories = {
    туризм: ["бронирование", "crm", "интеграции", "платежи"],
    медицина: ["бронирование", "crm", "уведомления", "аналитика"],
    ресторан: ["e-commerce", "платежи", "уведомления", "логистика"],
    образование: ["образование", "тестирование", "прогресс", "контент"],
    салон: ["бронирование", "crm", "уведомления", "лояльность"],
    производство: ["задачи", "логистика", "аналитика", "автоматизация"],
    финансы: ["платежи", "аналитика", "безопасность", "интеграции"],
  };

  for (const [industry, relevantCategories] of Object.entries(
    industryCategories,
  )) {
    if (industryLower.includes(industry)) {
      for (const category of relevantCategories) {
        if (
          module.category.toLowerCase().includes(category) ||
          module.name.toLowerCase().includes(category) ||
          module.description.toLowerCase().includes(category)
        ) {
          categoryScore += 20;
        }
      }
    }
  }

  score += processMatchScore + painPointScore + categoryScore;

  return score;
}

// Rate limiting state
let lastRequestTime = 0;
let tokenUsage = 0;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_TOKENS_PER_MINUTE = 20000; // Increased for detailed module data

export async function generateChatResponse(
  messages: { role: string; content: string }[],
  allModules: any[],
  displayedModules: any[],
): Promise<{ response: string; recommendedModules: number[] }> {
  // Rate limiting check
  const now = Date.now();
  if (
    now - lastRequestTime < RATE_LIMIT_WINDOW &&
    tokenUsage > MAX_TOKENS_PER_MINUTE
  ) {
    throw new Error(
      "Rate limit exceeded. Please wait a moment before making another request.",
    );
  }

  // Reset token usage if window has passed
  if (now - lastRequestTime >= RATE_LIMIT_WINDOW) {
    tokenUsage = 0;
    lastRequestTime = now;
  }

  // Get displayed module numbers for filtering
  const displayedModuleNumbers = displayedModules.map((m) => m.number);

  // ПОЛНЫЙ АНАЛИЗ ВСЕХ МОДУЛЕЙ ДЛЯ ИНТЕЛЛЕКТУАЛЬНОГО ПОДБОРА
  const availableModules = allModules.filter(
    (m) => !displayedModuleNumbers.includes(m.number),
  );

  // Создаем детальный контекст модулей с ПОЛНОЙ информацией для умного сопоставления
  const modulesByCategory = availableModules.reduce((acc: any, module: any) => {
    if (!acc[module.category]) acc[module.category] = [];

    // Включаем ВСЕ детали модуля: название, описание, возможности, преимущества
    const features = Array.isArray(module.keyFeatures)
      ? module.keyFeatures.slice(0, 4).join(" | ")
      : Array.isArray(module.features)
        ? module.features.slice(0, 4).join(" | ")
        : module.keyFeatures || "Функционал доступен в базе";

    const benefits = module.benefits || "Преимущества указаны в описании";

    // ДЕТАЛЬНАЯ ЗАПИСЬ для лучшего понимания ИИ
    acc[module.category].push(
      `#${module.number}: ${module.name}\n` +
        `Описание: ${module.description}\n` +
        `Возможности: ${features}\n` +
        `Преимущества: ${benefits}`,
    );
    return acc;
  }, {});

  const moduleContext = Object.entries(modulesByCategory)
    .map(
      ([category, modules]: [string, any]) =>
        `${category}:\n${(modules as string[]).join("\n")}`,
    )
    .join("\n\n");

  try {
    // Estimate token usage (rough approximation) - more accurate for detailed module context
    const moduleContextTokens = moduleContext.length * 0.3; // Estimate tokens for module context
    const systemPromptTokens = 1200 + moduleContextTokens; // Include module context in estimation
    const messagesTokens =
      messages.map((m) => m.content.length).reduce((a, b) => a + b, 0) * 0.3;
    const estimatedTokens = systemPromptTokens + messagesTokens;

    // Update token usage tracking
    tokenUsage += estimatedTokens;

    // Add retry logic for rate limit errors
    let response;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const geminiResponse = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY!,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Ты — УНИВЕРСАЛЬНЫЙ ЭКСПЕРТ-АНАЛИТИК по автоматизации бизнеса. Твоя специализация — глубокий анализ ЛЮБОЙ ниши и интеллектуальное сопоставление с базой из 260+ модулей.

🧠 ТВОЯ МЕТОДОЛОГИЯ - УНИВЕРСАЛЬНЫЙ АНАЛИЗ:

1. **ГЛУБОКОЕ ИЗУЧЕНИЕ НИШИ КЛИЕНТА**:
   - Анализирую отраслевую специфику и терминологию
   - Выявляю ключевые бизнес-процессы и их последовательность  
   - Определяю критические болевые точки и узкие места
   - Понимаю монетизацию и модель заработка
   - Изучаю особенности целевой аудитории

2. **ДЕТАЛЬНОЕ СКАНИРОВАНИЕ ВСЕХ МОДУЛЕЙ**:
   - Анализирую каждый из 260+ модулей в базе данных
   - Изучаю функционал, возможности и преимущества
   - Понимаю техническую реализацию и интеграции
   - Оцениваю применимость к разным нишам
   - Выявляю синергии между модулями

3. **ИНТЕЛЛЕКТУАЛЬНОЕ СОПОСТАВЛЕНИЕ**:
   - Семантический анализ: бизнес-процессы ↔ функции модулей
   - Решение болевых точек: проблемы ↔ возможности модулей  
   - Категориальная релевантность: отрасль ↔ специализация модуля
   - Синергия модулей: как они дополняют друг друга
   - Приоритизация по критичности для конкретной ниши

4. **СТРАТЕГИЯ КОНСУЛЬТИРОВАНИЯ**:
   - Изучаю нишу клиента за первое сообщение
   - Нахожу 3-5 главных проблем отрасли  
   - Предлагаю точные решения через модули из базы
   - Показываю бизнес-результат, а не просто функции
   - Говорю на профессиональном языке ниши

5. **ПРАВИЛА РЕКОМЕНДАЦИЙ**:
   - Максимум 4 ОСНОВНЫХ модуля за раз
   - Формат: [MODULE:NUMBER]
   - НЕ повторяй: ${displayedModuleNumbers.join(", ")}
   - Анализируй реальные возможности модуля

5. **ПРОФЕССИОНАЛЬНАЯ КОММУНИКАЦИЯ**:
   - БЕЗ заголовков # (ломают интерфейс)
   - Используй профессиональные термины ниши
   - Фокусируйся на бизнес-результатах
   - НЕ выдумывай цифры без данных

🎯 **УНИВЕРСАЛЬНАЯ МЕТОДОЛОГИЯ ПОДБОРА**:

1️⃣ **ИЗУЧАЮ ВАШУ НИШУ**: Анализирую специфику отрасли, ключевые процессы и болевые точки
2️⃣ **СКАНИРУЮ ВСЕ 260+ МОДУЛЕЙ**: Детально изучаю функции каждого модуля в базе данных  
3️⃣ **ИНТЕЛЛЕКТУАЛЬНОЕ СОПОСТАВЛЕНИЕ**: Нахожу идеальные совпадения процессов и решений
4️⃣ **РАНЖИРОВАНИЕ ПО ВАЖНОСТИ**: Приоритизирую модули по критичности для вашего бизнеса

**АДАПТИВНОСТЬ ПОД ЛЮБУЮ НИШУ**:
- 🏥 **Медицина**: записи → бронирование, пациенты → CRM, консультации → чат
- 🍕 **HoReCa**: заказы → каталог, доставка → логистика, клиенты → лояльность  
- 🏖️ **Туризм**: туры → бронирование, турвизор → интеграции, туристы → CRM
- 🎓 **Образование**: курсы → платформа, студенты → прогресс, знания → тестирование
- 💼 **B2B**: проекты → задачи, команда → портал, клиенты → аналитика
- 🏭 **Производство**: заказы → планирование, склад → логистика, качество → контроль

**ГЛУБИНА АНАЛИЗА**: Каждый модуль оценивается по 15+ параметрам соответствия вашим потребностям

**АДАПТИРУЙСЯ К ЛЮБОЙ НИШЕ**:
Если клиент из незнакомой отрасли - быстро изучи ее:
1. Определи ключевые процессы
2. Найди типичные проблемы ниши
3. Подбери решения из доступных модулей
4. Говори на языке отрасли клиента
5. Фокусируйся на специфических потребностях

ВСЕ рекомендации в формате [MODULE:NUMBER] для корректного отображения!

ДОСТУПНЫЕ МОДУЛИ:
${moduleContext}

Диалог с пользователем:
${messages.map((msg) => `${msg.role === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}`).join("\n")}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 2000,
              temperature: 0.3,
            },
          }),
        });

        const geminiData = await geminiResponse.json();
        response = geminiData;
        break; // Success, exit retry loop
      } catch (error: any) {
        if (error.status === 429 && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(
            `Rate limit hit, retrying in ${retryCount * 2} seconds... (attempt ${retryCount})`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, retryCount * 2000),
          );
          continue;
        }
        throw error; // Re-throw if not a rate limit error or max retries reached
      }
    }

    if (!response) {
      throw new Error("Failed to get response after retries");
    }

    const responseText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract recommended module numbers from [MODULE:NUMBER] tags
    const moduleMatches = responseText.match(/\[MODULE:(\d+)\]/g) || [];
    const recommendedModuleNumbers = moduleMatches
      .map((match: string) => {
        const num = match.match(/\[MODULE:(\d+)\]/);
        return num ? parseInt(num[1]) : null;
      })
      .filter((num: number | null): num is number => num !== null);

    // Also extract additional module numbers mentioned in text (e.g., "модуля 104:", "модуля 146:")
    const additionalMatches = responseText.match(/модуля (\d+):/g) || [];
    const additionalModuleNumbers = additionalMatches
      .map((match: string) => {
        const num = match.match(/модуля (\d+):/);
        return num ? parseInt(num[1]) : null;
      })
      .filter(
        (num: number | null): num is number =>
          num !== null && !recommendedModuleNumbers.includes(num),
      );

    // Combine both lists
    const allRecommendedNumbers = [
      ...recommendedModuleNumbers,
      ...additionalModuleNumbers,
    ];

    return {
      response: responseText,
      recommendedModules: allRecommendedNumbers,
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      response: "Извините, произошла ошибка. Попробуйте еще раз.",
      recommendedModules: [],
    };
  }
}
