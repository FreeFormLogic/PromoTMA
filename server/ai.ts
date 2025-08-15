import Anthropic from '@anthropic-ai/sdk';

// IMPORTANT: Using Claude Sonnet 4 as requested by user
const DEFAULT_MODEL_STR = "claude-sonnet-4-20250514";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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
    const prompt = `Анализируй разговор о бизнесе и извлеки ключевую информацию. ВАЖНО: Люди часто пишут кратко и косвенно - анализируй подтекст:

ПРИМЕРЫ АНАЛИЗА:
• "Я таролог" → industry: "esoteric_services", goals: ["онлайн-консультации", "запись клиентов"], relevantCategories: ["CRM", "ОБРАЗОВАНИЕ", "КОММУНИКАЦИИ"]
• "Салон красоты" → industry: "beauty_salon", goals: ["запись клиентов", "лояльность"], relevantCategories: ["CRM", "ОТРАСЛЕВЫЕ РЕШЕНИЯ"]

Верни JSON с полями:
- industry: тип бизнеса (e.g., ecommerce, restaurant, salon, education, fintech, esoteric_services, etc.)
- size: размер бизнеса (small/medium/large)
- challenges: массив основных проблем
- goals: массив бизнес-целей
- relevantCategories: массив подходящих категорий модулей из [E-COMMERCE, МАРКЕТИНГ, ВОВЛЕЧЕНИЕ, ОБРАЗОВАНИЕ, ФИНТЕХ, CRM, B2B, КОНТЕНТ И МЕДИА, ИНТЕГРАЦИИ, ИГРЫ, ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ, АВТОМАТИЗАЦИЯ, ОТРАСЛЕВЫЕ РЕШЕНИЯ, АНАЛИТИКА, БЕЗОПАСНОСТЬ, КОММУНИКАЦИИ, СОЦИАЛЬНАЯ КОММЕРЦИЯ, AI И АВТОМАТИЗАЦИЯ]
- keywords: массив ключевых слов
- persona: краткое описание бизнес-персоны

Conversation:
${messages.join('\n')}

Respond only with valid JSON.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1024,
      system: "You are a business analyst. Respond with valid JSON only, no markdown formatting or additional text.",
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      let responseText = content.text.trim();
      
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
    
    // Формируем полный список модулей для AI
    const modulesList = allModules.map((module: any) => 
      `Модуль ${module.number}: ${module.name}
Описание: ${module.description}
Категория: ${module.category}
Ключевые возможности: ${JSON.parse(module.keyFeatures as string).join(', ')}
Преимущества: ${module.benefits}
---`
    ).join('\n');

    const systemPrompt = `You are an expert Telegram Mini Apps consultant. You have access to the COMPLETE database of all available modules. Use this information to make intelligent recommendations based on business needs.

ПОЛНАЯ БАЗА ДАННЫХ МОДУЛЕЙ:
${modulesList}

ПРАВИЛА РАБОТЫ:
1. Анализируй бизнес пользователя и его потребности
2. Выбирай НАИБОЛЕЕ ПОДХОДЯЩИЕ модули из полной базы данных
3. Рекомендуй 2-4 модуля за раз, начиная с самых важных
4. Объясняй, ПОЧЕМУ именно этот модуль подходит для их бизнеса
5. Учитывай контекст всего диалога

КЛЮЧЕВЫЕ ПРАВИЛА:
- Анализируй ПОЛНУЮ базу данных модулей и выбирай самые подходящие
- Для пиццерий/ресторанов ОБЯЗАТЕЛЬНО ПЕРВЫМ рекомендуй модуль 165 (Управление рестораном)
- Объясняй выбор конкретными преимуществами для их бизнеса
- Рекомендуй 2-4 модуля за раз, не перегружай

КРИТИЧЕСКИ ВАЖНО - УЖЕ ПОКАЗАННЫЕ МОДУЛИ: [${alreadyShownModules.join(', ')}]
НИКОГДА не рекомендуй эти модули снова!

ОБЯЗАТЕЛЬНО для пиццерий и ресторанов: начинай с модуля 165!

ФОРМАТ ОТВЕТА:
Используй [MODULE:НОМЕР] для рекомендаций модулей.
Пример: "Для пиццерии рекомендую [MODULE:165] для полного управления рестораном."

Отвечай только на русском языке, будь экспертом и дружелюбным.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const responseText = content.text;
      
      // Extract module numbers from the response text using new [MODULE:NUMBER] format
      const moduleNumberMatches = responseText.match(/\[MODULE:(\d+)\]/gi);
      const recommendedModules: number[] = [];
      
      if (moduleNumberMatches) {
        const uniqueMatches = Array.from(new Set(moduleNumberMatches)); // Remove duplicates from response
        uniqueMatches.forEach(match => {
          const numberMatch = match.match(/\[MODULE:(\d+)\]/i);
          if (numberMatch) {
            const moduleNumber = parseInt(numberMatch[1]);
            // Only add if not already recommended in this response and not already shown to user
            if (!recommendedModules.includes(moduleNumber) && !alreadyShownModules.includes(moduleNumber)) {
              recommendedModules.push(moduleNumber);
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

  // Industry-specific boost
  const industryKeywords: Record<string, string[]> = {
    'ресторан': ['меню', 'заказ', 'доставка', 'столик', 'кухня'],
    'магазин': ['товар', 'корзина', 'оплата', 'доставка', 'склад'],
    'образование': ['курс', 'обучение', 'тест', 'урок', 'студент'],
    'медицина': ['запись', 'пациент', 'консультация', 'анализ', 'карта'],
    'фитнес': ['тренировка', 'абонемент', 'тренер', 'занятие', 'зал'],
    'салон': ['запись', 'мастер', 'услуга', 'клиент', 'процедура', 'красота', 'стрижка'],
    'beauty': ['запись', 'мастер', 'услуга', 'клиент', 'процедура', 'красота', 'стрижка'],
  };

  const industryLower = analysis.industry.toLowerCase();
  for (const [key, keywords] of Object.entries(industryKeywords)) {
    if (industryLower.includes(key)) {
      for (const keyword of keywords) {
        if (module.name.toLowerCase().includes(keyword) || 
            module.description.toLowerCase().includes(keyword)) {
          score += 15;
        }
      }
    }
  }

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
  
  // Include ALL modules for better AI recommendations, exclude already shown
  const availableModules = allModules.filter(m => !displayedModuleNumbers.includes(m.number));
  
  // Create comprehensive module context with FULL DETAILS for better AI matching
  const modulesByCategory = availableModules.reduce((acc: any, module: any) => {
    if (!acc[module.category]) acc[module.category] = [];
    // Include full module details: number, name, description, and key features (with safety check)
    const features = module.features && Array.isArray(module.features) 
      ? module.features.slice(0, 3).join(', ') 
      : 'Подробности доступны в модальном окне';
    acc[module.category].push(`${module.number}: ${module.name} - ${module.description}. Ключевые возможности: ${features}`);
    return acc;
  }, {});
  
  const moduleContext = Object.entries(modulesByCategory)
    .map(([category, modules]: [string, any]) => `${category}:\n${(modules as string[]).join('\n')}`)
    .join('\n\n');

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!
    });

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
        response = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 1200, // Increased for detailed responses
          system: `Ты — эксперт-консультант по Telegram Mini Apps, который помогает бизнесу понять ценность автоматизации и цифровизации. Твоя цель — убедить пользователя в необходимости создания собственного приложения.

СТРАТЕГИЯ ПРОДАЖ:
1. НЕ выдумывай цифры без данных от клиента (сроки окупаемости, проценты роста)
2. Выявляй реальные потребности и проблемы бизнеса
3. Фокусируйся на результатах и решениях, а не на инструментах
4. Простой вход в воронку продаж - не требуй сложной информации сразу
5. Всегда предоставляй ВСЕ релевантные модули, которые решают проблемы клиента

ВАЖНО: Люди не всегда пишут прямо - анализируйте контекст и подтекст:
• "Я таролог" = эзотерические услуги, онлайн-консультации → рекомендуй модули: 112 (Бронирование), 78 (CRM), 140 (AI-чат поддержка), 160 (Управление задачами)
• "Салон красоты" = запись клиентов, услуги, лояльность → рекомендуй модули: 164 (Салон красоты), 78 (CRM), 31 (Лояльность)
• "Ресторан" = заказы, доставка, меню, бронирование → рекомендуй модули: 161 (Ресторан), 1 (Каталог товаров), 69 (Платежи)
• "Туризм" = бронирование, отели, экскурсии → рекомендуй модули: 169 (Отель), 112 (Бронирование), 173 (Логистика)

ФОРМАТ ОТВЕТА:
- БЕЗ заголовков с # (они ломают отображение)
- Выявляй проблемы и предлагай решения
- Показывай 4-6 модулей, которые решают конкретные задачи
- Подчеркивай результаты, а не функции
- НЕ выдумывай статистику без данных клиента

ПРАВИЛА РЕКОМЕНДАЦИЙ:
1. Максимум 3-4 ОСНОВНЫХ модуля за раз
2. Формат: [MODULE:NUMBER] 
3. НЕ повторяй: ${displayedModuleNumbers.join(', ')}
4. Анализируй КОНКРЕТНЫЕ возможности каждого модуля, а не только название

ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ:
Если в других модулях есть полезные функции (но модуль в целом не подходит), упоминай их тоже в формате [MODULE:NUMBER]:

**Дополнительные возможности:**
[MODULE:104] Медиагалерея - для презентации блюд
[MODULE:146] Мультиязычность - для иностранных клиентов  

ВСЕ рекомендуемые модули должны быть в формате [MODULE:NUMBER] чтобы система их корректно отобразила!

ПРИМЕРЫ ПОДБОРА ДЛЯ ТУРИЗМА:
ОСНОВНЫЕ модули: 112 (Бронирование), 78 (CRM), 169 (Отель), 173 (Логистика), 104 (Медиагалерея), 146 (Мультиязычность), 69 (Платежи), 31 (Лояльность)

Дополнительные функции из других модулей:
• Из модуля управления рестораном: бронирование столиков для туристов
• Из модуля событий: организация экскурсий и мероприятий

ДОСТУПНЫЕ МОДУЛИ С ПОЛНЫМИ ВОЗМОЖНОСТЯМИ:
${moduleContext}`,
          messages: messages.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        if (error.status === 529 && retryCount < maxRetries - 1) {
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

    let responseText = '';
    if (Array.isArray(response.content)) {
      responseText = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('');
    } else {
      responseText = response.content;
    }

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