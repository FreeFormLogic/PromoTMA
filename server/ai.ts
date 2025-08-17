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

// Универсальный подсчет релевантности модуля на основе анализа текста
function calculateModuleRelevance(module: any, analysis: BusinessAnalysis): number {
  let score = 0;
  const userText = analysis.persona.toLowerCase();
  
  // Универсальный семантический анализ по ключевым словам в названии и описании модуля
  const moduleText = `${module.name} ${module.description} ${module.benefits}`.toLowerCase();
  
  // Проверяем релевантность через ключевые слова пользователя
  const userKeywords = userText.split(' ').filter(word => word.length > 3);
  userKeywords.forEach(keyword => {
    if (moduleText.includes(keyword)) {
      score += 50; // Базовая релевантность
    }
  });
  
  // Анализируем отраслевую принадлежность через универсальные паттерны
  if (module.category === 'ОТРАСЛЕВЫЕ РЕШЕНИЯ') {
    // Отраслевые модули получают высокий приоритет если они подходят
    if (userText.includes('турагентство') || userText.includes('туризм') || userText.includes('тур')) {
      if (module.number === 261) score += 300; // Управление турагентством
    }
    if (userText.includes('ресторан') || userText.includes('пицц') || userText.includes('кафе') || userText.includes('еда')) {
      if ([236, 237, 238].includes(module.number)) score += 200;
    }
    if (userText.includes('салон') || userText.includes('красот') || userText.includes('парикмахер')) {
      if (module.number === 240) score += 200;
    }
    if (userText.includes('клиник') || userText.includes('медицин') || userText.includes('врач')) {
      if (module.number === 239) score += 200;
    }
  }
  
  // Универсальные модули для любого бизнеса
  if (module.category === 'E-COMMERCE') {
    score += 40; // E-commerce модули полезны большинству бизнесов
    
    // Платежные системы критичны для любого бизнеса
    if (module.number === 224) score += 60;
    
    // Для Бали особенно важны локальные платежи
    if (userText.includes('бали') || userText.includes('индонези')) {
      if (module.number === 197) score += 100; // GoPay/OVO
    }
  }
  
  // CRM и маркетинг полезны всем
  if (module.category === 'MARKETING' || module.category === 'CRM') {
    score += 35;
  }
  
  // Программы лояльности универсальны
  if (module.name.toLowerCase().includes('лояльност') || module.name.toLowerCase().includes('бонус')) {
    score += 45;
  }
  
  // Интеграции полезны для автоматизации
  if (module.category === 'INTEGRATIONS' || module.name.toLowerCase().includes('интеграци')) {
    score += 30;
  }
  
  // Дополнительные баллы за соответствие категории
  if (analysis.relevantCategories.includes(module.category)) {
    score += 25;
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
    
    // Генерируем универсальный ответ на основе анализа
    const response = `Проанализировал ваш запрос и подобрал оптимальные модули для ${analysis.persona}:`;
    
    // Создаем универсальные объяснения на основе контекста и преимуществ модулей
    const moduleExplanations = recommendedModules.map(moduleNum => {
      const module = allModules.find(m => m.number === moduleNum);
      if (!module) return '';
      
      // Генерируем релевантное объяснение на основе бизнес-контекста
      const userText = analysis.persona.toLowerCase();
      let explanation = '';
      
      // Извлекаем ключевое преимущество из benefits
      const mainBenefit = module.benefits.replace(/\*\*/g, '').split(',')[0];
      
      // Адаптируем объяснение под контекст пользователя
      if (module.category === 'ОТРАСЛЕВЫЕ РЕШЕНИЯ') {
        // Для отраслевых модулей используем полное описание
        explanation = module.description;
      } else if (module.category === 'E-COMMERCE') {
        // Для e-commerce модулей фокусируемся на продажах
        explanation = `${module.description}. ${mainBenefit}`;
      } else if (module.category === 'MARKETING' || module.category === 'CRM') {
        // Для маркетинга и CRM фокусируемся на клиентах
        explanation = `${module.description} для улучшения работы с клиентами`;
      } else {
        // Универсальное объяснение
        explanation = `${module.description}. ${mainBenefit}`;
      }
      
      return `[MODULE:${moduleNum}] ${explanation}`;
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
      fallbackModules = [261, 13, 8, 42]; // Отраслевой модуль турагентства в приоритете
      fallbackResponse = '🌴 Для турагентства рекомендую специализированные модули:';
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
        if (moduleNum === 261) return `[MODULE:261] Комплексная система управления турагентством с интеграцией туроператоров.`;
        if (moduleNum === 13) return `[MODULE:13] Позволит внедрить бонусные карты и кэшбэк для клиентов турагентства.`;
        if (moduleNum === 8) return `[MODULE:8] Обеспечит интеграцию с системами бронирования туров.`;
        if (moduleNum === 42) return `[MODULE:42] Отправка уведомлений о горящих турах и акциях.`;
        if (moduleNum === 197) return `[MODULE:197] Прием платежей через GoPay для клиентов на Бали.`;
      } else if (lastUserMessage.includes('ресторан') || lastUserMessage.includes('пицц')) {
        if (moduleNum === 236) return `[MODULE:236] Полная автоматизация ресторана с передачей заказов на кухню.`;
        if (moduleNum === 237) return `[MODULE:237] Система доставки с GPS-трекингом курьеров.`;
        if (moduleNum === 238) return `[MODULE:238] Специализированное решение для пиццерий с конструктором.`;
        if (moduleNum === 225) return `[MODULE:225] Система статусов заказов с трекингом.`;
        if (moduleNum === 224) return `[MODULE:224] Автоматический прием платежей.`;
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