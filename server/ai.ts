// PromoTMA/server/ai.ts

// Используем Gemini 2.5 Pro через прямые HTTP запросы
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

export interface BusinessAnalysis {
  industry: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
}

/**
 * Выполняет сетевой запрос к API с логикой повторных попыток при сбоях.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Обработка ошибки превышения лимитов (rate limiting)
      if (response.status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000; // Экспоненциальная задержка
        console.warn(
          `Rate limit hit. Retrying in ${Math.round(delay / 1000)}s... (Attempt ${i + 1}/${maxRetries})`,
        );
        await new Promise((res) => setTimeout(res, delay));
        continue; // Переходим к следующей попытке
      }

      // Другие ошибки сервера
      const errorText = await response.text();
      console.error(
        `API call failed with status ${response.status}:`,
        errorText,
      );
      throw new Error(`API call failed with status ${response.status}`);
    } catch (error) {
      console.error(`Fetch attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error; // Бросаем ошибку после последней попытки
    }
  }
  throw new Error("API call failed after multiple retries.");
}

export async function analyzeBusinessContext(
  messages: string[],
): Promise<BusinessAnalysis> {
  const prompt = `Ты - эксперт по бизнес-анализу. Проанализируй диалог и извлеки суть бизнеса клиента.

ТВОЯ ЗАДАЧА:
1. Определи нишу бизнеса (industry).
2. Выяви ключевые проблемы (challenges) и цели (goals).
3. Определи самые важные категории модулей (relevantCategories), например: E-COMMERCE, МАРКЕТИНГ, БРОНИРОВАНИЕ, CRM.
4. Сгенерируй ключевые слова (keywords), описывающие этот бизнес.

ДИАЛОГ:
${messages.join("\n")}

Отвечай только валидным JSON без дополнительного текста. Пример:
{
  "industry": "Пиццерия на Бали",
  "challenges": ["Привлечение туристов", "Организация доставки"],
  "goals": ["Увеличить онлайн-заказы", "Создать программу лояльности"],
  "relevantCategories": ["E-COMMERCE", "МАРКЕТИНГ", "ЛОГИСТИКА"],
  "keywords": ["пицца", "доставка", "меню", "онлайн-заказ", "Бали", "туристы"]
}`;

  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    };

    const data = await fetchWithRetry(GEMINI_API_URL, options);
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error(
        "No content in analysis response:",
        JSON.stringify(data, null, 2),
      );
      throw new Error("No content in analysis response");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to analyze business context:", error);
    // Возвращаем базовую структуру в случае критической ошибки
    return {
      industry: "general business",
      challenges: [],
      goals: [],
      relevantCategories: ["E-COMMERCE", "МАРКЕТИНГ"],
      keywords: [],
    };
  }
}

function calculateModuleRelevance(
  module: any,
  analysis: BusinessAnalysis,
): number {
  let score = 0;
  const searchText =
    `${module.title} ${module.description} ${module.category}`.toLowerCase();

  if (
    analysis.relevantCategories.some((cat) =>
      searchText.includes(cat.toLowerCase()),
    )
  ) {
    score += 50;
  }
  for (const keyword of analysis.keywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      score += 20;
    }
  }
  return score;
}

export async function generateAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[] = [],
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const userMessages = messages.map((m) => m.content);

    // --- ЭТАП 1: Анализ бизнеса ---
    console.log("🚀 Stage 1: Starting business analysis...");
    const analysis = await analyzeBusinessContext(userMessages);
    console.log("✅ Stage 1: Analysis complete:", analysis);

    // --- ЭТАП 2: Локальный отбор релевантных модулей ---
    const { storage } = await import("./storage");
    const allModules = await storage.getAllModules();

    const scoredModules = allModules
      .map((module) => ({
        ...module,
        relevanceScore: calculateModuleRelevance(module, analysis),
      }))
      .filter(
        (module) =>
          !alreadyShownModules.includes(module.id) && module.relevanceScore > 0,
      );

    scoredModules.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topModules = scoredModules.slice(0, 40);

    if (topModules.length === 0) {
      console.warn("⚠️ No relevant modules found after local filtering.");
      return {
        response:
          "К сожалению, я не смог подобрать подходящие модули. Попробуйте описать ваш бизнес подробнее.",
        recommendedModules: [],
      };
    }

    const modulesDatabase = topModules
      .map((m) => `[MODULE:${m.id}] ${m.title} - ${m.description}`)
      .join("\n");
    console.log(
      `🧠 Stage 2: Selected ${topModules.length} relevant modules to send for final recommendation.`,
    );

    // --- ЭТАП 3: Финальный запрос к Gemini с лучшими модулями ---
    const systemPrompt = `Ты — гениальный бизнес-консультант. Твоя задача — изучить диалог, проанализировать предоставленный СПИСОК ЛУЧШИХ МОДУЛЕЙ и выбрать из него 4-5 самых идеальных решений для клиента.

СПИСОК ЛУЧШИХ МОДУЛЕЙ (уже отсортированы по релевантности):
---
${modulesDatabase}
---

ТВОЯ ЗАДАЧА:
1.  Изучи диалог, чтобы понять бизнес клиента (${analysis.industry}). Его цели: ${analysis.goals.join(", ")}.
2.  Выбери из списка выше 4-5 САМЫХ подходящих модуля.
3.  Для каждого напиши новое, короткое и убедительное объяснение (15-20 слов), показывая, как модуль решит задачу клиента.

САМЫЕ СТРОГИЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:
-   Твой ответ должен состоять ТОЛЬКО из строк формата \`[MODULE:НОМЕР] Твой новый, адаптированный текст.\`.
-   ОПИСАНИЕ ВСЕГДА ИДЕТ ПОСЛЕ ID МОДУЛЯ.
-   Никаких вступлений, прощаний или лишнего текста.
`;

    const options = {
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
                text: `${systemPrompt}\n\nДиалог:\n${messages.map((msg) => `${msg.role === "user" ? "Клиент" : "Ассистент"}: ${msg.content}`).join("\n")}`,
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.25 },
      }),
    };

    console.log("🚀 Stage 3: Sending final recommendation request to AI...");
    const data = await fetchWithRetry(GEMINI_API_URL, options);

    const candidate = data.candidates?.[0];
    if (!candidate) {
      const blockReason = data.promptFeedback?.blockReason;
      if (blockReason) {
        console.error(
          `Request blocked by safety filters. Reason: ${blockReason}`,
        );
        throw new Error(`Safety filters blocked the request: ${blockReason}`);
      }
      throw new Error("No candidates in final recommendation response.");
    }

    if (candidate.finishReason === "SAFETY") {
      console.error(
        "Response stopped due to safety filters. Check module descriptions for problematic content.",
      );
      throw new Error("Response stopped by safety filters.");
    }

    const aiContent = candidate.content?.parts?.[0]?.text;
    if (!aiContent) {
      console.error(
        "No AI content text found in final recommendation response:",
        JSON.stringify(data, null, 2),
      );
      throw new Error("No AI response content text found");
    }

    console.log("✅ Stage 3: Received AI response.");

    const responseLines = aiContent
      .trim()
      .split("\n")
      .filter((line) => line.includes("[MODULE:"));
    if (responseLines.length === 0) {
      console.warn("AI returned content, but no valid module lines found.");
      return {
        response:
          "Мне не удалось подобрать точные рекомендации. Пожалуйста, расскажите о вашем бизнесе немного больше.",
        recommendedModules: [],
      };
    }

    const finalResponse = responseLines.join("\n");
    const recommendedModules = responseLines
      .map((line) => {
        const match = line.match(/\[MODULE:(\d+)\]/i);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((id) => id > 0 && !alreadyShownModules.includes(id));

    return {
      response: finalResponse,
      recommendedModules: [...new Set(recommendedModules)].sort(
        (a, b) => a - b,
      ),
    };
  } catch (error) {
    console.error("AI Main Logic Error:", error);
    return {
      response: "Извините, произошла ошибка при генерации ответа.",
      recommendedModules: [],
    };
  }
}
