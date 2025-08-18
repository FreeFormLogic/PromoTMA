// PromoTMA/server/ai.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";

// Инициализируем AI с вашим ключом
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Используем быструю и эффективную модель

export interface BusinessAnalysis {
  industry: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
}

/**
 * ЭТАП 1: AI анализирует диалог и определяет суть бизнеса.
 */
export async function analyzeBusinessContext(
  messages: string[],
): Promise<BusinessAnalysis> {
  console.log("🚀 Stage 1: Starting business analysis with Gemini...");
  const conversationText = messages.join("\n");

  const prompt = `Ты - эксперт по бизнес-анализу. Проанализируй диалог и извлеки суть бизнеса клиента. Исправь возможные опечатки.

ТВОЯ ЗАДАЧА:
1. Определи нишу бизнеса (industry).
2. Выяви ключевые проблемы (challenges) и цели (goals).
3. Определи самые важные категории модулей (relevantCategories), например: E-COMMERCE, МАРКЕТИНГ, БРОНИРОВАНИЕ, CRM, ТУРИЗМ.
4. Сгенерируй ключевые слова (keywords), описывающие этот бизнес.

ДИАЛОГ:
${conversationText}

Отвечай только валидным JSON без дополнительного текста. Пример для "турагентство":
{
  "industry": "Туристическое агентство",
  "challenges": ["Подбор туров", "Коммуникация с клиентами", "Прием оплат"],
  "goals": ["Увеличить продажи туров", "Автоматизировать бронирование"],
  "relevantCategories": ["БРОНИРОВАНИЕ", "CRM", "ФИНТЕХ", "E-COMMERCE"],
  "keywords": ["туры", "отели", "путевки", "бронирование", "клиенты", "путешествия"]
}`;

  try {
    const result = await model.generateContent(prompt, {
        responseMimeType: "application/json",
    });
    const responseText = result.response.text();
    const analysis = JSON.parse(responseText);
    console.log("✅ Stage 1: Analysis complete:", analysis);
    return analysis;
  } catch (error) {
    console.error("❌ Gemini analysis failed:", error);
    // В случае сбоя возвращаем общие параметры для поиска
    return {
      industry: "general business",
      challenges: [],
      goals: [],
      relevantCategories: ["E-COMMERCE", "МАРКЕТИНГ"],
      keywords: [],
    };
  }
}

/**
 * Локальная функция для оценки релевантности модуля на основе анализа AI.
 */
function calculateModuleRelevance(module: any, analysis: BusinessAnalysis): number {
  let score = 0;
  const searchText = `${module.name} ${module.description} ${module.category}`.toLowerCase();

  if (analysis.relevantCategories.some(cat => searchText.includes(cat.toLowerCase()))) {
    score += 50;
  }
  for (const keyword of analysis.keywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      score += 20;
    }
  }
  return score;
}

/**
 * Основная функция, которая генерирует ответ для чата.
 */
export async function generateAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[] = [],
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const userMessages = messages.map((m) => m.content);

    // --- ЭТАП 1: Глубокий анализ бизнеса клиента ---
    const analysis = await analyzeBusinessContext(userMessages);

    // --- ЭТАП 2: Локальный отбор самых релевантных модулей из ВСЕЙ базы ---
    const allModules = await storage.getAllModules();
    console.log(`🧠 Stage 2: Filtering all ${allModules.length} modules based on AI analysis...`);

    const scoredModules = allModules
      .map(module => ({
        ...module,
        relevanceScore: calculateModuleRelevance(module, analysis),
      }))
      .filter(module => !alreadyShownModules.includes(module.number) && module.relevanceScore > 0);

    scoredModules.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topModules = scoredModules.slice(0, 40); // Берем топ-40 для финального анализа

    if (topModules.length === 0) {
      console.warn("⚠️ No relevant modules found after local filtering.");
      return {
        response: "К сожалению, я не смог подобрать подходящие модули. Попробуйте описать ваш бизнес подробнее.",
        recommendedModules: [],
      };
    }

    const modulesDatabase = topModules.map(m => `[MODULE:${m.number}] ${m.name} - ${m.description}`).join("\n");
    console.log(`🎯 Stage 2: Selected ${topModules.length} most relevant modules for final recommendation.`);

    // --- ЭТАП 3: Финальный запрос к Gemini для написания красивых описаний ---
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

    console.log("🚀 Stage 3: Sending final recommendation request to AI...");
    const result = await model.generateContent(`${systemPrompt}\n\nДиалог:\n${messages.map(msg => `${msg.role === "user" ? "Клиент" : "Ассистент"}: ${msg.content}`).join("\n")}`);
    const aiContent = result.response.text();

    console.log("✅ Stage 3: Received AI response.");

    const responseLines = aiContent.trim().split("\n").filter(line => line.includes("[MODULE:"));
    if (responseLines.length === 0) {
      console.warn("AI returned content, but no valid module lines found.");
      return { response: "Мне не удалось подобрать точные рекомендации. Пожалуйста, расскажите о вашем бизнесе немного больше.", recommendedModules: [] };
    }

    const finalResponse = responseLines.join("\n");
    const recommendedModules = responseLines.map(line => {
        const match = line.match(/\[MODULE:(\d+)\]/i);
        return match ? parseInt(match[1]) : 0;
    }).filter(id => id > 0 && !alreadyShownModules.includes(id));

    return {
      response: finalResponse,
      recommendedModules: [...new Set(recommendedModules)].sort((a, b) => a - b),
    };
  } catch (error) {
    console.error("AI Main Logic Error:", error);
    return {
      response: "Извините, произошла ошибка при генерации ответа.",
      recommendedModules: [],
    };
  }
}