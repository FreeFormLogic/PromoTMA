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

    // Подготавливаем полное представление модулей для передачи в промпт
    const finalModuleDatabase = allModules
      .map((m) => `[MODULE:${m.number}] ${m.name} - ${m.description}`)
      .join("\n");

    const finalPrompt = `Ты — гениальный бизнес-консультант. У тебя есть полный список доступных модулей для решения бизнес-задач.

ИНСТРУКЦИЯ (СТРОГОЕ СОБЛЮДЕНИЕ):
1) Сначала выдай 1-2 предложения вводного текста с общей рекомендацией для клиента.
2) Затем для каждого выбранного модуля выведи:
   - Первая строка: [MODULE:НОМЕР] Название модуля
   - Вторая строка: короткое продающее описание (15-20 слов), показывающее, как модуль решит задачу клиента.
   - Затем одна пустая строка (разделитель между модулями).
3) В конце ОБЯЗАТЕЛЬНО добавь один вопрос, задающий направление для показа следующих модулей (например: "Хотите увидеть модули по отрасли, по цене или по приоритету?").

Никаких других строк, меток, нумерации или пояснений. Нельзя использовать markdown-оформление (тройные обратные кавычки, **, * и т.п.).

СПИСОК ВСЕХ МОДУЛЕЙ (используй его для выбора и привязывай описания к реальным именам и номерам):
---
${finalModuleDatabase}
---

Диалог:
${messages.map((msg) => `${msg.role === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}`).join("\n")}`;

    console.log("🚀 Stage 3: Sending final request to AI for ranking and description generation...");
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
                text: finalPrompt,
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
    const aiContent = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiContent) {
      console.error("No AI content found in response:", apiData);
      throw new Error("No AI response content");
    }

    console.log("AI Response Preview:", aiContent.substring(0, 200));

    // Небольшая очистка: убираем окружение markdown и лишние символы, но сохраняем структуру текста
    let cleanedContent = aiContent
      .replace(/^```[\s\S]*?```$/gm, "")
      .replace(/\*\*/g, "")
      .replace(/\*+/g, "")
      .trim();

    // Попытаемся извлечь пары: [MODULE:id] + описание (следующая непустая строка/параграф)
    const pairs: { id: number; moduleLine: string; description: string }[] = [];

    // Собираем позиции всех строк с [MODULE:ID]
    const moduleLineRegex = /\[MODULE:(\d+)\][^\n\r]*/g;
    let m: RegExpExecArray | null;
    const modulePositions: { index: number; id: number; moduleLine: string }[] = [];
    while ((m = moduleLineRegex.exec(cleanedContent)) !== null) {
      const id = Number(m[1]);
      modulePositions.push({ index: m.index, id, moduleLine: (m[0] || '').trim() });
    }

    for (let i = 0; i < modulePositions.length; i++) {
      const start = modulePositions[i].index;
      const end = i + 1 < modulePositions.length ? modulePositions[i + 1].index : cleanedContent.length;
      const afterModule = cleanedContent.slice(start, end);
      const rest = afterModule.replace(modulePositions[i].moduleLine, "").trim();

      // Описание - первый параграф или первая непустая строка после строки с модулем
      let description = "";
      if (rest) {
        const paragraphMatch = rest.match(/^[^\r\n]+(?:\r?\n(?!\r?\n)[^\r\n]+)*/);
        if (paragraphMatch) description = paragraphMatch[0].trim();
      }

      pairs.push({ id: modulePositions[i].id, moduleLine: modulePositions[i].moduleLine, description });
    }

    // Fallback: если пары не найдены, пробуем ассоциацию по параграфам (это поможет, если AI выводит описание до метки)
    if (pairs.length === 0) {
      const paragraphs = cleanedContent.split(/\n\s*\n/).map((p: string) => p.trim()).filter((s: string) => Boolean(s));
      for (let i = 0; i < paragraphs.length; i++) {
        const ids = Array.from(paragraphs[i].matchAll(/\[MODULE:(\d+)\]/g)).map(x => Number((x as RegExpMatchArray)[1]));
        if (ids.length > 0) {
          let description = "";
          if (i + 1 < paragraphs.length && !/\[MODULE:(\d+)\]/.test(paragraphs[i + 1])) {
            description = paragraphs[i + 1];
          } else if (i - 1 >= 0 && !/\[MODULE:(\d+)\]/.test(paragraphs[i - 1])) {
            // Описание может идти перед меткой
            description = paragraphs[i - 1];
          }
          for (const id of ids) {
            const moduleLineMatch = paragraphs[i].match(/\[MODULE:\d+\][^\n]*/);
            pairs.push({ id, moduleLine: moduleLineMatch ? moduleLineMatch[0] : `[MODULE:${id}]`, description });
          }
        }
      }
    }

    if (pairs.length === 0) {
      throw new Error("Final AI response did not contain valid module lines.");
    }

    // Уникальные id и фильтрация уже показанных
    const uniqueIds = Array.from(new Set(pairs.map(p => p.id)));
    const recommendedModules = uniqueIds.filter(id => !alreadyShownModules.includes(id)).sort((a, b) => a - b);

    // Восстанавливаем порядок вывода: вводный текст (до первой метки), затем для каждой пары модуль + описание и пустая строка
    const firstModuleIndex = cleanedContent.search(/\[MODULE:(\d+)\]/);
    let intro = "";
    if (firstModuleIndex > 0) {
      intro = cleanedContent.slice(0, firstModuleIndex).trim();
    }

    const rebuiltLines: string[] = [];
    if (intro) rebuiltLines.push(intro);

    for (const p of pairs) {
      rebuiltLines.push(p.moduleLine);
      if (p.description) rebuiltLines.push(p.description);
      rebuiltLines.push("");
    }

    // Попробуем сохранить вопрос от AI, если он есть в конце; иначе добавим стандартный
    const tail = cleanedContent.slice(Math.max(...pairs.map(p => cleanedContent.lastIndexOf(p.moduleLine))) + 1).trim();
    if (tail && /\?$/.test(tail)) {
      rebuiltLines.push(tail);
    } else if (tail && !/\[MODULE:(\d+)\]/.test(tail)) {
      // если tail содержит текст без меток, добавляем его (вдруг это вопрос)
      rebuiltLines.push(tail);
    } else {
      rebuiltLines.push("Хотите увидеть модули по отрасли, по цене или по приоритету?");
    }

    const finalResponse = rebuiltLines.join("\n").trim();

    return {
      response: finalResponse,
      recommendedModules,
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      response: "Извините, произошла ошибка при генерации ответа.",
      recommendedModules: [],
    };
  }
}