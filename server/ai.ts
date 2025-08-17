const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

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

// Простая система анализа бизнеса на основе ключевых слов
function analyzeBusinessFromText(text: string): BusinessAnalysis {
  const lowerText = text.toLowerCase();
  
  // Определяем индустрию по ключевым словам
  let industry = 'general';
  let persona = 'general business';
  let relevantCategories: string[] = [];
  
  if (lowerText.includes('турагентство') || lowerText.includes('туризм') || lowerText.includes('тур')) {
    industry = 'tourism';
    persona = 'турагентство';
    relevantCategories = ['E-COMMERCE', 'CRM', 'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ'];
  } else if (lowerText.includes('пицц') || lowerText.includes('ресторан') || lowerText.includes('кафе')) {
    industry = 'restaurant';
    persona = 'ресторан/пиццерия';
    relevantCategories = ['ОТРАСЛЕВЫЕ РЕШЕНИЯ', 'E-COMMERCE'];
  } else if (lowerText.includes('салон') || lowerText.includes('красота') || lowerText.includes('парикмахер')) {
    industry = 'beauty';
    persona = 'салон красоты';
    relevantCategories = ['ОТРАСЛЕВЫЕ РЕШЕНИЯ', 'CRM'];
  } else if (lowerText.includes('медицин') || lowerText.includes('клиник') || lowerText.includes('врач')) {
    industry = 'medical';
    persona = 'медицинская клиника';
    relevantCategories = ['ОТРАСЛЕВЫЕ РЕШЕНИЯ', 'CRM'];
  }
  
  return {
    industry,
    size: 'medium',
    challenges: [],
    goals: [],
    relevantCategories,
    keywords: text.split(' '),
    persona
  };
}

// Подсчет релевантности модуля для бизнеса
function calculateModuleRelevance(module: any, analysis: BusinessAnalysis): number {
  let score = 0;
  
  // Отраслевые модули получают высокие баллы для соответствующих отраслей
  if (analysis.industry === 'tourism') {
    // Для турагентств
    if ([13, 8, 42, 197].includes(module.number)) score += 100;
    if ([224, 15, 25].includes(module.number)) score += 80;
  } else if (analysis.industry === 'restaurant') {
    // Для ресторанов/пиццерий - отраслевые модули
    if ([236, 237, 238].includes(module.number)) score += 110;
    if ([225, 8, 224].includes(module.number)) score += 80;
  } else if (analysis.industry === 'beauty') {
    // Для салонов красоты
    if (module.number === 240) score += 110;
    if ([8, 224, 15].includes(module.number)) score += 80;
  } else if (analysis.industry === 'medical') {
    // Для медицинских клиник
    if (module.number === 239) score += 110;
    if ([8, 224, 15].includes(module.number)) score += 80;
  }
  
  // Универсально полезные модули
  if ([1, 224, 13, 8].includes(module.number)) score += 50;
  
  // Модули по категориям
  if (analysis.relevantCategories.includes(module.category)) {
    score += 30;
  }
  
  return score;
}

export async function analyzeBusinessContext(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<BusinessAnalysis> {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');
  return analyzeBusinessFromText(userMessages);
}

export async function generateAIResponse(messages: { role: 'user' | 'assistant'; content: string }[], alreadyShownModules: number[] = []): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import('./storage');
    const allModules = await storage.getAllModules();
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
    const analysis = analyzeBusinessFromText(lastUserMessage);
    
    console.log(`🎯 Анализ бизнеса: ${analysis.persona} (${analysis.industry})`);
    
    // Фильтруем модули, которые уже показывали
    const availableModules = allModules.filter(m => !alreadyShownModules.includes(m.number));
    
    // Подсчитываем релевантность каждого модуля
    const scoredModules = availableModules.map(module => ({
      ...module,
      relevanceScore: calculateModuleRelevance(module, analysis)
    }));
    
    // Сортируем по релевантности и берем топ-4
    const recommendedModules = scoredModules
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 4)
      .map(m => m.number);
    
    console.log(`🏆 Топ-4 модуля для ${analysis.persona}:`, recommendedModules);
    
    // Генерируем персонализированный ответ
    let response = '';
    switch (analysis.industry) {
      case 'tourism':
        response = '🌴 Для турагентства рекомендую модули, которые помогут увеличить продажи и улучшить сервис:';
        break;
      case 'restaurant':
        response = '🍕 Для ресторана/пиццерии подобрал специализированные решения:';
        break;
      case 'beauty':
        response = '💄 Для салона красоты рекомендую модули для записи клиентов и лояльности:';
        break;
      case 'medical':
        response = '🏥 Для медицинской клиники выбрал модули для управления пациентами:';
        break;
      default:
        response = 'Подобрал подходящие модули для вашего бизнеса:';
    }
    
    return {
      response,
      recommendedModules
    };
    
  } catch (error) {
    console.error('🚨 Ошибка AI:', error);
    
    // Простой fallback на основе ключевых слов
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
    
    let fallbackModules: number[] = [];
    let fallbackResponse = '';
    
    if (lastUserMessage.includes('турагентство') || lastUserMessage.includes('туризм')) {
      fallbackModules = [13, 8, 42, 197];
      fallbackResponse = '🌴 Для турагентства рекомендую эти модули:';
    } else if (lastUserMessage.includes('пицц') || lastUserMessage.includes('ресторан')) {
      fallbackModules = [236, 237, 238, 225];
      fallbackResponse = '🍕 Для ресторана/пиццерии:';
    } else if (lastUserMessage.includes('салон') || lastUserMessage.includes('красота')) {
      fallbackModules = [240, 8, 224, 15];
      fallbackResponse = '💄 Для салона красоты:';
    } else if (lastUserMessage.includes('медицин') || lastUserMessage.includes('клиник')) {
      fallbackModules = [239, 8, 224, 15];
      fallbackResponse = '🏥 Для медицинской клиники:';
    } else {
      fallbackModules = [1, 224, 15, 13];
      fallbackResponse = 'Для вашего бизнеса рекомендую:';
    }
    
    return {
      response: fallbackResponse,
      recommendedModules: fallbackModules.filter(num => !alreadyShownModules.includes(num))
    };
  }
}