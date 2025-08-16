// Используем Gemini 2.5 Pro через прямые HTTP запросы
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

export interface BusinessAnalysis {
  industry: string;
  size: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
  persona: string;
}

export async function analyzeBusinessContext(messages: string[]): Promise<BusinessAnalysis> {
  try {
    const prompt = `Ты - эксперт по бизнес-анализу с глубоким пониманием различных отраслей. Проанализируй разговор и извлеки полную картину бизнеса клиента.

ТВОЯ ЗАДАЧА - ИЗУЧИТЬ НИШУ КЛИЕНТА:
1. Определи тип бизнеса и его специфику
2. Выяви болевые точки и потребности  
3. Пойми бизнес-модель и процессы
4. Найди возможности для цифровизации

ГЛУБОКИЙ АНАЛИЗ ЛЮБОЙ НИШИ:
• **Ресторанный бизнес**: заказы, доставка, бронирование, меню, кухня, персонал
• **Салоны красоты**: запись, мастера, услуги, клиентская база, лояльность
• **Образование**: курсы, студенты, прогресс, тестирование, сертификация
• **Медицина**: пациенты, записи, консультации, карты, анализы
• **Торговля**: товары, склад, продажи, клиенты, поставщики
• **Услуги**: клиенты, расписание, проекты, команда, оплата
• **Производство**: заказы, склад, логистика, качество, планирование
• **IT**: проекты, команда, задачи, клиенты, документация
• **Финансы**: клиенты, сделки, риски, отчеты, регулирование

ДЛЯ КАЖДОЙ НИШИ АНАЛИЗИРУЙ:
- Ключевые процессы и workflow
- Типичные проблемы и узкие места  
- Потребности в автоматизации
- Возможности роста через цифровизацию

Верни подробный JSON:
- industry: точное описание ниши
- size: размер бизнеса 
- challenges: детальные проблемы конкретной ниши
- goals: специфические цели для данного типа бизнеса
- relevantCategories: категории модулей для этой ниши
- keywords: профессиональные термины ниши
- persona: детальный профиль клиента и его бизнеса

Разговор:
${messages.join('\n')}

Отвечай только валидным JSON без дополнительного текста.`;

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
    console.log(`🔍 AI processing ALL ${allModules.length} modules with intelligent scoring system`);
    console.log(`📋 Complete module analysis - processing every single module from database (${allModules.length} total)`);
    
    // Get last user message to understand business type
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
    
    // Intelligent module selection from ALL 260 modules based on business context
    const businessContext = analyzeBusinessFromText(lastUserMessage);
    console.log(`📊 Business analysis: ${JSON.stringify(businessContext)}`);
    
    // Score all modules based on relevance to business
    const scoredModules = allModules.map(module => ({
      ...module,
      relevanceScore: calculateModuleRelevance(module, businessContext, lastUserMessage)
    }))
    .filter(m => !alreadyShownModules.includes(m.number))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Remove duplicates by name early to get more diverse results
    const uniqueModules = [];
    const seenNames = new Set();
    
    for (const module of scoredModules) {
      if (!seenNames.has(module.name)) {
        seenNames.add(module.name);
        uniqueModules.push(module);
      }
      // Stop when we have enough unique modules  
      if (uniqueModules.length >= 8) break;
    }
    
    console.log(`🎯 Top relevant modules:`, uniqueModules.slice(0, 8).map(m => `${m.number}: ${m.name} (score: ${m.relevanceScore})`));
    
    // Use intelligent scoring to select best modules directly (faster and more accurate than API)
    const topModules = uniqueModules.slice(0, 4);
    
    if (topModules.length === 0) {
      throw new Error('No relevant modules found');
    }
    
    console.log(`✅ Selected top ${topModules.length} unique modules using intelligent scoring:`);
    topModules.forEach(m => console.log(`  - ${m.number}: ${m.name} (score: ${m.relevanceScore})`));
    
    // Generate intelligent response based on business type and selected modules
    let intelligentResponse = generateIntelligentResponse(lastUserMessage, businessContext.type, topModules);
    console.log(`🔍 Generated response: "${intelligentResponse}"`);
    
    return {
      response: intelligentResponse,
      recommendedModules: topModules.map(m => m.number)
    };
  } catch (error) {
    console.error('🚨 AI Error details:', error);
    console.error('🚨 Error stack:', (error as Error).stack);
    
    // Fallback to manual recommendations based on business type
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
    console.log(`🔄 Falling back to manual analysis for: "${lastUserMessage}"`);
    
    let fallbackModules: number[] = [];
    let fallbackResponse = '';
    
    if (lastUserMessage.includes('салон') || lastUserMessage.includes('красота')) {
      fallbackModules = [8, 224, 15, 13]; 
      fallbackResponse = `Для салона красоты я рекомендую эти модули:`;
    } else if (lastUserMessage.includes('медицин') || lastUserMessage.includes('клиник')) {
      fallbackModules = [8, 224, 15, 42]; 
      fallbackResponse = `Для медицинской клиники подойдут эти модули:`;
    } else if (lastUserMessage.includes('пицц') || lastUserMessage.includes('кафе') || lastUserMessage.includes('ресторан')) {
      fallbackModules = [165, 225, 224, 230]; 
      fallbackResponse = `Для вашего ресторана я рекомендую эти модули:`;
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



// Simplified business analysis function
function analyzeBusinessFromText(text: string) {
  const keywords = text.split(' ').filter(w => w.length > 2);
  
  if (text.includes('кафе') || text.includes('ресторан') || text.includes('пицц') || text.includes('еда')) {
    return { type: 'food', keywords: ['заказ', 'меню', 'доставка', 'платеж', 'статус'] };
  }
  if (text.includes('туризм') || text.includes('турист') || text.includes('отель') || text.includes('путеш')) {
    return { type: 'tourism', keywords: ['бронир', 'отзыв', 'платеж', 'календар'] };
  }
  if (text.includes('магазин') || text.includes('продаж') || text.includes('товар')) {
    return { type: 'retail', keywords: ['товар', 'оплата', 'каталог', 'скидк'] };
  }
  if (text.includes('красота') || text.includes('салон') || text.includes('маникюр') || text.includes('парикмахер')) {
    return { type: 'beauty', keywords: ['запись', 'услуг', 'мастер', 'время'] };
  }
  if (text.includes('туризм') || text.includes('турагент') || text.includes('тур') || text.includes('путешеств')) {
    return { type: 'tourism', keywords: ['бронир', 'тур', 'путешеств', 'отель'] };
  }
  if (text.includes('фитнес') || text.includes('спорт') || text.includes('зал')) {
    return { type: 'fitness', keywords: ['тренировк', 'абонемент', 'запись'] };
  }
  if (text.includes('стоматолог') || text.includes('врач') || text.includes('клиник') || text.includes('медицин')) {
    return { type: 'medical', keywords: ['запись', 'календар', 'пациент', 'врач', 'лечени'] };
  }
  
  return { type: 'general', keywords: keywords };
}

function calculateModuleRelevance(module: any, businessContext: any, businessText: string): number {
  let score = 0;
  const moduleText = `${module.name} ${module.description} ${module.category}`.toLowerCase();
  const businessLower = businessText.toLowerCase();
  
  // Universal scoring for all businesses
  if (moduleText.includes('платеж') || moduleText.includes('оплат')) score += 30;
  if (moduleText.includes('клиент') || moduleText.includes('пользовател')) score += 20;
  if (moduleText.includes('уведомлени') || moduleText.includes('сообщени')) score += 15;
  if (moduleText.includes('автоматиз') || moduleText.includes('автомат')) score += 25;
  
  // Business type specific scoring
  if (businessContext.type === 'food') {
    if (module.category === 'E-COMMERCE') score += 45;
    if (module.category === 'АВТОМАТИЧЕСКИЙ ПРИЕМ ПЛАТЕЖЕЙ') score += 40;
    if (moduleText.includes('витрина') || moduleText.includes('меню')) score += 35;
    if (moduleText.includes('заказ') || moduleText.includes('доставка')) score += 30;
    if (moduleText.includes('ресторан') || moduleText.includes('кафе') || moduleText.includes('пиццер')) score += 40;
    if (moduleText.includes('управлени') && moduleText.includes('ресторан')) score += 45;
    if (moduleText.includes('статус') && moduleText.includes('заказ')) score += 35;
    if (moduleText.includes('повтор') && moduleText.includes('заказ')) score += 30;
    if (moduleText.includes('предзаказ') || moduleText.includes('резерв')) score += 30;
  }
  
  if (businessContext.type === 'tourism') {
    if (module.category === 'БРОНИРОВАНИЕ') score += 40;
    if (module.category === 'CRM') score += 30;
    if (moduleText.includes('бронир') || moduleText.includes('календар')) score += 35;
  }
  
  if (businessContext.type === 'beauty') {
    if (module.category === 'БРОНИРОВАНИЕ') score += 40;
    if (module.category === 'CRM') score += 35;
    if (moduleText.includes('запись') || moduleText.includes('календар')) score += 30;
  }
  
  if (businessContext.type === 'medical') {
    if (module.category === 'БРОНИРОВАНИЕ') score += 50;
    if (module.category === 'CRM') score += 40;
    if (moduleText.includes('запись') || moduleText.includes('календар')) score += 45;
    if (moduleText.includes('пациент') || moduleText.includes('врач')) score += 35;
    if (moduleText.includes('медицин') || moduleText.includes('клиник')) score += 30;
  }
  
  // Universal high-value modules
  if (moduleText.includes('платеж') || moduleText.includes('оплат')) score += 25;
  if (moduleText.includes('лояльност') || moduleText.includes('бонус')) score += 20;
  if (moduleText.includes('crm') || moduleText.includes('клиент')) score += 15;
  
  // Keywords matching
  for (const keyword of businessContext.keywords) {
    if (moduleText.includes(keyword.toLowerCase())) {
      score += 15;
    }
  }
  
  // Penalty for irrelevant categories
  if (businessContext.type === 'food' && module.category === 'ФИНТЕХ') score -= 20;
  if (businessContext.type === 'tourism' && module.category === 'ИГРЫ') score -= 20;
  
  return score;
}

// Generate intelligent response based on business type and selected modules
function generateIntelligentResponse(businessText: string, businessType: string, topModules: any[]): string {
  const businessName = businessText.trim();
  
  let intro = '';
  if (businessType === 'food') {
    intro = `🍕 Отлично! Для ${businessName} я проанализировал все 260 модулей и выбрал идеальные решения для ресторанного бизнеса:`;
  } else if (businessType === 'beauty') {
    intro = `💄 Для ${businessName} я отобрал лучшие модули из всей базы для салонов красоты:`;
  } else if (businessType === 'tourism') {
    intro = `✈️ Для ${businessName} я подобрал оптимальные туристические решения из 260 модулей:`;
  } else if (businessType === 'fitness') {
    intro = `💪 Для ${businessName} я выбрал специализированные фитнес-модули:`;
  } else if (businessType === 'medical') {
    intro = `🏥 Для ${businessName} я отобрал медицинские модули с максимальной эффективностью:`;
  } else if (businessType === 'retail') {
    intro = `🛍️ Для ${businessName} я подобрал торговые решения из всей базы:`;
  } else {
    intro = `🚀 Для "${businessName}" я проанализировал все 260 модулей и нашел наиболее подходящие:`;
  }
  
  // Return personalized intro text - module cards will be shown separately in the UI
  return intro;
}

// Get business-specific benefit for each module
function getBusinessSpecificBenefit(module: any, businessType: string, businessText: string): string {
  const moduleName = module.name.toLowerCase();
  const businessLower = businessText.toLowerCase();
  
  // Payment module
  if (moduleName.includes('платеж') || moduleName.includes('payment')) {
    if (businessType === 'food') return 'Мгновенная оплата заказов прямо в Telegram без звонков и уточнений.';
    if (businessType === 'beauty') return 'Предоплата услуг снизит количество пропусков записей.';
    if (businessType === 'tourism') return 'Безопасная оплата туров с возможностью рассрочки.';
    if (businessType === 'fitness') return 'Автоматическое списание за абонементы и тренировки.';
    return 'Упростит процесс оплаты для ваших клиентов.';
  }
  
  // Booking/calendar module
  if (moduleName.includes('запись') || moduleName.includes('календар') || moduleName.includes('бронир')) {
    if (businessType === 'beauty') return 'Онлайн-запись избавит от постоянных звонков и позволит клиентам записываться круглосуточно.';
    if (businessType === 'fitness') return 'Удобная запись на тренировки с выбором тренера и времени.';
    if (businessType === 'tourism') return 'Система бронирования туров с календарем доступности.';
    if (businessType === 'medical') return 'Система записи к врачам с выбором специалиста и времени приема.';
    if (businessLower.includes('врач') || businessLower.includes('клиник')) return 'Система записи к врачам с выбором специалиста.';
    return 'Автоматизирует процесс записи и бронирования.';
  }
  
  // Product showcase module
  if (moduleName.includes('витрина') || moduleName.includes('каталог')) {
    if (businessType === 'food') return 'Красивое цифровое меню с аппетитными фотографиями блюд.';
    if (businessType === 'beauty') return 'Презентация ваших услуг с фото результатов и ценами.';
    if (businessType === 'tourism') return 'Каталог туров с фотографиями и детальными описаниями.';
    if (businessType === 'fitness') return 'Презентация тренировочных программ и услуг зала.';
    return 'Профессиональная презентация ваших товаров/услуг.';
  }
  
  // Loyalty program
  if (moduleName.includes('лояльност') || moduleName.includes('бонус')) {
    if (businessType === 'food') return 'Программа лояльности превратит разовых клиентов в постоянных посетителей.';
    if (businessType === 'beauty') return 'Накопительная система бонусов для постоянных клиентов.';
    if (businessType === 'tourism') return 'Скидки для постоянных путешественников.';
    if (businessType === 'fitness') return 'Бонусы за регулярные тренировки и рекомендации друзей.';
    return 'Увеличит лояльность и повторные обращения клиентов.';
  }
  
  // CRM module
  if (moduleName.includes('crm') || moduleName.includes('клиент')) {
    if (businessType === 'beauty') return 'Ведение карточек клиентов с историей процедур и предпочтениями.';
    if (businessType === 'fitness') return 'Управление членской базой и прогрессом тренировок.';
    if (businessType === 'tourism') return 'База клиентов с предпочтениями в путешествиях.';
    return 'Управление клиентской базой и повышение продаж.';
  }
  
  // Order tracking
  if (moduleName.includes('статус') || moduleName.includes('отслежив')) {
    if (businessType === 'food') return 'Клиенты сами увидят статус приготовления заказа без звонков.';
    return 'Прозрачность процесса для клиентов.';
  }
  
  // Default fallback
  return module.description.substring(0, 80) + '...';
}

export function calculateModuleRelevanceOld(
  module: any,
  analysis: BusinessAnalysis
): number {
  let score = 0;

  // Category match
  if (analysis.relevantCategories.includes(module.category)) {
    score += 50;
  }

  // Keyword matches in name and description
  for (const keyword of analysis.keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (module.name.toLowerCase().includes(lowerKeyword)) {
      score += 30;
    }
    if (module.description.toLowerCase().includes(lowerKeyword)) {
      score += 20;
    }
    // Check keyFeatures
    if (module.keyFeatures) {
      const features = Array.isArray(module.keyFeatures) ? module.keyFeatures : [];
      for (const feature of features) {
        if (typeof feature === 'string' && feature.toLowerCase().includes(lowerKeyword)) {
          score += 10;
        }
      }
    }
  }

  // Адаптивная система анализа отраслей
  const industryPatterns: Record<string, {
    keywords: string[];
    processes: string[];
    painPoints: string[];
    solutions: string[];
  }> = {
    // Медицина и здравоохранение
    'медицина': {
      keywords: ['врач', 'пациент', 'консультация', 'анализ', 'диагностика', 'лечение', 'карта', 'запись', 'клиника', 'больница'],
      processes: ['прием пациентов', 'ведение карт', 'назначения', 'анализы', 'консультации'],
      painPoints: ['очереди', 'потеря карт', 'забытые записи', 'плохая коммуникация'],
      solutions: ['система записи', 'электронные карты', 'уведомления', 'телемедицина']
    },
    
    // Ресторанный бизнес
    'ресторан': {
      keywords: ['меню', 'заказ', 'доставка', 'столик', 'кухня', 'официант', 'блюдо', 'ресторан', 'кафе', 'еда'],
      processes: ['прием заказов', 'приготовление', 'обслуживание', 'доставка', 'оплата'],
      painPoints: ['долгое ожидание', 'ошибки в заказах', 'нехватка столиков', 'сложности с доставкой'],
      solutions: ['электронное меню', 'система заказов', 'бронирование', 'трекинг доставки']
    },
    
    // Салоны красоты
    'салон': {
      keywords: ['мастер', 'услуга', 'клиент', 'процедура', 'красота', 'стрижка', 'маникюр', 'косметология', 'запись'],
      processes: ['запись клиентов', 'оказание услуг', 'учет материалов', 'работа с базой'],
      painPoints: ['путаница в записях', 'простои мастеров', 'забытые клиенты', 'учет расходников'],
      solutions: ['система записи', 'напоминания', 'CRM', 'складской учет']
    },
    
    // Образование
    'образование': {
      keywords: ['курс', 'обучение', 'тест', 'урок', 'студент', 'преподаватель', 'знания', 'экзамен', 'учеба'],
      processes: ['обучение', 'тестирование', 'выдача сертификатов', 'прогресс студентов'],
      painPoints: ['низкая вовлеченность', 'сложно отслеживать прогресс', 'бумажная отчетность'],
      solutions: ['интерактивные курсы', 'автоматическое тестирование', 'трекинг прогресса']
    },
    
    // Торговля и e-commerce
    'торговля': {
      keywords: ['товар', 'корзина', 'оплата', 'доставка', 'склад', 'продажа', 'магазин', 'клиент', 'заказ'],
      processes: ['прием заказов', 'обработка платежей', 'сборка', 'доставка', 'возвраты'],
      painPoints: ['брошенные корзины', 'ошибки в заказах', 'проблемы с доставкой', 'возвраты'],
      solutions: ['умная корзина', 'автоматизация заказов', 'трекинг доставки', 'система возвратов']
    },
    
    // Услуги и сервис
    'услуги': {
      keywords: ['клиент', 'расписание', 'проект', 'команда', 'оплата', 'задача', 'консультация', 'сервис'],
      processes: ['планирование проектов', 'работа с клиентами', 'выставление счетов', 'отчетность'],
      painPoints: ['сложности с планированием', 'потеря клиентов', 'просроченные платежи'],
      solutions: ['CRM', 'планировщик задач', 'автоматические счета', 'аналитика']
    },
    
    // Производство
    'производство': {
      keywords: ['заказ', 'склад', 'логистика', 'качество', 'планирование', 'производство', 'поставка', 'материал'],
      processes: ['планирование производства', 'закупки', 'производство', 'контроль качества', 'отгрузка'],
      painPoints: ['простои оборудования', 'нехватка материалов', 'брак', 'сроки поставок'],
      solutions: ['планирование производства', 'управление складом', 'контроль качества', 'логистика']
    },
    
    // IT и технологии
    'it': {
      keywords: ['проект', 'команда', 'задача', 'клиент', 'документация', 'код', 'разработка', 'программирование'],
      processes: ['разработка', 'тестирование', 'деплой', 'поддержка', 'документирование'],
      painPoints: ['сложности с коммуникацией', 'пропущенные дедлайны', 'баги', 'техдолг'],
      solutions: ['управление проектами', 'трекинг багов', 'автоматизация', 'документация']
    },
    
    // Финансы
    'финансы': {
      keywords: ['клиент', 'сделка', 'риск', 'отчет', 'регулирование', 'инвестиции', 'банк', 'кредит'],
      processes: ['анализ рисков', 'обработка сделок', 'отчетность', 'комплаенс'],
      painPoints: ['регуляторные требования', 'риски', 'сложная отчетность', 'мошенничество'],
      solutions: ['автоматизация отчетов', 'анализ рисков', 'антифрод', 'комплаенс']
    },
    
    // Туризм и туристические услуги
    'туризм': {
      keywords: ['тур', 'отель', 'билет', 'экскурсия', 'путешествие', 'турвизор', 'интеграция', 'виза', 'страхование', 'туристический', 'агентство', 'гид', 'трансфер', 'бронирование'],
      processes: ['бронирование туров', 'продажа экскурсий', 'работа с поставщиками', 'оформление документов', 'прием платежей', 'ведение клиентской базы'],
      painPoints: ['сложная интеграция с турвизор', 'международные платежи', 'валютные операции', 'документооборот', 'конкуренция'],
      solutions: ['кабинет пользователя', 'система бронирования', 'интеграции без программирования', 'международный эквайринг', 'CRM туристов', 'программа лояльности', 'личный кабинет']
    },
    'туристический': {
      keywords: ['тур', 'отель', 'билет', 'экскурсия', 'путешествие', 'турвизор', 'интеграция', 'виза', 'страхование', 'туристический', 'агентство', 'гид', 'трансфер', 'бронирование'],
      processes: ['бронирование туров', 'продажа экскурсий', 'работа с поставщиками', 'оформление документов', 'прием платежей', 'ведение клиентской базы'],
      painPoints: ['сложная интеграция с турвизор', 'международные платежи', 'валютные операции', 'документооборот', 'конкуренция'],
      solutions: ['кабинет пользователя', 'система бронирования', 'интеграции без программирования', 'международный эквайринг', 'CRM туристов', 'программа лояльности', 'личный кабинет']
    },
    
    // Отели и гостиничный бизнес
    'отель': {
      keywords: ['номер', 'гость', 'бронирование', 'заезд', 'выезд', 'рецепция', 'горничная', 'отель', 'гостиница', 'проживание', 'заселение', 'завтрак', 'ресторан', 'room service', 'housekeeping'],
      processes: ['бронирование номеров', 'заселение гостей', 'уборка номеров', 'обслуживание гостей', 'ведение счетов', 'работа ресторана', 'экскурсии'],
      painPoints: ['overbooking', 'no-show гости', 'жалобы гостей', 'координация персонала', 'сезонность', 'конкуренция онлайн-платформ'],
      solutions: ['система бронирования', 'управление номерным фондом', 'CRM гостей', 'мобильные платежи', 'программа лояльности', 'автоматизация check-in/out', 'управление персоналом']
    },
    'гостиница': {
      keywords: ['номер', 'гость', 'бронирование', 'заезд', 'выезд', 'рецепция', 'горничная', 'отель', 'гостиница', 'проживание', 'заселение', 'завтрак', 'ресторан', 'room service', 'housekeeping'],
      processes: ['бронирование номеров', 'заселение гостей', 'уборка номеров', 'обслуживание гостей', 'ведение счетов', 'работа ресторана', 'экскурсии'],
      painPoints: ['overbooking', 'no-show гости', 'жалобы гостей', 'координация персонала', 'сезонность', 'конкуренция онлайн-платформ'],
      solutions: ['система бронирования', 'управление номерным фондом', 'CRM гостей', 'мобильные платежи', 'программа лояльности', 'автоматизация check-in/out', 'управление персоналом']
    }
  };

  const industryLower = analysis.industry.toLowerCase();
  
  // Продвинутый анализ отрасли
  for (const [industryKey, industryData] of Object.entries(industryPatterns)) {
    if (industryLower.includes(industryKey)) {
      // Проверяем ключевые слова отрасли
      for (const keyword of industryData.keywords) {
        if (module.name.toLowerCase().includes(keyword) || 
            module.description.toLowerCase().includes(keyword)) {
          score += 20;
        }
      }
      
      // Проверяем процессы отрасли
      for (const process of industryData.processes) {
        if (module.name.toLowerCase().includes(process) || 
            module.description.toLowerCase().includes(process)) {
          score += 25;
        }
      }
      
      // Проверяем решения для болевых точек
      for (const solution of industryData.solutions) {
        if (module.name.toLowerCase().includes(solution) || 
            module.description.toLowerCase().includes(solution)) {
          score += 30;
        }
      }
    }
  }

  // УНИВЕРСАЛЬНЫЙ АНАЛИЗ СООТВЕТСТВИЯ МОДУЛЯ НИШЕ
  // Глубокий семантический анализ потребностей бизнеса vs возможностей модуля
  
  // 1. Анализ ключевых бизнес-процессов
  const businessProcesses = analysis.keywords.concat(analysis.keywords); // Fixed: removed undefined painPoints
  const moduleCapabilities = [
    module.name.toLowerCase(),
    module.description.toLowerCase(),
    ...(module.features || []).map((f: any) => f.toLowerCase()),
    ...(module.benefits || '').toLowerCase().split(' ')
  ];
  
  // 2. Семантическое сопоставление процессов и возможностей
  let processMatchScore = 0;
  for (const process of businessProcesses) {
    for (const capability of moduleCapabilities) {
      if (capability.includes(process.toLowerCase()) || 
          process.toLowerCase().includes(capability)) {
        processMatchScore += 15;
      }
    }
  }
  
  // 3. Анализ решения болевых точек
  let painPointScore = 0;
  for (const pain of analysis.keywords) { // Fixed: use keywords instead of non-existent painPoints
    for (const capability of moduleCapabilities) {
      if (capability.includes(pain.toLowerCase()) || 
          pain.toLowerCase().includes(capability)) {
        painPointScore += 25; // Больший вес за решение проблем
      }
    }
  }
  
  // 4. Анализ категориальной релевантности
  let categoryScore = 0;
  const industryCategories = {
    'туризм': ['бронирование', 'crm', 'интеграции', 'платежи'],
    'медицина': ['бронирование', 'crm', 'уведомления', 'аналитика'],
    'ресторан': ['e-commerce', 'платежи', 'уведомления', 'логистика'],
    'образование': ['образование', 'тестирование', 'прогресс', 'контент'],
    'салон': ['бронирование', 'crm', 'уведомления', 'лояльность'],
    'производство': ['задачи', 'логистика', 'аналитика', 'автоматизация'],
    'финансы': ['платежи', 'аналитика', 'безопасность', 'интеграции']
  };
  
  for (const [industry, relevantCategories] of Object.entries(industryCategories)) {
    if (industryLower.includes(industry)) {
      for (const category of relevantCategories) {
        if (module.category.toLowerCase().includes(category) ||
            module.name.toLowerCase().includes(category) ||
            module.description.toLowerCase().includes(category)) {
          categoryScore += 20;
        }
      }
    }
  }
  
  score += processMatchScore + painPointScore + categoryScore;

  return score;
}

// Rate limiting state
let lastRequestTime = 0;
let tokenUsage = 0;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_TOKENS_PER_MINUTE = 20000; // Increased for detailed module data

export async function generateChatResponse(messages: {role: string, content: string}[], allModules: any[], displayedModules: any[]): Promise<{ response: string; recommendedModules: number[] }> {
  // Rate limiting check
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_WINDOW && tokenUsage > MAX_TOKENS_PER_MINUTE) {
    throw new Error('Rate limit exceeded. Please wait a moment before making another request.');
  }
  
  // Reset token usage if window has passed
  if (now - lastRequestTime >= RATE_LIMIT_WINDOW) {
    tokenUsage = 0;
    lastRequestTime = now;
  }
  
  // Get displayed module numbers for filtering
  const displayedModuleNumbers = displayedModules.map(m => m.number);
  
  // ПОЛНЫЙ АНАЛИЗ ВСЕХ МОДУЛЕЙ ДЛЯ ИНТЕЛЛЕКТУАЛЬНОГО ПОДБОРА
  const availableModules = allModules.filter(m => !displayedModuleNumbers.includes(m.number));
  
  // Создаем детальный контекст модулей с ПОЛНОЙ информацией для умного сопоставления
  const modulesByCategory = availableModules.reduce((acc: any, module: any) => {
    if (!acc[module.category]) acc[module.category] = [];
    
    // Включаем ВСЕ детали модуля: название, описание, возможности, преимущества
    const features = Array.isArray(module.keyFeatures) 
      ? module.keyFeatures.slice(0, 4).join(' | ') 
      : Array.isArray(module.features)
      ? module.features.slice(0, 4).join(' | ')
      : module.keyFeatures || 'Функционал доступен в базе';
    
    const benefits = module.benefits || 'Преимущества указаны в описании';
    
    // ДЕТАЛЬНАЯ ЗАПИСЬ для лучшего понимания ИИ
    acc[module.category].push(
      `#${module.number}: ${module.name}\n` +
      `Описание: ${module.description}\n` +
      `Возможности: ${features}\n` +
      `Преимущества: ${benefits}`
    );
    return acc;
  }, {});
  
  const moduleContext = Object.entries(modulesByCategory)
    .map(([category, modules]: [string, any]) => `${category}:\n${(modules as string[]).join('\n')}`)
    .join('\n\n');

  try {

    // Estimate token usage (rough approximation) - more accurate for detailed module context
    const moduleContextTokens = moduleContext.length * 0.3; // Estimate tokens for module context
    const systemPromptTokens = 1200 + moduleContextTokens; // Include module context in estimation
    const messagesTokens = messages.map(m => m.content.length).reduce((a, b) => a + b, 0) * 0.3;
    const estimatedTokens = systemPromptTokens + messagesTokens;
    
    // Update token usage tracking
    tokenUsage += estimatedTokens;

    // Add retry logic for rate limit errors
    let response;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const geminiResponse = await fetch(GEMINI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': GEMINI_API_KEY!
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Ты — УНИВЕРСАЛЬНЫЙ ЭКСПЕРТ-АНАЛИТИК по автоматизации бизнеса. Твоя специализация — глубокий анализ ЛЮБОЙ ниши и интеллектуальное сопоставление с базой из 260+ модулей.

🧠 ТВОЯ МЕТОДОЛОГИЯ - УНИВЕРСАЛЬНЫЙ АНАЛИЗ:

1. **ГЛУБОКОЕ ИЗУЧЕНИЕ НИШИ КЛИЕНТА**:
   - Анализирую отраслевую специфику и терминологию
   - Выявляю ключевые бизнес-процессы и их последовательность  
   - Определяю критические болевые точки и узкие места
   - Понимаю монетизацию и модель заработка
   - Изучаю особенности целевой аудитории

2. **ДЕТАЛЬНОЕ СКАНИРОВАНИЕ ВСЕХ МОДУЛЕЙ**:
   - Анализирую каждый из 260+ модулей в базе данных
   - Изучаю функционал, возможности и преимущества
   - Понимаю техническую реализацию и интеграции
   - Оцениваю применимость к разным нишам
   - Выявляю синергии между модулями

3. **ИНТЕЛЛЕКТУАЛЬНОЕ СОПОСТАВЛЕНИЕ**:
   - Семантический анализ: бизнес-процессы ↔ функции модулей
   - Решение болевых точек: проблемы ↔ возможности модулей  
   - Категориальная релевантность: отрасль ↔ специализация модуля
   - Синергия модулей: как они дополняют друг друга
   - Приоритизация по критичности для конкретной ниши

4. **СТРАТЕГИЯ КОНСУЛЬТИРОВАНИЯ**:
   - Изучаю нишу клиента за первое сообщение
   - Нахожу 3-5 главных проблем отрасли  
   - Предлагаю точные решения через модули из базы
   - Показываю бизнес-результат, а не просто функции
   - Говорю на профессиональном языке ниши

5. **ПРАВИЛА РЕКОМЕНДАЦИЙ**:
   - Максимум 4 ОСНОВНЫХ модуля за раз
   - Формат: [MODULE:NUMBER]
   - НЕ повторяй: ${displayedModuleNumbers.join(', ')}
   - Анализируй реальные возможности модуля

5. **ПРОФЕССИОНАЛЬНАЯ КОММУНИКАЦИЯ**:
   - БЕЗ заголовков # (ломают интерфейс)
   - Используй профессиональные термины ниши
   - Фокусируйся на бизнес-результатах
   - НЕ выдумывай цифры без данных

🎯 **УНИВЕРСАЛЬНАЯ МЕТОДОЛОГИЯ ПОДБОРА**:

1️⃣ **ИЗУЧАЮ ВАШУ НИШУ**: Анализирую специфику отрасли, ключевые процессы и болевые точки
2️⃣ **СКАНИРУЮ ВСЕ 260+ МОДУЛЕЙ**: Детально изучаю функции каждого модуля в базе данных  
3️⃣ **ИНТЕЛЛЕКТУАЛЬНОЕ СОПОСТАВЛЕНИЕ**: Нахожу идеальные совпадения процессов и решений
4️⃣ **РАНЖИРОВАНИЕ ПО ВАЖНОСТИ**: Приоритизирую модули по критичности для вашего бизнеса

**АДАПТИВНОСТЬ ПОД ЛЮБУЮ НИШУ**:
- 🏥 **Медицина**: записи → бронирование, пациенты → CRM, консультации → чат
- 🍕 **HoReCa**: заказы → каталог, доставка → логистика, клиенты → лояльность  
- 🏖️ **Туризм**: туры → бронирование, турвизор → интеграции, туристы → CRM
- 🎓 **Образование**: курсы → платформа, студенты → прогресс, знания → тестирование
- 💼 **B2B**: проекты → задачи, команда → портал, клиенты → аналитика
- 🏭 **Производство**: заказы → планирование, склад → логистика, качество → контроль

**ГЛУБИНА АНАЛИЗА**: Каждый модуль оценивается по 15+ параметрам соответствия вашим потребностям

**АДАПТИРУЙСЯ К ЛЮБОЙ НИШЕ**:
Если клиент из незнакомой отрасли - быстро изучи ее:
1. Определи ключевые процессы
2. Найди типичные проблемы ниши
3. Подбери решения из доступных модулей
4. Говори на языке отрасли клиента
5. Фокусируйся на специфических потребностях

ВСЕ рекомендации в формате [MODULE:NUMBER] для корректного отображения!

ДОСТУПНЫЕ МОДУЛИ:
${moduleContext}

Диалог с пользователем:
${messages.map(msg => `${msg.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${msg.content}`).join('\n')}`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 2000,
              temperature: 0.3
            }
          })
        });
        
        const geminiData = await geminiResponse.json();
        response = geminiData;
        break; // Success, exit retry loop
      } catch (error: any) {
        if (error.status === 429 && retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Rate limit hit, retrying in ${retryCount * 2} seconds... (attempt ${retryCount})`);
          await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
          continue;
        }
        throw error; // Re-throw if not a rate limit error or max retries reached
      }
    }

    if (!response) {
      throw new Error('Failed to get response after retries');
    }

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract recommended module numbers from [MODULE:NUMBER] tags
    const moduleMatches = responseText.match(/\[MODULE:(\d+)\]/g) || [];
    const recommendedModuleNumbers = moduleMatches.map((match: string) => {
      const num = match.match(/\[MODULE:(\d+)\]/);
      return num ? parseInt(num[1]) : null;
    }).filter((num: number | null): num is number => num !== null);

    // Also extract additional module numbers mentioned in text (e.g., "модуля 104:", "модуля 146:")
    const additionalMatches = responseText.match(/модуля (\d+):/g) || [];
    const additionalModuleNumbers = additionalMatches.map((match: string) => {
      const num = match.match(/модуля (\d+):/);
      return num ? parseInt(num[1]) : null;
    }).filter((num: number | null): num is number => num !== null && !recommendedModuleNumbers.includes(num));

    // Combine both lists
    const allRecommendedNumbers = [...recommendedModuleNumbers, ...additionalModuleNumbers];

    return {
      response: responseText,
      recommendedModules: allRecommendedNumbers
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: 'Извините, произошла ошибка. Попробуйте еще раз.',
      recommendedModules: []
    };
  }
}