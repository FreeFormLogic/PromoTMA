import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface BusinessAnalysis {
  industry: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
}

// Comprehensive business patterns for intelligent module matching
const BUSINESS_PATTERNS = {
  restaurant: {
    keywords: ["ресторан", "пиццерия", "кафе", "еда", "доставка", "заказ", "меню", "официант", "бали", "pizza"],
    categories: ["E-COMMERCE", "БРОНИРОВАНИЕ", "МАРКЕТИНГ", "CRM"],
    recommendedModules: [165, 145, 5, 120, 123] // Управление рестораном, система заказов, платежи, индонезийские платежи для Бали
  },
  travel: {
    keywords: ["турагентство", "туры", "путешествия", "отдых", "экскурсии", "турфирма", "туризм", "тур", "гид"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ", "ФИНТЕХ"],
    recommendedModules: [56, 57, 108, 18, 25] // Бронирование туров, календарь, CRM, маркетинг
  },
  retail: {
    keywords: ["магазин", "товар", "продажи", "склад", "инвентарь", "покупатель", "одежда", "обувь"],
    categories: ["E-COMMERCE", "МАРКЕТИНГ", "CRM", "ЛОГИСТИКА"],
    recommendedModules: [1, 2, 3, 5, 21] // Витрина, карточки товаров, корзина, платежи
  },
  hotel: {
    keywords: ["отель", "гостиниц", "номер", "бронирование", "заселение", "туризм", "хостел"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ", "ФИНТЕХ"],
    recommendedModules: [55, 56, 57, 18, 108] // Бронирование, календарь, CRM
  },
  fitness: {
    keywords: ["фитнес", "спортзал", "тренировка", "абонемент", "зал", "тренер", "йога", "спорт"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ", "ФИТНЕС"],
    recommendedModules: [221, 146, 25, 108, 18] // Фитнес центр, бронирование занятий, лояльность
  },
  beauty: {
    keywords: ["салон", "красота", "стрижка", "маникюр", "услуга", "мастер", "парикмахерская", "косметолог"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ"],
    recommendedModules: [222, 146, 18, 108, 25] // Салон красоты, бронирование услуг, маркетинг
  },
  medical: {
    keywords: ["клиника", "врач", "прием", "пациент", "медицина", "лечение", "стоматолог", "поликлиника"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МЕДИЦИНА"],
    recommendedModules: [219, 56, 57, 18] // Медицинская клиника, запись на прием
  },
  education: {
    keywords: ["школа", "курсы", "обучение", "студент", "образование", "урок", "университет", "институт"],
    categories: ["ОБРАЗОВАНИЕ", "CRM", "МАРКЕТИНГ"],
    recommendedModules: [229, 56, 18, 108] // Образовательный центр, CRM
  },
  auto: {
    keywords: ["автосервис", "ремонт", "машина", "автомобиль", "техническое", "шиномонтаж", "автомойка"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "АВТОСЕРВИС"],
    recommendedModules: [223, 56, 18, 108] // Автосервис, бронирование
  },
  real_estate: {
    keywords: ["недвижимость", "квартира", "аренда", "продажа", "риэлтор", "агентство", "дом"],
    categories: ["CRM", "МАРКЕТИНГ", "НЕДВИЖИМОСТЬ"],
    recommendedModules: [230, 108, 18, 46] // Недвижимость, CRM, маркетинг
  },
  logistics: {
    keywords: ["логистика", "доставка", "склад", "грузоперевозки", "курьер", "транспорт"],
    categories: ["ЛОГИСТИКА", "CRM", "E-COMMERCE"],
    recommendedModules: [231, 5, 108, 18] // Логистика, трекинг, CRM
  },
  legal: {
    keywords: ["юридические", "адвокат", "право", "консультации", "юрист", "нотариус"],
    categories: ["CRM", "ДОКУМЕНТООБОРОТ", "МАРКЕТИНГ"],
    recommendedModules: [225, 108, 18, 238] // Юридические услуги, CRM, документооборот
  },
  consulting: {
    keywords: ["консалтинг", "консультации", "бизнес", "стратегия", "управление", "аналитика"],
    categories: ["CRM", "МАРКЕТИНГ", "АНАЛИТИКА"],
    recommendedModules: [108, 18, 46, 25] // CRM, маркетинг, аналитика
  },
  event: {
    keywords: ["мероприятия", "событие", "праздник", "свадьба", "организация", "банкет"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ"],
    recommendedModules: [56, 57, 108, 18] // Бронирование мероприятий, CRM
  },
  delivery: {
    keywords: ["доставка", "курьер", "экспресс", "посылка", "отправка", "служба"],
    categories: ["ЛОГИСТИКА", "E-COMMERCE", "CRM"],
    recommendedModules: [5, 231, 108, 18] // Трекинг, логистика, CRM
  }
};

export async function analyzeBusinessContext(messages: string[]): Promise<BusinessAnalysis> {
  console.log("🧠 Analyzing business context with Gemini AI...");
  
  const conversationText = messages.join("\n");
  
  const prompt = `Проанализируй разговор с клиентом и определи:

РАЗГОВОР:
${conversationText}

Ответь ТОЛЬКО в формате JSON:
{
  "industry": "тип бизнеса (restaurant, travel, retail, beauty, fitness, medical, education, auto, real_estate, logistics, legal или general)",
  "challenges": ["основные вызовы бизнеса"],
  "goals": ["цели и задачи"],
  "relevantCategories": ["подходящие категории модулей"],
  "keywords": ["ключевые слова из разговора"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || "{}");
    console.log(`✅ Gemini analysis complete: ${result.industry}`);
    return result;
  } catch (error) {
    console.error("❌ Gemini analysis failed:", error);
    // Fallback to simple detection
    return {
      industry: "general",
      challenges: ["Общие бизнес-задачи"],
      goals: ["Автоматизация процессов"],
      relevantCategories: ["E-COMMERCE", "МАРКЕТИНГ", "CRM"],
      keywords: []
    };
  }
}

export async function generateAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  alreadyShownModules: number[] = [],
): Promise<{ response: string; recommendedModules: number[] }> {
  try {
    const { storage } = await import("./storage");
    const allModules = await storage.getAllModules();
    console.log(`🤖 AI processing ${allModules.length} total modules.`);

    // Stage 1: Smart business analysis
    const messageTexts = messages.map(m => `${m.role}: ${m.content}`);
    const analysis = await analyzeBusinessContext(messageTexts);
    
    console.log(`🧠 Stage 2: Business type detected as: ${analysis.industry}`);
    
    // Stage 2: Get business pattern recommendations
    const businessPattern = BUSINESS_PATTERNS[analysis.industry as keyof typeof BUSINESS_PATTERNS];
    let recommendedModuleNumbers: number[] = [];
    
    if (businessPattern) {
      recommendedModuleNumbers = businessPattern.recommendedModules
        .filter(num => !alreadyShownModules.includes(num))
        .slice(0, 3); // Максимум 3 модуля за раз
      console.log(`🎯 Using business pattern modules for ${analysis.industry}:`, recommendedModuleNumbers);
    } else {
      // Fallback для общих бизнесов
      recommendedModuleNumbers = [1, 5, 18].filter(num => !alreadyShownModules.includes(num));
    }
    
    console.log(`🎯 Stage 3: Selected modules: ${recommendedModuleNumbers}`);
    
    // Stage 3: Get actual module data and create descriptions
    const recommendedModules = allModules.filter(module => 
      recommendedModuleNumbers.includes(module.number)
    );
    
    // Create smart, contextual descriptions
    const responseLines = recommendedModules.map(module => {
      let contextualDescription = "";
      
      // Create business-specific descriptions
      switch (analysis.industry) {
        case "restaurant":
          if (module.number === 165) contextualDescription = "Полное управление рестораном: меню, заказы, персонал и аналитика в одной системе.";
          else if (module.number === 145) contextualDescription = "Организует прием заказов на доставку и самовывоз, управляя статусами от готовки до вручения.";
          else if (module.number === 5) contextualDescription = "Позволяет клиентам оплачивать заказы онлайн картой или через Telegram Pay.";
          else if (module.number === 120) contextualDescription = "Интеграция с популярными индонезийскими платежными системами GoPay и OVO для Бали.";
          else if (module.number === 123) contextualDescription = "Поддержка местных платежных методов DANA и LinkAja для клиентов из Индонезии.";
          break;
          
        case "travel":
          if (module.number === 56) contextualDescription = "Система бронирования туров и экскурсий с календарем доступности.";
          else if (module.number === 57) contextualDescription = "Календарь загруженности для планирования туристических программ.";
          else if (module.number === 108) contextualDescription = "CRM для управления клиентами турагентства и истории поездок.";
          else if (module.number === 18) contextualDescription = "A/B тестирование для оптимизации конверсии туристических предложений.";
          else if (module.number === 25) contextualDescription = "Программы лояльности для постоянных клиентов турагентства.";
          break;
          
        case "beauty":
          if (module.number === 222) contextualDescription = "Интерактивная презентация услуг салона с 3D-обзором результатов и AR-примеркой.";
          else if (module.number === 146) contextualDescription = "Система бронирования времени у мастеров с выбором услуг и продолжительности.";
          else if (module.number === 18) contextualDescription = "A/B тестирование акций и предложений для увеличения записи клиентов.";
          else if (module.number === 108) contextualDescription = "CRM для ведения истории клиентов, предпочтений и регулярности посещений.";
          else if (module.number === 25) contextualDescription = "Программы лояльности с накопительными скидками для постоянных клиентов.";
          break;
          
        case "fitness":
          if (module.number === 221) contextualDescription = "Каталог фитнес программ и услуг с AI-рекомендациями индивидуальных тренировок.";
          else if (module.number === 146) contextualDescription = "Система записи на групповые занятия и персональные тренировки.";
          else if (module.number === 25) contextualDescription = "Программы лояльности с абонементами и бонусами за регулярные тренировки.";
          else if (module.number === 108) contextualDescription = "CRM для отслеживания прогресса клиентов и планирования индивидуальных программ.";
          else if (module.number === 18) contextualDescription = "A/B тестирование мотивационных предложений и программ тренировок.";
          break;
          
        case "retail":
          if (module.number === 1) contextualDescription = "Создает привлекательную витрину товаров с умными фильтрами и поиском.";
          else if (module.number === 2) contextualDescription = "Детальные карточки товаров с фото, описанием и характеристиками.";
          else if (module.number === 3) contextualDescription = "Умная корзина покупок с сохранением и быстрым оформлением заказов.";
          break;
          
        case "hotel":
          if (module.number === 55) contextualDescription = "Система бронирования номеров с календарем доступности и тарифами.";
          else if (module.number === 56) contextualDescription = "Календарь загруженности и управление доступностью номеров.";
          break;
          
        default:
          contextualDescription = module.description.length > 100 ? 
            module.description.substring(0, 97) + "..." : module.description;
      }
      
      if (!contextualDescription) {
        contextualDescription = module.description.length > 80 ? 
          module.description.substring(0, 77) + "..." : module.description;
      }
      
      return `[MODULE:${module.number}] ${contextualDescription}`;
    });
    
    console.log("✅ Stage 4: Generated contextual recommendations");
    
    return {
      response: responseLines.join("\n"),
      recommendedModules: recommendedModuleNumbers,
    };

  } catch (error) {
    console.error("AI Main Logic Error:", error);
    return {
      response: "Извините, произошла ошибка при генерации ответа.",
      recommendedModules: [],
    };
  }
}