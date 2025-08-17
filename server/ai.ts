// Используем Gemini 2.5 Pro через прямые HTTP запросы
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

// Вспомогательная функция для вызова API для одного чанка
async function getRecommendationsForChunk(
  chunk: string,
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[],
) {
  const systemPrompt = `
Ты — элитный бизнес-архитектор. Твоя задача — проанализировать диалог с клиентом и, опираясь на предоставленный ЧАСТИЧНЫЙ СПИСОК модулей, выбрать из него 2-3 САМЫХ подходящих решения.

ЧАСТИЧНЫЙ СПИСОК МОДУЛЕЙ:
---
${chunk}
---

ТВОЯ ЗАДАЧА:
1.  Изучи диалог, чтобы понять суть бизнеса клиента.
2.  Выбери из списка выше только те модули, которые являются ИДЕАЛЬНЫМ попаданием в потребности клиента.
3.  Для каждого выбранного модуля напиши новое, короткое и убедительное объяснение (15-20 слов), которое напрямую показывает клиенту ценность этого решения для его бизнеса.

САМЫЕ СТРОГИЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:
-   Твой ответ должен состоять ТОЛЬКО из строк формата \`[MODULE:НОМЕР] Твой новый, адаптированный текст.\`.
-   **ОПИСАНИЕ ВСЕГДА ИДЕТ ПОСЛЕ ID МОДУЛЯ.**
-   Никаких вступлений ("Вот, что я подобрал..."), никаких прощаний, только строки с модулями.
-   Не предлагай модули из этого списка уже показанных: [${alreadyShownModules.join(
    ", ",
  )}].

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
        maxOutputTokens: 1024,
        temperature: 0.2,
      },
    }),
  });

  if (!apiResponse.ok) {
    const errorText = await apiResponse.text();
    console.error(
      "Gemini API Error (Chunk Processing):",
      apiResponse.status,
      errorText,
    );
    // Не бросаем ошибку, а возвращаем пустой результат, чтобы не ломать весь процесс
    return "";
  }

  const apiData = await apiResponse.json();
  return apiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function generateAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[] = [],
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import("./storage");
    const allModules = await storage.getAllModules();
    console.log(`🤖 AI processing ${allModules.length} total modules.`);

    // 1. Форматируем все модули в строки
    const formattedModules = allModules.map(
      (m) => `[MODULE:${m.id}] ${m.title} - ${m.description}`,
    );

    // 2. Делим на чанки (куски) адекватного размера
    const CHUNK_SIZE = 80; // Оптимальный размер чанка, чтобы не превышать лимиты
    const chunks: string[] = [];
    for (let i = 0; i < formattedModules.length; i += CHUNK_SIZE) {
      chunks.push(formattedModules.slice(i, i + CHUNK_SIZE).join("\n"));
    }
    console.log(`📦 Split modules into ${chunks.length} chunks.`);

    // 3. Отправляем параллельные запросы для каждого чанка
    const promises = chunks.map((chunk) =>
      getRecommendationsForChunk(chunk, messages, alreadyShownModules),
    );
    const results = await Promise.all(promises);
    console.log(`✅ Received responses from all chunks.`);

    // 4. Собираем и очищаем результаты
    const combinedResponse = results.join("\n").trim();
    const finalLines = combinedResponse
      .split("\n")
      .filter((line) => line.startsWith("[MODULE:") && line.trim() !== "");

    if (finalLines.length === 0) {
      console.warn("AI did not return any valid module recommendations.");
      throw new Error("No modules recommended by AI.");
    }

    const response = finalLines.join("\n");

    const recommendedModules = finalLines
      .map((line) => {
        const match = line.match(/\[MODULE:(\d+)\]/);
        return match ? parseInt(match[1]) : null;
      })
      .filter(
        (id): id is number => id !== null && !alreadyShownModules.includes(id),
      );

    return {
      response,
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

// Пустая функция analyzeBusinessContext, так как основная логика теперь в generateAIResponse
export async function analyzeBusinessContext(messages: string[]): Promise<any> {
  return Promise.resolve({});
}
