import Anthropic from '@anthropic-ai/sdk';

// IMPORTANT: Using the latest Claude Sonnet 4 model, not the older 3.x versions
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
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return JSON.parse(content.text);
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

export async function generateAIResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const systemPrompt = `You are a helpful Telegram Mini Apps consultant. You help businesses understand which modules and solutions would work best for their specific needs. 
Be concise, practical, and focus on actionable recommendations. Speak in Russian.
When discussing modules, reference specific module numbers and explain why they're relevant.`;

    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.';
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