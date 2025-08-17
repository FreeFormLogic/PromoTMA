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
    
    const prompt = `Ты эксперт по рекомендации Telegram Mini App модулей для бизнеса.

Запрос пользователя: "${userText}"

Доступные модули в базе данных:
${modulesList}

Задача:
1. Проанализируй тип бизнеса пользователя
2. Выбери 4 самых подходящих модуля по номерам из списка выше
3. Ответь в формате: [MODULE:номер] для каждого модуля
4. Добавь подходящий эмодзи и краткое объяснение

Примеры эмодзи по типам бизнеса:
🍽️ рестораны, 🚗 такси/транспорт, 💄 красота, 🏥 медицина, ✈️ туризм, 🧠 психология, ⚖️ юристы, 🧶 рукоделие, 🛍️ магазины

Для такси например подходят: модули с GPS, платежи, уведомления, CRM для клиентов.
Для рукоделия: e-commerce модули, платежи, каталоги, предзаказы.
Для психологов: запись на прием, CRM, платежи, уведомления.

Отвечай только номерами модулей в формате [MODULE:число] и кратким текстом с эмодзи.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const aiText = response.text || '';
    
    // Извлекаем номера модулей из ответа Gemini
    const moduleMatches = aiText.match(/\[MODULE:(\d+)\]/g) || [];
    const recommendedModuleNumbers = moduleMatches
      .map(match => parseInt(match.match(/\d+/)?.[0] || '0'))
      .filter(num => num > 0)
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