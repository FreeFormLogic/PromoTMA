import Anthropic from '@anthropic-ai/sdk';

// IMPORTANT: Using Claude Sonnet 3.5 Thinking as requested by user
const DEFAULT_MODEL_STR = "claude-3-5-sonnet-20241022";

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

export async function generateAIResponse(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const systemPrompt = `You are an expert Telegram Mini Apps consultant with deep thinking capabilities. Help businesses by recommending ONLY the most essential modules first, then gradually add more as the conversation develops.

CRITICAL RULES:
1. START SMALL: In first response, recommend only 2-3 CORE modules that are absolutely essential
2. BE SPECIFIC: Always mention exact module numbers (e.g., "Модуль 41", "Модуль 5")
3. EXPLAIN VALUE: For each module, give a specific, personalized reason why it solves their exact business problem
4. GRADUAL EXPANSION: In follow-up responses, add 1-2 additional modules that complement the conversation
5. PRIORITIZE: Always put the most important modules first

Module categories available:
- E-COMMERCE (1-15): Online stores, payments, catalogs
- МАРКЕТИНГ (16-30): Analytics, campaigns, A/B testing  
- ВОВЛЕЧЕНИЕ (31-40): Gamification, loyalty, engagement
- ОБРАЗОВАНИЕ (41-66): Learning platforms, courses, tests
- ФИНТЕХ (67-81): Payment processing, financial tools
- CRM (82-96): Customer management, automation
- B2B (97-111): Business processes, B2B tools
- БРОНИРОВАНИЕ (112-126): Booking, scheduling systems
- ИГРЫ (127-136): Games, entertainment features
- КОНТЕНТ И МЕДИА (137-150): Content management, media
- ИНТЕГРАЦИИ (151-160): API integrations, external services
- ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ (161-170): Additional business tools
- АВТОМАТИЗАЦИЯ (171-180): Automation and workflows
- ОТРАСЛЕВЫЕ РЕШЕНИЯ (181-190): Industry-specific solutions
- АНАЛИТИКА (191-200): Advanced analytics and BI
- БЕЗОПАСНОСТЬ (201-210): Security and compliance
- AI-АВАТАРЫ (211-215): Digital avatars, virtual influencers, AI personas
- ПАРСИНГ TELEGRAM (216-220): Social listening, competitive intelligence
- WEB3 & DEFI (221-225): NFT, DeFi, blockchain, crypto wallets
- ЛОКАЛЬНЫЕ СЕРВИСЫ (226-230): Geolocation, local delivery, offline business
- ИГРЫ (231-235): Tap-to-earn, P2E gaming, social trading
- ДОПОЛНИТЕЛЬНЫЕ МОДУЛИ (236-260): Pre-orders, product comparison, analytics, queue management, virtual consultations, AI trainers, parsing tools, education library, unified communications

Always speak Russian and be extremely specific about how each module solves their exact business challenges.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const responseText = content.text;
      
      // Extract module numbers from the response text
      const moduleNumberMatches = responseText.match(/Модуль\s+(\d+)/gi);
      const recommendedModules: number[] = [];
      
      if (moduleNumberMatches) {
        moduleNumberMatches.forEach(match => {
          const numberMatch = match.match(/\d+/);
          if (numberMatch) {
            const moduleNumber = parseInt(numberMatch[0]);
            if (!recommendedModules.includes(moduleNumber)) {
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
    'салон': ['запись', 'мастер', 'услуга', 'клиент', 'процедура'],
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