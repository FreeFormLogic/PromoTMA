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

// Универсальная система анализа бизнеса
function analyzeBusinessFromText(text: string): BusinessAnalysis {
  const lowerText = text.toLowerCase();
  
  // Всегда анализируем весь текст для выявления ключевых слов
  const keywords = text.split(/\s+/).filter(word => word.length > 2);
  
  // Определяем индустрию и релевантные категории
  let industry = 'universal';
  let persona = text.slice(0, 50); // Используем сам запрос как персону
  let relevantCategories: string[] = ['E-COMMERCE', 'MARKETING', 'CRM', 'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ'];
  
  // Добавляем отраслевые решения если обнаружены специфичные ключевые слова
  if (lowerText.includes('турагентство') || lowerText.includes('туризм') || lowerText.includes('тур') ||
      lowerText.includes('путешеств') || lowerText.includes('отел') || lowerText.includes('hotel')) {
    industry = 'tourism';
    relevantCategories.unshift('ОТРАСЛЕВЫЕ РЕШЕНИЯ');
  } else if (lowerText.includes('пицц') || lowerText.includes('ресторан') || lowerText.includes('кафе') || 
             lowerText.includes('суши') || lowerText.includes('доставка') || lowerText.includes('еда') ||
             lowerText.includes('бар') || lowerText.includes('фастфуд') || lowerText.includes('столов')) {
    industry = 'restaurant';
    relevantCategories.unshift('ОТРАСЛЕВЫЕ РЕШЕНИЯ');
  } else if (lowerText.includes('салон') || lowerText.includes('красот') || lowerText.includes('парикмахер') ||
             lowerText.includes('спа') || lowerText.includes('маникюр') || lowerText.includes('косметолог')) {
    industry = 'beauty';
    relevantCategories.unshift('ОТРАСЛЕВЫЕ РЕШЕНИЯ');
  } else if (lowerText.includes('медицин') || lowerText.includes('клиник') || lowerText.includes('врач') ||
             lowerText.includes('стоматолог') || lowerText.includes('больниц') || lowerText.includes('здоров')) {
    industry = 'medical';
    relevantCategories.unshift('ОТРАСЛЕВЫЕ РЕШЕНИЯ');
  } else if (lowerText.includes('магазин') || lowerText.includes('shop') || lowerText.includes('бутик') ||
             lowerText.includes('торгов') || lowerText.includes('продаж')) {
    industry = 'retail';
    relevantCategories = ['E-COMMERCE', 'MARKETING', 'CRM'];
  } else if (lowerText.includes('приют') || lowerText.includes('благотвор') || lowerText.includes('фонд') ||
             lowerText.includes('волонтер') || lowerText.includes('помо')) {
    industry = 'nonprofit';
    relevantCategories = ['CRM', 'MARKETING', 'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ'];
  } else if (lowerText.includes('психолог') || lowerText.includes('терапевт') || lowerText.includes('консультант') ||
             lowerText.includes('коуч') || lowerText.includes('тренер') || lowerText.includes('обучение')) {
    industry = 'services';
    relevantCategories = ['CRM', 'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ', 'MARKETING'];
  } else if (lowerText.includes('юрист') || lowerText.includes('адвокат') || lowerText.includes('нотариус') ||
             lowerText.includes('консультаци') || lowerText.includes('услуг')) {
    industry = 'professional';
    relevantCategories = ['CRM', 'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ', 'MARKETING'];
  }
  
  return {
    industry,
    size: 'medium',
    challenges: [],
    goals: [],
    relevantCategories,
    keywords,
    persona
  };
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
    
    // Определяем тип бизнеса для персонализированного приветствия
    let businessTypeEmoji = '';
    if (lastUserMessage.toLowerCase().includes('ресторан') || lastUserMessage.toLowerCase().includes('суши') || 
        lastUserMessage.toLowerCase().includes('пицц') || lastUserMessage.toLowerCase().includes('еда')) {
      businessTypeEmoji = '🍕';
    } else if (lastUserMessage.toLowerCase().includes('турагентство') || lastUserMessage.toLowerCase().includes('туризм')) {
      businessTypeEmoji = '🌴';
    } else if (lastUserMessage.toLowerCase().includes('салон') || lastUserMessage.toLowerCase().includes('красот')) {
      businessTypeEmoji = '💄';
    } else if (lastUserMessage.toLowerCase().includes('медицин') || lastUserMessage.toLowerCase().includes('клиник')) {
      businessTypeEmoji = '🏥';
    } else if (lastUserMessage.toLowerCase().includes('психолог') || lastUserMessage.toLowerCase().includes('консультант') || 
               lastUserMessage.toLowerCase().includes('коуч') || lastUserMessage.toLowerCase().includes('терапевт')) {
      businessTypeEmoji = '🧠';
    } else if (lastUserMessage.toLowerCase().includes('юрист') || lastUserMessage.toLowerCase().includes('адвокат')) {
      businessTypeEmoji = '⚖️';
    } else {
      businessTypeEmoji = '🚀';
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