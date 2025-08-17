import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GOOGLE_API_KEY не найден в переменных окружения');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

export async function generateAIResponse(
  messages: { role: 'user' | 'assistant'; content: string }[], 
  alreadyShownModules: number[] = []
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import('./storage');
    const allModules = await storage.getAllModules();
    
    const userText = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
    
    // Полная информация о модулях для Gemini
    const modulesList = allModules
      .filter(m => !alreadyShownModules.includes(m.number))
      .map(m => `#${m.number}: ${m.name} - ${m.description} (${m.category})`)
      .join('\n');
    
    const prompt = `Ты эксперт по адаптации модулей. Найди 4 лучших модуля для "${userText}". ${alreadyShownModules.length > 0 ? `Исключи: ${alreadyShownModules.join(', ')}` : ''}

Модули:
${modulesList}

ОБЯЗАТЕЛЬНО предложи 4 модуля! Адаптируй их под бизнес креативно.

Формат (БЕЗ эмодзи):
[MODULE:225] - Как применить для этого бизнеса
[MODULE:230] - Как применить для этого бизнеса
[MODULE:232] - Как применить для этого бизнеса
[MODULE:238] - Как применить для этого бизнеса`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp", 
      contents: prompt,
    });

    const aiText = response.text || '';
    
    // Ищем строки в формате [MODULE:число]
    const moduleMatches = aiText.match(/\[MODULE:(\d+)\]/g) || [];
    const recommendedModuleNumbers = moduleMatches
      .map(match => parseInt(match.match(/\d+/)?.[0] || '0'))
      .filter(num => num > 0)
      .filter((num, index, arr) => arr.indexOf(num) === index) // убираем дубликаты
      .filter(num => !alreadyShownModules.includes(num)) // исключаем уже показанные
      .slice(0, 4);

    console.log(`🏆 Gemini recommended modules:`, recommendedModuleNumbers);
    
    return {
      response: aiText,
      recommendedModules: recommendedModuleNumbers
    };
  } catch (error) {
    console.log('🚨 Ошибка Gemini:', (error as Error).message);
    // Простой fallback без сложной логики
    return {
      response: '🚀 Рекомендую универсальные модули для вашего бизнеса:\n\n[MODULE:224] [MODULE:225] [MODULE:236] [MODULE:237]',
      recommendedModules: [224, 225, 236, 237]
    };
  }
}