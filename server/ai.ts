import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL_STR = "gpt-4o";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1200, // Увеличиваем для детального анализа
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Ты - эксперт по бизнес-анализу. Изучай любую нишу и отвечай только валидным JSON без дополнительного текста." },
        { role: "user", content: prompt }
      ],
    });

    const content = response.choices[0]?.message?.content;
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
    // Получаем все модули из базы данных
    const { storage } = await import('./storage');
    const allModules = await storage.getAllModules();
    
    // Processing all modules from database
    console.log(`🔍 AI processing ${allModules.length} modules`)
    
    // Формируем полный список модулей для AI со всеми данными
    const modulesList = allModules.map((module: any) => {
      let features = '';
      let benefits = module.benefits || 'Повышение эффективности бизнеса';
      
      // Безопасное извлечение ключевых функций
      try {
        const keyFeatures = module.keyFeatures || module.key_features;
        if (typeof keyFeatures === 'string') {
          // Пытаемся парсить JSON, если не получается - используем как строку
          try {
            const parsed = JSON.parse(keyFeatures);
            if (Array.isArray(parsed)) {
              features = parsed.map(f => f.replace(/\*\*/g, '')).join(', ');
            } else {
              features = keyFeatures.replace(/\*\*/g, '').replace(/["\[\]]/g, '');
            }
          } catch {
            features = keyFeatures.replace(/\*\*/g, '').replace(/["\[\]]/g, '');
          }
        } else if (Array.isArray(keyFeatures)) {
          features = keyFeatures.map(f => f.replace(/\*\*/g, '')).join(', ');
        } else {
          features = 'Основные возможности модуля';
        }
      } catch (e) {
        features = 'Основные возможности модуля';
      }
      
      return `Модуль ${module.number}: ${module.name}
Описание: ${module.description}
Категория: ${module.category}
Ключевые возможности: ${features}
Преимущества: ${benefits}
---`;
    }).join('\n');

    const systemPrompt = `You are an expert Telegram Mini Apps consultant. You have access to the COMPLETE database of all available modules. Use this information to make intelligent recommendations based on business needs.

ПОЛНАЯ БАЗА ДАННЫХ МОДУЛЕЙ:
${modulesList}

ПРАВИЛА РАБОТЫ:
1. Анализируй бизнес пользователя и его потребности
2. Изучай ВСУЮ базу данных модулей со всеми описаниями, функциями и преимуществами
3. Выбирай НАИБОЛЕЕ ПОДХОДЯЩИЕ модули, учитывая ВСЕ детали контекста
4. Рекомендуй 3-4 модуля за раз, начиная с самых важных для данного бизнеса
5. Объясняй, ПОЧЕМУ именно этот модуль подходит, ссылаясь на конкретные функции

КРИТИЧЕСКИ ВАЖНО - ОБРАБОТКА ПОВТОРОВ:
УЖЕ ПОКАЗАННЫЕ МОДУЛИ: [${alreadyShownModules.join(', ')}]
НИКОГДА НЕ РЕКОМЕНДУЙ уже показанные модули повторно! 
Ищи НОВЫЕ подходящие модули из полной базы данных.

СПЕЦИАЛЬНЫЕ ПРАВИЛА ПО ЛОКАЦИИ:
- БИЗНЕС НА БАЛИ/ИНДОНЕЗИИ: ОБЯЗАТЕЛЬНО предлагай модули 120 (GoPay, OVO), 123 (DANA, LinkAja), 125 (банки Индонезии)
- МЕЖДУНАРОДНЫЙ БИЗНЕС: Приоритет модулям с мультиязычностью и международными платежами
- ТУРИСТИЧЕСКИЙ БИЗНЕС: Модули для работы с иностранными клиентами

ВАЖНО: Если пользователь упоминает Индонезию, Бали, GoPay, OVO, DANA - ОБЯЗАТЕЛЬНО включай модули 120, 123, 125!

КЛЮЧЕВЫЕ ПРАВИЛА ПО ТИПУ БИЗНЕСА:
- ПИЦЦЕРИЯ/РЕСТОРАН: Если НЕ показан модуль 165 - ОБЯЗАТЕЛЬНО рекомендуй его первым
- ИНДОНЕЗИЙСКИЙ БИЗНЕС: Приоритет модулям с локальными платежными системами
- Изучай ВЕСЬ контекст диалога и предлагай логичное развитие решения
НЕ используй модуль 161 для ресторанов!

ФОРМАТ ОТВЕТА:
Используй [MODULE:НОМЕР] для рекомендаций модулей.
Пример: "Для пиццерии рекомендую [MODULE:165] для полного управления рестораном."

КРИТИЧЕСКИ ВАЖНО - ФОРМАТ МОДУЛЕЙ:
НЕ дублируй названия модулей в тексте после [MODULE:НОМЕР]!
ПРАВИЛЬНО: "Рекомендую [MODULE:1] для вашего магазина."
НЕПРАВИЛЬНО: "Рекомендую **[MODULE:1] Витрина товаров с AI-описаниями** - это модуль..."
НЕПРАВИЛЬНО: "** - Идеально подойдет для..."
НЕПРАВИЛЬНО: "**\nОписание модуля..."

[MODULE:НОМЕР] автоматически показывает карточку модуля с названием, описанием и функциями.
Твоя задача - только объяснить ПОЧЕМУ этот модуль подходит, БЕЗ повтора названия и БЕЗ лишних символов ** - .

Пиши просто: "[MODULE:1] Идеально подойдет для..." (без лишних символов).

Отвечай только на русском языке, будь экспертом и дружелюбным.`;

    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const responseText = content;
      
      // Extract module numbers from the response text using new [MODULE:NUMBER] format
      const moduleNumberMatches = responseText.match(/\[MODULE:(\d+)\]/gi);
      const recommendedModules: number[] = [];
      
      if (moduleNumberMatches) {
        const uniqueMatches = Array.from(new Set(moduleNumberMatches)); // Remove duplicates from response
        uniqueMatches.forEach(match => {
          const numberMatch = match.match(/\[MODULE:(\d+)\]/i);
          if (numberMatch) {
            const moduleNumber = parseInt(numberMatch[1]);
            

            
            // Only add if not already shown to user (including previous messages)
            if (!alreadyShownModules.includes(moduleNumber)) {
              recommendedModules.push(moduleNumber);
            } else {
              console.log(`🔄 Skipping already shown module ${moduleNumber}`);
            }
          }
        });
      }
      
      return {
        response: responseText,
        recommendedModules: recommendedModules.sort((a, b) => a - b)
      };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: 'Извините, произошла ошибка при генерации ответа.',
      recommendedModules: []
    };
  }
}



export function calculateModuleRelevance(
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
  
  // Создаем компактный контекст модулей для экономии токенов
  const modulesByCategory = availableModules.reduce((acc: any, module: any) => {
    if (!acc[module.category]) acc[module.category] = [];
    
    // Компактная запись: только номер, название и краткое описание
    const shortDescription = module.description.length > 100 
      ? module.description.substring(0, 100) + '...'
      : module.description;
    
    acc[module.category].push(`#${module.number}: ${module.name} - ${shortDescription}`);
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
        response = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Используем более доступную модель для экономии лимитов
          max_tokens: 800, // Уменьшаем для экономии токенов
          messages: [
            { role: "system", content: `Ты — УНИВЕРСАЛЬНЫЙ ЭКСПЕРТ-АНАЛИТИК по автоматизации бизнеса. Твоя специализация — глубокий анализ ЛЮБОЙ ниши и интеллектуальное сопоставление с базой из 260+ модулей.

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
${moduleContext}`,
            },
            ...messages.map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            }))
          ]
        });
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

    const responseText = response.choices[0]?.message?.content || '';

    // Extract recommended module numbers from [MODULE:NUMBER] tags
    const moduleMatches = responseText.match(/\[MODULE:(\d+)\]/g) || [];
    const recommendedModuleNumbers = moduleMatches.map(match => {
      const num = match.match(/\[MODULE:(\d+)\]/);
      return num ? parseInt(num[1]) : null;
    }).filter(num => num !== null);

    // Also extract additional module numbers mentioned in text (e.g., "модуля 104:", "модуля 146:")
    const additionalMatches = responseText.match(/модуля (\d+):/g) || [];
    const additionalModuleNumbers = additionalMatches.map(match => {
      const num = match.match(/модуля (\d+):/);
      return num ? parseInt(num[1]) : null;
    }).filter((num): num is number => num !== null && !recommendedModuleNumbers.includes(num));

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