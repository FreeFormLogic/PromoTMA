import Anthropic from '@anthropic-ai/sdk';

// IMPORTANT: Using Claude Sonnet 3.7 as requested by user
const DEFAULT_MODEL_STR = "claude-3-7-sonnet-20250219";

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
    const prompt = `Analyze the following business conversation and extract key information.
Return a JSON object with these fields:
- industry: main industry/niche
- size: business size (small/medium/large)
- challenges: array of main challenges mentioned
- goals: array of business goals
- relevantCategories: array of most relevant module categories from [E-COMMERCE, МАРКЕТИНГ, ВОВЛЕЧЕНИЕ, ОБРАЗОВАНИЕ, ФИНТЕХ, CRM, B2B, КОНТЕНТ И МЕДИА, ИНТЕГРАЦИИ, ИГРЫ, ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ, АВТОМАТИЗАЦИЯ, ОТРАСЛЕВЫЕ РЕШЕНИЯ, АНАЛИТИКА, БЕЗОПАСНОСТЬ, КОММУНИКАЦИИ, СОЦИАЛЬНАЯ КОММЕРЦИЯ, AI И АВТОМАТИЗАЦИЯ]
- keywords: array of important keywords for filtering modules
- persona: brief description of the business persona

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
    const systemPrompt = `You are an expert Telegram Mini Apps consultant with deep thinking capabilities. Help businesses by recommending ONLY the most essential modules first, then gradually add more as the conversation develops.

CRITICAL RULES:
1. START SMALL: In first response, recommend only 2-3 CORE modules that are absolutely essential
2. BE SPECIFIC: Always mention exact module numbers (e.g., "Модуль 41", "Модуль 5")
3. EXPLAIN VALUE: For each module, give a specific, personalized reason why it solves their exact business problem
4. GRADUAL EXPANSION: In follow-up responses, add 1-2 additional modules that complement the conversation
5. PRIORITIZE: Always put the most important modules first

ИНТЕЛЛЕКТУАЛЬНАЯ СИСТЕМА ПОДБОРА МОДУЛЕЙ:

АНАЛИЗИРУЙ БИЗНЕС КОНТЕКСТ И АВТОМАТИЧЕСКИ ОПРЕДЕЛЯЙ:
1. ТИП БИЗНЕСА (сфера деятельности, размер, цели)
2. КЛЮЧЕВЫЕ ПОТРЕБНОСТИ (что важно для этого типа бизнеса)
3. ПОДХОДЯЩИЕ КАТЕГОРИИ МОДУЛЕЙ
4. СПЕЦИФИЧЕСКИЕ МОДУЛИ ИЗ ОТРАСЛЕВЫХ РЕШЕНИЙ (161-170)

ОТРАСЛЕВЫЕ МОДУЛИ (161-170) - ВСЕГДА ПРИОРИТЕТ:
- 161: Ресторан - для ресторанов, кафе, доставки еды
- 162: Медклиника - для медицинских учреждений, врачей
- 163: Фитнес-клуб - для спортзалов, фитнеса, тренеров
- 164: Салон красоты - для салонов, барбершопов, косметологии
- 165: Отель - для гостиниц, хостелов, гестхаусов
- 166: Автосервис - для автомастерских, шиномонтажа
- 167: Стоматология - для стоматологических клиник
- 168: Юридическая фирма - для юристов, адвокатов
- 169: Логистика - для перевозок, доставки, складов
- 170: Образовательный центр - для школ, курсов, репетиторов

ЛОГИКА ПОДБОРА:
1. ВСЕГДА ИЩИ СООТВЕТСТВУЮЩИЙ ОТРАСЛЕВОЙ МОДУЛЬ ПЕРВЫМ
2. ДОПОЛНЯЙ УНИВЕРСАЛЬНЫМИ МОДУЛЯМИ (бронирование, CRM, оплата)
3. НЕ РЕКОМЕНДУЙ НЕПОДХОДЯЩИЕ (игры для медклиник, образование для салонов)

ДЛЯ E-COMMERCE:
- Модуль 1: Каталог товаров с фильтрацией
- Модуль 2: Корзина и оформление заказов
- Модуль 3: Система платежей

ДЛЯ ОБРАЗОВАНИЯ:
- Модуль 41: Платформа курсов с видео и тестами
- Модуль 42: База знаний с умным поиском

ДЛЯ РЕСТОРАНОВ:
- Модуль 161: Управление рестораном (ОТРАСЛЕВЫЕ РЕШЕНИЯ)
- Модуль 112: Система бронирования столиков

ДЛЯ ФИТНЕСА:
- Модуль 167: Управление фитнес-клубом (ОТРАСЛЕВЫЕ РЕШЕНИЯ)

УНИВЕРСАЛЬНЫЕ МОДУЛИ:
- Модуль 31: Программа лояльности (ВОВЛЕЧЕНИЕ)
- Модуль 78: CRM система (CRM)
- Модуль 112: Система бронирования (БРОНИРОВАНИЕ)

ВАЖНОЕ ОГРАНИЧЕНИЕ: Вы уже показали пользователю модули: ${alreadyShownModules.join(', ')}
НЕ РЕКОМЕНДУЙТЕ эти модули повторно! Предлагайте только новые дополнительные модули.

Always speak Russian and be extremely specific about how each module solves their exact business challenges.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 2048,
      system: `Ты - AI консультант для подбора модулей Telegram Mini App. 

ВАЖНО: Отвечай ТОЛЬКО на русском языке. 

У тебя есть база из 260+ модулей разных категорий. Твоя задача - анализировать бизнес пользователя и рекомендовать максимально подходящие модули.

СТИЛЬ ОБЩЕНИЯ:
- Будь экспертом, но дружелюбным
- Задавай уточняющие вопросы для лучшего понимания бизнеса
- Объясняй, ПОЧЕМУ именно этот модуль подходит для их бизнеса
- Рекомендуй 2-4 модуля за раз, не больше
- После каждой рекомендации спрашивай о дополнительных потребностях

ФОРМАТ ОТВЕТА:
Когда рекомендуешь модуль, используй ТОЧНО такой формат:
[MODULE:НОМЕР] - модуль будет заменен на интерактивную карточку
Например: [MODULE:112] вместо "**Модуль 112: Система умной записи на услуги (БРОНИРОВАНИЕ)**"

Пиши обычный текст, а вместо описания модуля ставь только [MODULE:НОМЕР].
Пример: "Для вашего салона красоты рекомендую [MODULE:112] который поможет автоматизировать запись клиентов."

УЖЕ ПОКАЗАННЫЕ МОДУЛИ: ${alreadyShownModules.join(', ')}
НЕ рекомендуй эти модули повторно!

Категории модулей: E-COMMERCE, МАРКЕТИНГ, ВОВЛЕЧЕНИЕ, ОБРАЗОВАНИЕ, ФИНТЕХ, CRM, B2B, БРОНИРОВАНИЕ, КОНТЕНТ И МЕДИА, ИНТЕГРАЦИИ, ИНДОНЕЗИЯ, ИГРЫ, ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ, АВТОМАТИЗАЦИЯ, ОТРАСЛЕВЫЕ РЕШЕНИЯ, АНАЛИТИКА, БЕЗОПАСНОСТЬ, КОММУНИКАЦИИ, СОЦИАЛЬНАЯ КОММЕРЦИЯ, AI И АВТОМАТИЗАЦИЯ, WEB3 & DEFI, ЛОКАЛЬНЫЕ СЕРВИСЫ, AI-АВАТАРЫ, ПАРСИНГ TELEGRAM.`,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const responseText = content.text;
      
      // Extract module numbers from the response text using new [MODULE:NUMBER] format
      const moduleNumberMatches = responseText.match(/\[MODULE:(\d+)\]/gi);
      const recommendedModules: number[] = [];
      
      if (moduleNumberMatches) {
        moduleNumberMatches.forEach(match => {
          const numberMatch = match.match(/\[MODULE:(\d+)\]/i);
          if (numberMatch) {
            const moduleNumber = parseInt(numberMatch[1]);
            // Only add if not already recommended and not already shown to user
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

    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1200, // Increased for detailed responses
      system: `AI консультант для Telegram Mini Apps. Анализируй бизнес и подбирай максимально подходящие модули на основе их КОНКРЕТНЫХ возможностей.

ТЕПЕРЬ У ТЕБЯ ЕСТЬ ПОЛНАЯ ИНФОРМАЦИЯ О ВОЗМОЖНОСТЯХ МОДУЛЕЙ - используй её для точного подбора!

ПРАВИЛА РЕКОМЕНДАЦИЙ:
1. Максимум 3-4 ОСНОВНЫХ модуля за раз
2. Формат: [MODULE:NUMBER] 
3. НЕ повторяй: ${displayedModuleNumbers.join(', ')}
4. Анализируй КОНКРЕТНЫЕ возможности каждого модуля, а не только название

ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ:
Если в других модулях есть полезные функции (но модуль в целом не подходит), упоминай их в разделе:

**Дополнительные возможности:**
• Из модуля X: конкретная функция Y
• Из модуля Z: конкретная функция W

(этот блок должен быть менее заметным)

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

    return {
      response: responseText,
      recommendedModules: recommendedModuleNumbers
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: 'Извините, произошла ошибка. Попробуйте еще раз.',
      recommendedModules: []
    };
  }
}