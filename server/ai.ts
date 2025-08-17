import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GOOGLE_API_KEY не найден в переменных окружения');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

interface BusinessAnalysis {
  industry: string;
  size: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
  persona: string;
}

// AI-powered анализ бизнеса через Gemini
async function analyzeBusinessFromText(text: string): Promise<BusinessAnalysis> {
  try {
    const prompt = `Analyze this business type and return ONLY valid JSON:

Business: "${text}"

Return JSON format:
{
  "industry": "one of: tourism, restaurant, beauty, medical, services, professional, handmade, retail, nonprofit, universal",
  "size": "medium",
  "challenges": ["business challenges"],
  "goals": ["business goals"], 
  "relevantCategories": ["module categories"],
  "keywords": ["key terms"],
  "persona": "brief business description"
}

Rules:
- restaurants/cafes: industry="restaurant", relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "E-COMMERCE"]
- tourism/travel: industry="tourism", relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "CRM"]
- beauty/spa: industry="beauty", relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "CRM"]  
- medical/clinic: industry="medical", relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "CRM"]
- psychologists/coaches: industry="services", relevantCategories=["CRM", "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]
- lawyers/consultants: industry="professional", relevantCategories=["CRM", "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]
- handmade/crafts: industry="handmade", relevantCategories=["E-COMMERCE", "MARKETING"]
- other: industry="universal", relevantCategories=["E-COMMERCE", "MARKETING", "CRM"]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            industry: { type: "string" },
            size: { type: "string" },
            challenges: { type: "array", items: { type: "string" } },
            goals: { type: "array", items: { type: "string" } },
            relevantCategories: { type: "array", items: { type: "string" } },
            keywords: { type: "array", items: { type: "string" } },
            persona: { type: "string" }
          }
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{}');
    console.log('✅ Gemini business analysis result:', result);
    
    // Добавляем значения по умолчанию если их нет
    return {
      industry: result.industry || 'universal',
      size: result.size || 'medium',
      challenges: result.challenges || [],
      goals: result.goals || [],
      relevantCategories: result.relevantCategories || ['E-COMMERCE', 'MARKETING', 'CRM'],
      keywords: result.keywords || text.split(/\s+/).filter(word => word.length > 2),
      persona: result.persona || text.slice(0, 50)
    };
  } catch (error) {
    console.log('🚨 Gemini analysis failed, using fallback:', error.message);
    // Простой fallback если Gemini недоступен
    const keywords = text.split(/\s+/).filter(word => word.length > 2);
    return {
      industry: 'universal',
      size: 'medium',
      challenges: [],
      goals: [],
      relevantCategories: ['E-COMMERCE', 'MARKETING', 'CRM'],
      keywords,
      persona: text.slice(0, 50)
    };
  }
}

// Универсальный подсчет релевантности модуля на основе анализа текста
function calculateModuleRelevance(module: any, analysis: BusinessAnalysis, originalText: string): number {
  let score = 0;
  const userText = originalText.toLowerCase();
  const moduleText = `${module.name} ${module.description} ${module.benefits}`.toLowerCase();
  
  // 1. Семантический анализ - проверяем совпадение ключевых слов
  const userWords = userText.split(/\s+/).filter(word => word.length > 2);
  userWords.forEach(word => {
    if (moduleText.includes(word)) {
      score += 30; // Базовые баллы за совпадение
      // Двойные баллы если слово в названии модуля
      if (module.name.toLowerCase().includes(word)) {
        score += 30;
      }
    }
  });
  
  // 2. Приоритет категорий на основе анализа
  if (analysis.relevantCategories.includes(module.category)) {
    // Высший приоритет для первой категории (обычно отраслевые решения)
    const categoryIndex = analysis.relevantCategories.indexOf(module.category);
    score += (100 - categoryIndex * 20);
  }
  
  // 3. Специальные модули для конкретных индустрий
  if (module.category === 'ОТРАСЛЕВЫЕ РЕШЕНИЯ') {
    if (analysis.industry === 'tourism' && module.number === 261) {
      score += 500; // Максимальный приоритет для туризма
    } else if (analysis.industry === 'restaurant' && [236, 237, 238].includes(module.number)) {
      score += 400; // Высокий приоритет для ресторанов
    } else if (analysis.industry === 'beauty' && module.number === 240) {
      score += 400; // Для салонов красоты
    } else if (analysis.industry === 'medical' && module.number === 239) {
      score += 400; // Для медицинских клиник
    }
  }
  
  // 4. Универсальные модули для разных типов бизнеса
  if (analysis.industry === 'services' || analysis.industry === 'professional') {
    // Для услуг (психологи, юристы, коучи) приоритет на медицинскую клинику (есть запись), платежи
    const serviceModules = [239, 240, 224]; // Медицинская клиника (запись к врачам), салон красоты (запись к мастерам), платежи
    if (serviceModules.includes(module.number)) {
      score += 120; // Высокий приоритет для модулей с записью
    }
    // Меньше баллов за e-commerce модули кроме платежей
    if (module.category === 'E-COMMERCE' && module.number !== 224) {
      score -= 60;
    }
    // Модули с бронированием/записью получают дополнительные баллы
    if (moduleText.includes('запись') || moduleText.includes('бронирован') || moduleText.includes('расписан')) {
      score += 100;
    }
  } else if (analysis.industry === 'handmade') {
    // Для рукоделия приоритет на e-commerce, но с упором на креативность
    const handmadeModules = [224, 232, 230]; // Платежи, предзаказы, повторные заказы
    if (handmadeModules.includes(module.number)) {
      score += 70;
    }
    // Дополнительные баллы за модули, подходящие для творческих товаров
    if (moduleText.includes('предзаказ') || moduleText.includes('резервиров') || 
        moduleText.includes('портфолио') || moduleText.includes('галерея')) {
      score += 50;
    }
  } else {
    // Для других бизнесов базовые универсальные модули
    const universalModules = [224, 225]; // Платежи, трекинг
    if (universalModules.includes(module.number)) {
      score += 50;
    }
  }
  
  // 5. Локальная специфика (Индонезия/Бали)
  if (userText.includes('бали') || userText.includes('индонези')) {
    if (module.number === 197) score += 200; // GoPay/OVO
    if (module.number === 198) score += 150; // Dana
    if (module.number === 199) score += 150; // LinkAja
  }
  
  // 6. Анализ по типу бизнеса из контекста
  if (userText.includes('доставк')) {
    if (module.number === 237 || module.number === 225) score += 100; // Доставка и трекинг
  }
  if (userText.includes('онлайн') || userText.includes('интернет')) {
    if (module.category === 'E-COMMERCE') score += 50;
  }
  if (userText.includes('клиент') || userText.includes('crm')) {
    if (module.category === 'CRM') score += 60;
  }
  if (userText.includes('запись') || userText.includes('бронирован') || userText.includes('встреч')) {
    if (module.number === 239 || module.number === 240) score += 120; // Модули с записью
  }
  if (userText.includes('консультаци') || userText.includes('сеанс') || userText.includes('услуг')) {
    if (module.category === 'CRM' || module.category === 'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ') score += 60;
  }
  
  // 7. Штраф за нерелевантные игровые модули для серьезного бизнеса
  if (module.category === 'ИГРЫ' && !userText.includes('игр') && !userText.includes('развлеч')) {
    score -= 100;
  }
  
  return Math.max(0, score); // Не допускаем отрицательные баллы
}

export async function analyzeBusinessContext(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<BusinessAnalysis> {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
  return await analyzeBusinessFromText(userMessages);
}

export async function generateAIResponse(messages: { role: 'user' | 'assistant'; content: string }[], alreadyShownModules: number[] = []): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import('./storage');
    const allModules = await storage.getAllModules();
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    const analysis = await analyzeBusinessFromText(lastUserMessage);
    
    console.log(`🎯 Анализ бизнеса: ${analysis.persona} (${analysis.industry})`);
    
    // Фильтруем модули, которые уже показывали
    const availableModules = allModules.filter(m => !alreadyShownModules.includes(m.number));
    
    // Подсчитываем релевантность каждого модуля
    const scoredModules = availableModules.map(module => ({
      ...module,
      relevanceScore: calculateModuleRelevance(module, analysis, lastUserMessage)
    }));
    
    // Сортируем по релевантности и берем топ-4
    const recommendedModules = scoredModules
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4)
      .map(m => m.number);
    
    console.log(`🏆 Топ-4 модуля для ${analysis.persona}:`, recommendedModules);
    
    // Генерируем краткий ответ с модулями без описаний (они будут в карточках)
    const moduleReferences = recommendedModules.map(num => `[MODULE:${num}]`).join(' ');
    
    // Определяем эмодзи на основе AI анализа
    let businessTypeEmoji = '🚀';
    switch (analysis.industry) {
      case 'restaurant': businessTypeEmoji = '🍕'; break;
      case 'tourism': businessTypeEmoji = '✈️'; break;
      case 'beauty': businessTypeEmoji = '💄'; break;
      case 'medical': businessTypeEmoji = '🏥'; break;
      case 'services': businessTypeEmoji = '🧠'; break;
      case 'professional': businessTypeEmoji = '⚖️'; break;
      case 'handmade': businessTypeEmoji = '🧶'; break;
      case 'retail': businessTypeEmoji = '🛍️'; break;
      case 'nonprofit': businessTypeEmoji = '❤️'; break;
      default: businessTypeEmoji = '🚀'; break;
    }
    
    const cleanResponse = `${businessTypeEmoji} Для вашего бизнеса рекомендую модули, которые помогут увеличить продажи и улучшить сервис:\n\n${moduleReferences}`;
    
    return {
      response: cleanResponse,
      recommendedModules
    };
    
  } catch (error) {
    console.error('🚨 Ошибка AI:', error);
    
    // Минимальный fallback - используем базовые модули
    const basicModules = [224, 225, 15, 13]; // Платежи, трекинг, лояльность
    
    const moduleReferences = basicModules
      .filter(num => !alreadyShownModules.includes(num))
      .map(num => `[MODULE:${num}]`)
      .join(' ');
    
    return {
      response: `🚀 Рекомендую универсальные модули для вашего бизнеса:\n\n${moduleReferences}`,
      recommendedModules: basicModules.filter(num => !alreadyShownModules.includes(num))
    };
  }
}