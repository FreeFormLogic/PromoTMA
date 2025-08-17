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

export async function analyzeBusinessContext(
  messages: string[],
): Promise<BusinessAnalysis> {
  try {
    const prompt = `Ты - эксперт по бизнес-анализу. Проанализируй диалог и извлеки суть бизнеса клиента.

ТВОЯ ЗАДАЧА:
1. Определи нишу бизнеса (industry).
2. Выяви ключевые проблемы (challenges) и цели (goals).
3. Определи самые важные категории модулей для этого бизнеса (relevantCategories), например: E-COMMERCE, МАРКЕТИНГ, БРОНИРОВАНИЕ, CRM.
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

    const response = await fetch(GEMINI_API_URL, {
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error in analyzeBusinessContext API call:", errorText);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error("No content in analysis response");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing business context:", error);
    return {
      industry: "general",
      challenges: [],
      goals: [],
      relevantCategories: ["E-COMMERCE", "МАРКЕТИНГ"],
      keywords: [],
    };
  }
}

// Упрощенная функция для оценки релевантности модуля
function calculateModuleRelevance(
  module: any,
  analysis: BusinessAnalysis,
): number {
  let score = 0;
  const searchText =
    `${module.title} ${module.description} ${module.category}`.toLowerCase();

  // +50 очков за совпадение по категории
  if (
    analysis.relevantCategories.some((cat) =>
      searchText.includes(cat.toLowerCase()),
    )
  ) {
    score += 50;
  }

  // +20 очков за каждое совпадение по ключевому слову
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

    // --- ЭТАП 1: Глубокий анализ бизнеса клиента ---
    console.log("🚀 Starting business analysis...");
    const analysis = await analyzeBusinessContext(userMessages);
    console.log("✅ Analysis complete:", analysis);

    const { storage } = await import("./storage");
    const allModules = await storage.getAllModules();

    // --- ЭТАП 2: Локальный пред-отбор самых релевантных модулей ---
    const scoredModules = allModules
      .map((module) => ({
        ...module,
        relevanceScore: calculateModuleRelevance(module, analysis),
      }))
      .filter(
        (module) =>
          !alreadyShownModules.includes(module.id) && module.relevanceScore > 0,
      );

    // Сортируем по релевантности и берем топ-40
    scoredModules.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topModules = scoredModules.slice(0, 40);

    if (topModules.length === 0) {
      console.warn(
        "⚠️ No relevant modules found after local filtering. Aborting.",
      );
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
      `🧠 Found ${topModules.length} relevant modules to send for final recommendation.`,
    );

    // --- ЭТАП 3: Финальный запрос к Gemini с лучшими модулями ---
    const systemPrompt = `
Ты — гениальный бизнес-консультант. Твоя задача — изучить диалог, проанализировать предоставленный СПИСОК ЛУЧШИХ МОДУЛЕЙ и выбрать из него 4-5 самых идеальных решений для клиента.

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

Пример для клиента "пиццерия":
\`[MODULE:145] Организует прием заказов на доставку и самовывоз, управляя статусами от готовки до вручения.\`
\`[MODULE:5] Даст возможность клиентам оплачивать заказы онлайн картой или через Telegram Pay.\`

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
                        msg.role === "user" ? "Клиент" : "Ассистент"
                      }: ${msg.content}`,
                  )
                  .join("\n")}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.25, // Чуть больше креативности для лучших описаний
        },
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(
        "Gemini API Error (Final Recommendation):",
        apiResponse.status,
        errorText,
      );
      throw new Error(`API failed: ${apiResponse.status} - ${errorText}`);
    }

    const apiData = await apiResponse.json();
    const aiContent = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiContent) {
      console.error(
        "No AI content found in final recommendation response:",
        apiData,
      );
      throw new Error("No AI response content");
    }

    console.log("AI Response Preview:", aiContent.substring(0, 200));

    const cleanedContent = aiContent.trim();
    const responseLines = cleanedContent
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
        const numberMatch = line.match(/\[MODULE:(\d+)\]/i);
        return numberMatch ? parseInt(numberMatch[1]) : 0;
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
