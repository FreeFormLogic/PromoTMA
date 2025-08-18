// PromoTMA/server/ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";

// Инициализируем AI с вашим ключом
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Используем быструю и эффективную модель, чтобы избежать тайм-аутов
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Вспомогательная функция для получения рекомендаций по одному "пакету" модулей.
 */
async function getRecommendationsForChunk(
  chunk: string,
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[],
): Promise<string> {
  const systemPrompt = `Ты — элитный бизнес-архитектор. Проанализируй диалог с клиентом и, опираясь на предоставленный ЧАСТИЧНЫЙ СПИСОК модулей, выбери из него 2-3 САМЫХ подходящих решения.

ЧАСТИЧНЫЙ СПИСОК МОДУЛЕЙ:
---
${chunk}
---

ТВОЯ ЗАДАЧА:
1.  Изучи диалог, чтобы понять суть бизнеса клиента.
2.  Выбери из списка выше только те модули, которые являются ИДЕАЛЬНЫМ попаданием в потребности клиента.
3.  Для каждого выбранного модуля просто верни его номер в формате [MODULE:НОМЕР]. Не пиши описание.

ПРАВИЛА ФОРМАТИРОВАНИЯ:
-   Твой ответ должен состоять ТОЛЬКО из строк формата \`[MODULE:НОМЕР]\`.
-   Никаких вступлений, прощаний или лишнего текста.
-   Не предлагай модули, которые уже были показаны: [${alreadyShownModules.join(", ")}].
`;

  try {
    const result = await model.generateContent(
      `${systemPrompt}\n\nДиалог:\n${messages.map((msg) => `${msg.role === "user" ? "Клиент" : "Ассистент"}: ${msg.content}`).join("\n")}`,
    );
    return result.response.text();
  } catch (error) {
    console.error("Gemini chunk processing error:", error);
    return ""; // Возвращаем пустую строку в случае ошибки, чтобы не прерывать весь процесс
  }
}

/**
 * Основная функция, которая генерирует финальный ответ для чата.
 */
export async function generateAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[] = [],
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    // --- ЭТАП 1: Подготовка и разделение всей базы модулей на части ---
    const allModules = await storage.getAllModules();
    console.log(`🤖 Stage 1: Processing all ${allModules.length} modules.`);

    const formattedModules = allModules.map(
      (m) => `[MODULE:${m.number}] ${m.name} - ${m.description}`,
    );

    const CHUNK_SIZE = 60; // Оптимальный размер "пакета"
    const chunks: string[] = [];
    for (let i = 0; i < formattedModules.length; i += CHUNK_SIZE) {
      chunks.push(formattedModules.slice(i, i + CHUNK_SIZE).join("\n"));
    }
    console.log(`📦 Stage 1: Split modules into ${chunks.length} chunks.`);

    // --- ЭТАП 2: Параллельный анализ всех частей и сбор кандидатов ---
    const promises = chunks.map((chunk) =>
      getRecommendationsForChunk(chunk, messages, alreadyShownModules),
    );
    const results = await Promise.all(promises);
    console.log(
      `🧠 Stage 2: Received preliminary recommendations from all chunks.`,
    );

    const candidateModuleNumbers =
      results
        .join("\n")
        .match(/\[MODULE:(\d+)\]/g)
        ?.map((match) => parseInt(match.match(/(\d+)/)![0])) || [];

    if (candidateModuleNumbers.length === 0) {
      throw new Error("AI did not select any candidate modules.");
    }

    const uniqueCandidateNumbers = [...new Set(candidateModuleNumbers)];
    const candidateModules = allModules.filter((m) =>
      uniqueCandidateNumbers.includes(m.number),
    );
    const finalModuleDatabase = candidateModules
      .map((m) => `[MODULE:${m.number}] ${m.name} - ${m.description}`)
      .join("\n");

    console.log(
      `🎯 Stage 2: Aggregated ${candidateModules.length} unique candidate modules.`,
    );

    // --- ЭТАП 3: Финальный запрос к AI для выбора лучших из лучших и написания описаний ---
    const finalPrompt = `Ты — гениальный бизнес-консультант. Ты уже проанализировал всю базу модулей и отобрал лучших кандидатов. Теперь твоя задача — выбрать 4-5 самых идеальных и написать для них продающие описания.

СПИСОК ЛУЧШИХ МОДУЛЕЙ-КАНДИДАТОВ:
---
${finalModuleDatabase}
---

ТВОЯ ЗАДАЧА:
1.  Изучи диалог с клиентом еще раз.
2.  Выбери из списка кандидатов 4-5 САМЫХ лучших модуля, включая отраслевые, если они подходят.
3.  Для каждого напиши новое, короткое и убедительное объяснение (15-20 слов), показывая, как модуль решит задачу клиента.

САМЫЕ СТРОГИЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:
-   Твой ответ должен состоять ТОЛЬКО из строк формата \`[MODULE:НОМЕР] Твой новый, адаптированный текст.\`.
-   ОПИСАНИЕ ВСЕГДА ИДЕТ ПОСЛЕ ID МОДУЛЯ.
-   Никаких вступлений, прощаний или лишнего текста. Каждый модуль и его описание должны быть на новой строке.
`;

    console.log(
      "🚀 Stage 3: Sending final request to AI for ranking and description generation...",
    );
    const finalResult = await model.generateContent(
      `${finalPrompt}\n\nДиалог:\n${messages.map((msg) => `${msg.role === "user" ? "Клиент" : "Ассистент"}: ${msg.content}`).join("\n")}`,
    );
    const aiContent = finalResult.response.text();
    console.log("✅ Stage 3: Received final AI response.");

    const responseLines = aiContent
      .trim()
      .split("\n")
      .filter((line) => line.includes("[MODULE:"));
    if (responseLines.length === 0) {
      throw new Error("Final AI response did not contain valid module lines.");
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

// Эта функция больше не нужна, так как вся логика перенесена в generateAIResponse.
// Оставляем ее пустой для совместимости, если она где-то вызывается.
export async function analyzeBusinessContext(messages: string[]): Promise<any> {
  return Promise.resolve({});
}
