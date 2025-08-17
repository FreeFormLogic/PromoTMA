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

    // Форматируем все модули для передачи в промпт
    const modulesDatabase = allModules
      .map(
        (m) =>
          `Module ${m.id}: ${m.title} - ${m.features.join(" ")} - ${
            m.description
          }`,
      )
      .join("\n");

    const systemPrompt = `
Ты — высококлассный бизнес-архитектор. Твоя задача — проанализировать диалог с клиентом и, опираясь на предоставленную базу модулей, предложить ему самые подходящие решения.

**БАЗА ДОСТУПНЫХ МОДУЛЕЙ:**
---
${modulesDatabase}
---

**ТВОЯ ЗАДАЧА:**

1.  **Изучи диалог:** Пойми суть бизнеса клиента, его цели и проблемы.
2.  **Выбери лучшее:** Из БАЗЫ МОДУЛЕЙ выше выбери 3-5 самых релевантных для этого клиента. Не придумывай модули, используй только те, что есть в списке.
3.  **Перепиши описание:** Для каждого выбранного модуля напиши новое, короткое и убедительное объяснение (до 20 слов), которое напрямую обращается к бизнесу клиента и показывает, как именно этот модуль решит его задачу.

**САМЫЕ СТРОГИЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:**

-   Твой ответ должен состоять **ТОЛЬКО** из строк формата \`[MODULE:НОМЕР] Твой новый, адаптированный текст.\`.
-   **ОПИСАНИЕ ВСЕГДА ИДЕТ ПОСЛЕ ID МОДУЛЯ.**
-   Никаких вступлений ("Вот, что я подобрал..."), никаких прощаний, никаких заголовков или лишних символов. Только строки с модулями.
-   Никогда не предлагай модули из этого списка уже показанных: [${alreadyShownModules.join(
      ", ",
    )}].

**Пример для клиента "турагентство":**
\`[MODULE:28] Позволит вашим клиентам бронировать туры онлайн в удобное для них время, без звонков и ожидания.\`
\`[MODULE:1] Создаст привлекательную витрину с вашими лучшими предложениями по отелям и направлениям.\`
\`[MODULE:152] Будет автоматически отправлять клиентам напоминания о предстоящей поездке и информацию о рейсе.\`
\`[MODULE:5] Даст возможность безопасно принимать онлайн-оплату за путевки прямо в приложении.\`

Проанализируй диалог и предоставь свой ответ строго по правилам.
`;

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
                text: `${systemPrompt}\n\nДиалог:\n${messages
                  .map(
                    (msg) =>
                      `${
                        msg.role === "user" ? "Пользователь" : "Ассистент"
                      }: ${msg.content}`,
                  )
                  .join("\n")}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.2,
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

    console.log("AI Response Preview:", aiContent.substring(0, 200));

    // Очистка ответа от возможных артефактов, хотя новый промпт должен минимизировать их.
    let cleanedContent = aiContent.trim();

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

    // Фильтруем ответ, чтобы оставить только строки, содержащие [MODULE:X]
    const responseLines = cleanedContent
      .split("\n")
      .filter((line) => line.includes("[MODULE:"))
      .join("\n");

    return {
      response: responseLines,
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
