const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

if (!GEMINI_API_KEY) {
  console.error('GOOGLE_API_KEY не найден в переменных окружения');
}

interface BusinessAnalysis {
  industry: string;
  size: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
  persona: string;
}

export async function analyzeBusinessContext(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<BusinessAnalysis> {
  try {
    const prompt = `Проанализируй бизнес на основе диалога и верни JSON:
    
Диалог: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}

Верни JSON в формате:
{
  "industry": "отрасль",
  "size": "small|medium|large", 
  "challenges": ["вызов1", "вызов2"],
  "goals": ["цель1", "цель2"],
  "relevantCategories": ["категория1", "категория2"],
  "keywords": ["ключевое1", "ключевое2"],
  "persona": "описание типа бизнеса"
}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY!
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Ты - эксперт по бизнес-анализу. Изучай любую нишу и отвечай только валидным JSON без дополнительного текста.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.1
        }
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (content) {
      let responseText = content.trim();
      
      // Remove markdown code blocks if present
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      return JSON.parse(responseText);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error analyzing business context:', error);
    return {
      industry: 'general',
      size: 'medium',
      challenges: [],
      goals: [],
      relevantCategories: [],
      keywords: [],
      persona: 'general business'
    };
  }
}

export async function generateAIResponse(messages: { role: 'user' | 'assistant'; content: string }[], alreadyShownModules: number[] = []): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import('./storage');
    const allModules = await storage.getAllModules();
    console.log(`🤖 Отправляем ВСЕ ${allModules.length} модулей в AI для правильной обработки`);
    
    // Get conversation context
    const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    
    // Фильтруем модули, которые уже показывали
    const availableModules = allModules.filter(m => !alreadyShownModules.includes(m.number));
    
    console.log(`📤 AI анализирует ${availableModules.length} доступных модулей`);
    
    // Создаем сокращенный промпт для AI (из-за лимитов API)
    const prompt = `
Ты - эксперт по бизнес-анализу и подбору IT-решений. 

Пользователь описал свой бизнес: "${lastUserMessage}"

ВАЖНЫЕ ПРАВИЛА:
- Для ТУРАГЕНТСТВА рекомендуй: 13 (Программа лояльности), 8 (Интеграция с CRM), 42 (Push-уведомления), 197 (GoPay и OVO)
- Для ПИЦЦЕРИИ/РЕСТОРАНА: 236, 237, 238 (отраслевые для еды)
- Для САЛОНА КРАСОТЫ: 240 (отраслевой для красоты)
- Для МЕДКЛИНИКИ: 239 (отраслевой для медицины)

У меня есть ${availableModules.length} модулей в разных категориях: E-COMMERCE, ИНТЕГРАЦИИ, CRM, ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ, ИНДОНЕЗИЯ, ОТРАСЛЕВЫЕ РЕШЕНИЯ.

Выбери 4 САМЫХ ПОДХОДЯЩИХ номера модулей для "${lastUserMessage}" и объясни выбор.

Ответь в JSON формате:
{
  "response": "Персонализированный ответ с объяснением",
  "recommendedModules": [номер1, номер2, номер3, номер4]
}`;

    // Отправляем запрос в Gemini AI
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY!
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.1
        }
      })
    });

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (content) {
      let responseText = content.trim();
      
      // Убираем markdown блоки если есть
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      try {
        const aiResult = JSON.parse(responseText);
        console.log(`🎯 AI выбрал модули:`, aiResult.recommendedModules);
        console.log(`💬 AI ответ:`, aiResult.response);
        
        return {
          response: aiResult.response || 'Подобрал подходящие модули для вашего бизнеса:',
          recommendedModules: aiResult.recommendedModules || []
        };
      } catch (parseError) {
        console.error('Ошибка парсинга ответа AI:', parseError);
        throw parseError;
      }
    }
    
    throw new Error('Пустой ответ от AI');
  } catch (error) {
    console.error('🚨 Ошибка AI:', error);
    
    // Простой fallback если AI не работает
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
    console.log(`🔄 Используем простой fallback для: "${lastUserMessage}"`);
    
    let fallbackModules: number[] = [];
    let fallbackResponse = '';
    
    if (lastUserMessage.includes('пицц') || lastUserMessage.includes('кафе') || lastUserMessage.includes('ресторан')) {
      fallbackModules = [238, 236, 237, 225];
      fallbackResponse = `🍕 Для пиццерии рекомендую специализированные модули:`;
    } else if (lastUserMessage.includes('салон') || lastUserMessage.includes('красота')) {
      fallbackModules = [240, 8, 224, 15]; 
      fallbackResponse = `💄 Для салона красоты подойдут эти модули:`;
    } else if (lastUserMessage.includes('медицин') || lastUserMessage.includes('клиник')) {
      fallbackModules = [239, 8, 224, 15]; 
      fallbackResponse = `🏥 Для медицинской клиники:`;
    } else {
      fallbackModules = [1, 224, 15, 13];
      fallbackResponse = `Для вашего бизнеса рекомендую эти модули:`;
    }
    
    return {
      response: fallbackResponse,
      recommendedModules: fallbackModules.filter(num => !alreadyShownModules.includes(num))
    };
  }
}