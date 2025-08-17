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
    const prompt = `You are analyzing a business type for a Telegram Mini App module recommendation system. 

Business: "${text}"

Available industry-specific modules in our database:
- Module 261: Tourism Agency Management (for travel/tourism)
- Module 239: Medical Clinic Management (for healthcare/medical)
- Module 240: Beauty Salon Management (for beauty/spa)
- Universal modules: payments, CRM, booking systems, e-commerce, marketing

Return ONLY valid JSON:
{
  "industry": "classification from list below",
  "size": "medium",
  "challenges": ["business challenges"],
  "goals": ["business goals"], 
  "relevantCategories": ["module categories"],
  "keywords": ["key terms"],
  "persona": "brief business description"
}

Industry classifications:
- restaurant: ресторан, кафе, пицца, суши, доставка еды → relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "E-COMMERCE"]
- tourism: туризм, турагентство, путешествия, отели → relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "CRM"]
- beauty: салон красоты, барбершоп, спа, маникюр → relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "CRM"]
- medical: клиника, врач, медицина, здоровье → relevantCategories=["ОТРАСЛЕВЫЕ РЕШЕНИЯ", "CRM"]
- transport: такси, транспорт, логистика, доставка → relevantCategories=["CRM", "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]
- services: психолог, коуч, консультации → relevantCategories=["CRM", "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]
- professional: юрист, бухгалтер, адвокат → relevantCategories=["CRM", "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]
- handmade: рукоделие, творчество, хендмейд → relevantCategories=["E-COMMERCE", "MARKETING"]
- retail: магазин, товары, продажи → relevantCategories=["E-COMMERCE", "MARKETING", "CRM"]
- universal: все остальные → relevantCategories=["E-COMMERCE", "MARKETING", "CRM"]`;

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
2. Выбери 4 самых подходящих модуля по номерам
3. Ответь в формате: [MODULE:номер] для каждого модуля
4. Добавь подходящий эмодзи и краткое объяснение

Примеры эмодзи по типам бизнеса:
🍽️ рестораны, 🚗 такси/транспорт, 💄 красота, 🏥 медицина, ✈️ туризм, 🧠 психология, ⚖️ юристы, 🧶 рукоделие, 🛍️ магазины

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
    console.log('🚨 Ошибка Gemini:', error);
    // Простой fallback без сложной логики
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