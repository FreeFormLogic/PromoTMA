import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface BusinessAnalysis {
  industry: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
}

export async function analyzeBusinessContext(messages: string[]): Promise<BusinessAnalysis> {
  console.log("🧠 Analyzing business context with Gemini AI...");
  
  const conversationText = messages.join("\n");
  
  const prompt = `Проанализируй разговор с клиентом и определи:

РАЗГОВОР:
${conversationText}

Ответь ТОЛЬКО в формате JSON:
{
  "industry": "тип бизнеса (restaurant, travel, retail, beauty, fitness, medical, education, auto, real_estate, logistics, legal или general)",
  "challenges": ["основные вызовы бизнеса"],
  "goals": ["цели и задачи"],
  "relevantCategories": ["подходящие категории модулей"],
  "keywords": ["ключевые слова из разговора"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    console.log(`✅ Gemini analysis complete: ${result.industry}`);
    return result;
  } catch (error) {
    console.error("❌ Gemini analysis failed:", error);
    // Fallback to simple detection
    return {
      industry: "general",
      challenges: ["Общие бизнес-задачи"],
      goals: ["Автоматизация процессов"],
      relevantCategories: ["E-COMMERCE", "МАРКЕТИНГ", "CRM"],
      keywords: []
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
    console.log(`🤖 Gemini AI processing ${allModules.length} total modules.`);

    // Stage 1: Business context analysis with Gemini
    const messageTexts = messages.map(m => `${m.role}: ${m.content}`);
    const analysis = await analyzeBusinessContext(messageTexts);
    
    console.log(`🧠 Business analysis complete: ${analysis.industry}`);
    
    // Stage 2: Prepare context for Gemini module selection
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    
    // Create summary of available modules (instead of sending full data)
    const availableModules = allModules.filter(module => !alreadyShownModules.includes(module.number));
    const moduleSummary = availableModules.slice(0, 50) // Ограничиваем до 50 модулей для экономии токенов
      .map(module => `${module.number}: ${module.name} - ${module.description.substring(0, 100)}`)
      .join("\n");
    
    const moduleSelectionPrompt = `Ты эксперт по подбору модулей для бизнеса.

КОНТЕКСТ РАЗГОВОРА:
${conversationText}

АНАЛИЗ БИЗНЕСА:
- Тип: ${analysis.industry}
- Задачи: ${analysis.challenges.join(", ")}
- Цели: ${analysis.goals.join(", ")}

ДОСТУПНЫЕ МОДУЛИ (первые 50):
${moduleSummary}

Выбери 3 САМЫХ подходящих модуля для этого бизнеса.
Учти специфику бизнеса и контекст разговора.

ОСОБЫЕ ПРАВИЛА:
- Для ресторанов на Бали/в Индонезии ОБЯЗАТЕЛЬНО включи модули 120 (GoPay/OVO) и 123 (DANA/LinkAja)
- Для турагентств выбирай модули бронирования и CRM
- Для салонов красоты - бронирование времени и лояльность
- Для фитнес-центров - абонементы и тренировки

Ответь ТОЛЬКО в формате JSON:
{
  "selectedModules": [номер1, номер2, номер3],
  "reasoning": "краткое объяснение выбора"
}`;

    const moduleSelection = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: moduleSelectionPrompt,
    });

    const selectionResult = JSON.parse(moduleSelection.text || '{"selectedModules": [1, 5, 18]}');
    let recommendedModuleNumbers = selectionResult.selectedModules || [1, 5, 18];
    
    // Специальная логика для географического контекста
    const textContent = conversationText.toLowerCase();
    if (textContent.includes('бали') || textContent.includes('индонез')) {
      if (analysis.industry === 'restaurant' && !recommendedModuleNumbers.includes(120)) {
        recommendedModuleNumbers = [120, 123, ...recommendedModuleNumbers.slice(0, 1)];
      }
    }
    
    console.log(`🎯 Gemini selected modules:`, recommendedModuleNumbers);
    console.log(`📝 Reasoning:`, selectionResult.reasoning);
    
    // Stage 3: Get module data and generate descriptions
    const recommendedModules = allModules.filter(module => 
      recommendedModuleNumbers.includes(module.number)
    );
    
    // Stage 4: Generate contextual descriptions with Gemini
    const descriptionPrompt = `Создай краткие, продающие описания модулей для бизнеса "${analysis.industry}".

КОНТЕКСТ: ${conversationText}

МОДУЛИ:
${recommendedModules.map(m => `${m.number}: ${m.name} - ${m.description}`).join("\n")}

Для каждого модуля напиши ОДНО предложение, объясняющее КАК ИМЕННО он поможет этому бизнесу.
Используй конкретные примеры для этой индустрии.

Ответь в формате:
[MODULE:номер] описание
[MODULE:номер] описание
[MODULE:номер] описание`;

    const descriptionsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: descriptionPrompt,
    });

    const response = descriptionsResponse.text || recommendedModules.map(m => 
      `[MODULE:${m.number}] ${m.description}`
    ).join("\n");
    
    console.log(`✅ Gemini AI generation complete`);
    console.log(`- Selected modules:`, recommendedModuleNumbers);
    console.log(`- Generated descriptions for business: ${analysis.industry}`);
    
    return {
      response: response,
      recommendedModules: recommendedModuleNumbers
    };
    
  } catch (error) {
    console.error("❌ Gemini AI failed:", error);
    throw new Error(`Ошибка Gemini AI: ${error}`);
  }
}