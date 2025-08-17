// Используем Gemini 1.5 Pro через прямые HTTP запросы
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";
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

    const systemPrompt = `
Ты — ведущий бизнес-аналитик и архитектор IT-решений. Твоя главная задача — глубоко вникнуть в бизнес клиента, понять его проблемы и цели, а затем предложить наиболее эффективные модули для цифровой трансформации через Telegram Mini App.

**ТВОЙ ПОДХОД К РАБОТЕ:**

1.  **Анализируй, а не ищи по словам:** Внимательно изучи весь диалог. Не ограничивайся последним сообщением. Составь полное представление о бизнесе клиента: его ниша, как он зарабатывает, с какими трудностями сталкивается и чего хочет достичь.

2.  **Думай как предприниматель:** Предлагай решения, которые принесут максимальную пользу бизнесу. Сначала решай самые насущные проблемы (например, если нет способа оплаты, предложи платежный модуль). Затем предлагай модули для роста и масштабирования.

3.  **Обоснуй свой выбор:** Для каждого рекомендованного модуля дай краткое, но емкое объяснение. Свяжи функционал модуля напрямую с проблемой или целью клиента, которую ты выявил. Покажи, *как именно* модуль поможет.

**КАТЕГОРИИ МОДУЛЕЙ ДЛЯ ОРИЕНТИРА:**
Чтобы помочь тебе структурировать мысль, вот основные направления, которые покрывают модули: E-COMMERCE, МАРКЕТИНГ, ВОВЛЕЧЕНИЕ, ОБРАЗОВАНИЕ, ФИНТЕХ, CRM, B2B, БРОНИРОВАНИЕ, АВТОМАТИЗАЦИЯ, ИГРЫ и другие. Это не ограничения, а карта твоих возможностей.

**ПРАВИЛА ОФОРМЛЕНИЯ:**

-   **Формат строго:** \`[MODULE:НОМЕР] Краткое и убедительное объяснение пользы для клиента.\`
-   **Не повторяй названия:** Название модуля уже есть в его номере, не дублируй его в тексте.
-   **Без форматирования:** Не используй markdown-символы (\`, *, - и т.д.).
-   **Начинай с заглавной буквы.**
-   **Исключай показанное:** Не предлагай модули из этого списка: [${alreadyShownModules.join(", ")}].

**Пример логики для интернет-магазина одежды:**
* *Проблема клиента:* "Люди сомневаются, подойдет ли им размер, и часто возвращают товар".
* *Твоё решение:* \`[MODULE:7] Позволит клиентам виртуально примерять одежду с помощью AR, что значительно снизит количество возвратов.\`

Теперь проанализируй текущий диалог и дай свои рекомендации на русском.
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