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
    // Для турагентств - точная приоритизация
    if (module.number === 13) score += 120; // Программа лояльности
    if (module.number === 8) score += 110;  // Интеграция с CRM
    if (module.number === 42) score += 105; // Push-уведомления
    if (module.number === 197) score += 100; // GoPay и OVO
    if ([224, 15, 25].includes(module.number)) score += 70;
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
    
    // Создаем детализированный ответ с объяснениями для каждого модуля
    const moduleExplanations = recommendedModules.map(moduleNum => {
      const module = allModules.find(m => m.number === moduleNum);
      if (!module) return '';
      
      switch (analysis.industry) {
        case 'tourism':
          if (moduleNum === 13) return `[MODULE:13] Позволит внедрить бонусные карты, начислять кэшбэк и баллы за покупку туров.`;
          if (moduleNum === 8) return `[MODULE:8] Обеспечит подключение сторонних сервисов, таких как Турвизор, для поиска и бронирования туров прямо в приложении.`;
          if (moduleNum === 42) return `[MODULE:42] Даст возможность отправлять клиентам уведомления о горячих турах, изменении статуса бронирования или специальных акциях.`;
          if (moduleNum === 197) return `[MODULE:197] Позволит принимать оплату от клиентов на Бали через популярную местную систему GoPay.`;
          break;
        case 'restaurant':
          if (moduleNum === 236) return `[MODULE:236] Специализированный модуль для управления медицинской клиникой с записью пациентов.`;
          if (moduleNum === 237) return `[MODULE:237] Отраслевое решение для фитнес-клуба с управлением абонементами и тренировками.`;
          if (moduleNum === 238) return `[MODULE:238] Комплексная система для салона красоты с онлайн-записью и управлением услугами.`;
          break;
        case 'beauty':
          if (moduleNum === 240) return `[MODULE:240] Специализированное отраслевое решение для салона красоты с записью клиентов и управлением услугами.`;
          if (moduleNum === 8) return `[MODULE:8] Синхронизация данных с популярными CRM-платформами для ведения клиентской базы.`;
          if (moduleNum === 224) return `[MODULE:224] Автоматический прием платежей с интеграцией популярных платежных систем.`;
          break;
        case 'medical':
          if (moduleNum === 239) return `[MODULE:239] Отраслевой модуль для медицинских клиник с записью пациентов и управлением приемами.`;
          if (moduleNum === 8) return `[MODULE:8] Интеграция с медицинскими информационными системами.`;
          if (moduleNum === 224) return `[MODULE:224] Безопасная обработка платежей за медицинские услуги.`;
          break;
      }
      
      // Универсальные объяснения для популярных модулей
      if (moduleNum === 1) return `[MODULE:1] Создаст красивую витрину с AI-описаниями товаров для увеличения конверсии.`;
      if (moduleNum === 224) return `[MODULE:224] Упростит прием платежей с автоматической обработкой транзакций.`;
      if (moduleNum === 15) return `[MODULE:15] Даст возможность создавать подписки на товары с регулярными платежами.`;
      if (moduleNum === 13) return `[MODULE:13] Поможет удерживать клиентов через систему бонусов и вознаграждений.`;
      
      return `[MODULE:${moduleNum}] ${module.benefits.replace(/\*\*/g, '').split('.')[0]}.`;
    });
    
    const detailedResponse = `${response}\n\n${moduleExplanations.join('\n\n')}`;
    
    return {
      response: detailedResponse,
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
    
    // Добавляем объяснения для fallback модулей
    const filteredModules = fallbackModules.filter(num => !alreadyShownModules.includes(num));
    const fallbackExplanations = filteredModules.map(moduleNum => {
      if (lastUserMessage.includes('турагентство')) {
        if (moduleNum === 13) return `[MODULE:13] Позволит внедрить бонусные карты и кэшбэк для клиентов турагентства.`;
        if (moduleNum === 8) return `[MODULE:8] Обеспечит интеграцию с системами бронирования туров.`;
        if (moduleNum === 42) return `[MODULE:42] Отправка уведомлений о горящих турах и акциях.`;
        if (moduleNum === 197) return `[MODULE:197] Прием платежей через GoPay для клиентов на Бали.`;
      } else if (lastUserMessage.includes('ресторан') || lastUserMessage.includes('пицц')) {
        if (moduleNum === 236) return `[MODULE:236] Управление медицинской клиникой.`;
        if (moduleNum === 237) return `[MODULE:237] Управление фитнес-клубом.`;
        if (moduleNum === 238) return `[MODULE:238] Управление салоном красоты.`;
        if (moduleNum === 225) return `[MODULE:225] Система онлайн-заказов еды.`;
      }
      return `[MODULE:${moduleNum}] Полезный модуль для вашего бизнеса.`;
    });
    
    const detailedFallbackResponse = `${fallbackResponse}\n\n${fallbackExplanations.join('\n\n')}`;
    
    return {
      response: detailedFallbackResponse,
      recommendedModules: filteredModules
    };
  }
}