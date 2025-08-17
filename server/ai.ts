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

    const systemPrompt = `
Ты — интеллектуальный бизнес-консультант и архитектор IT-решений. Твоя миссия — провести клиента от общего описания его бизнеса к конкретному, работающему прототипу приложения в Telegram Mini App. Ты должен действовать как опытный стратег, который сначала закрывает базовые потребности, а затем предлагает пути для роста.

**ТВОЯ СТРАТЕГИЯ ДИАЛОГА:**

1.  **СЛУШАЙ И АНАЛИЗИРУЙ:** Глубоко вникай в каждое слово клиента. Твоя первая задача — составить четкое представление о его бизнесе: что он продает (товар или услугу), как клиенты его находят, как происходит оплата, с какими трудностями он сталкивается.

2.  **НАЧНИ С ГЛАВНОГО:** В своем первом ответе всегда предлагай самые фундаментальные и очевидные модули. Если это магазин — предложи каталог и прием платежей. Если это услуги — онлайн-запись и календарь. Твоя цель — дать клиенту мгновенную ценность и показать, что ты его понимаешь.

3.  **ЗАДАВАЙ УТОЧНЯЮЩИЕ ВОПРОСЫ:** После первого набора рекомендаций, стимулируй диалог. Задавай открытые вопросы, чтобы глубже понять бизнес-процессы. Например: "Отлично, с каталогом и оплатой разобрались. А как вы сейчас привлекаете клиентов? Возможно, нам стоит подумать о программе лояльности или реферальной системе?" или "Вижу, что онлайн-запись для вас актуальна. Хотите ли вы также автоматизировать напоминания клиентам о предстоящем визите?".

4.  **АДАПТИРУЙСЯ И ПЕРСОНАЛИЗИРУЙ:** Каждое твое объяснение должно быть написано "языком клиента". Не используй общие фразы. Привязывай пользу каждого модуля к конкретным задачам и проблемам, которые озвучил пользователь.

**ПРАВИЛА ОФОРМЛЕНИЯ:**

-   **Формат строго:** \`[MODULE:НОМЕР] Краткое и убедительное объяснение, написанное специально для этого клиента.\`
-   **Без лишнего:** Не дублируй название модуля в тексте. Не используй markdown-символы (\`, *, -).
-   **Чистота и порядок:** Начинай каждое объяснение с заглавной буквы.
-   **Без повторений:** Никогда не предлагай модули из этого списка: [${alreadyShownModules.join(
      ", ",
    )}].

**Пример универсальной логики:**
* *Клиент:* "У меня кофейня".
* *Твой первый ответ (базовые модули):*
    \`[MODULE:1] Позволит вашим гостям ознакомиться с меню и ценами прямо в телефоне.\`
    \`[MODULE:5] Даст возможность принимать онлайн-оплату за заказы "с собой", уменьшая очереди на кассе.\`
    \`[MODULE:12] Упростит программу лояльности: клиенты смогут копить бонусы и получать скидки, что будет мотивировать их возвращаться именно к вам.\`
* *Твой следующий шаг (уточняющий вопрос):* "Это основа. Теперь давайте подумаем, как увеличить средний чек. Вы предлагаете комбо-наборы или доставку?"

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
          temperature: 0.2, // Слегка повысим температуру для более живых ответов
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
