// Smart module recommendation system without external AI dependency
export interface BusinessAnalysis {
  industry: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
}

// Business patterns for intelligent module matching
const BUSINESS_PATTERNS = {
  restaurant: {
    keywords: ["ресторан", "пиццерия", "кафе", "еда", "доставка", "заказ", "меню", "официант"],
    categories: ["E-COMMERCE", "БРОНИРОВАНИЕ", "МАРКЕТИНГ", "CRM"],
    recommendedModules: [145, 5, 55, 56, 165] // Заказы, платежи, бронирование, CRM, управление рестораном
  },
  retail: {
    keywords: ["магазин", "товар", "продажи", "склад", "инвентарь", "покупатель"],
    categories: ["E-COMMERCE", "МАРКЕТИНГ", "CRM", "ЛОГИСТИКА"],
    recommendedModules: [1, 2, 3, 5, 21, 46] // Витрина, карточки товаров, корзина, платежи
  },
  hotel: {
    keywords: ["отель", "гостиниц", "номер", "бронирование", "заселение", "туризм"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ", "ФИНТЕХ"],
    recommendedModules: [55, 56, 57, 18, 108] // Бронирование, календарь, CRM
  },
  fitness: {
    keywords: ["фитнес", "спортзал", "тренировка", "абонемент", "зал", "тренер"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ", "ФИТНЕС"],
    recommendedModules: [221, 56, 57, 108, 224] // Фитнес центр, бронирование
  },
  beauty: {
    keywords: ["салон", "красота", "стрижка", "маникюр", "услуга", "мастер"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МАРКЕТИНГ"],
    recommendedModules: [222, 56, 57, 18, 108] // Салон красоты, бронирование
  },
  medical: {
    keywords: ["клиника", "врач", "прием", "пациент", "медицина", "лечение"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "МЕДИЦИНА"],
    recommendedModules: [219, 56, 57, 18] // Медицинская клиника, запись на прием
  },
  education: {
    keywords: ["школа", "курсы", "обучение", "студент", "образование", "урок"],
    categories: ["ОБРАЗОВАНИЕ", "CRM", "МАРКЕТИНГ"],
    recommendedModules: [229, 56, 18, 108] // Образовательный центр, CRM
  },
  auto: {
    keywords: ["автосервис", "ремонт", "машина", "автомобиль", "техническое"],
    categories: ["БРОНИРОВАНИЕ", "CRM", "АВТОСЕРВИС"],
    recommendedModules: [223, 56, 18, 108] // Автосервис, бронирование
  }
};

export async function analyzeBusinessContext(messages: string[]): Promise<BusinessAnalysis> {
  console.log("🚀 Stage 1: Starting smart business analysis...");
  
  const messageText = messages.join(" ").toLowerCase();
  let detectedBusiness = null;
  
  // Smart pattern matching
  for (const [businessType, pattern] of Object.entries(BUSINESS_PATTERNS)) {
    const matchCount = pattern.keywords.filter(keyword => 
      messageText.includes(keyword)
    ).length;
    
    if (matchCount > 0) {
      detectedBusiness = { type: businessType, ...pattern, score: matchCount };
      break;
    }
  }
  
  // Fallback to general business
  if (!detectedBusiness) {
    detectedBusiness = {
      type: "general",
      categories: ["E-COMMERCE", "МАРКЕТИНГ", "CRM"],
      recommendedModules: [1, 5, 18, 46]
    };
  }
  
  console.log(`✅ Stage 1: Detected business type: ${detectedBusiness.type}`);
  
  return {
    industry: detectedBusiness.type,
    challenges: [],
    goals: [],
    relevantCategories: detectedBusiness.categories,
    keywords: []
  };
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
          if (module.number === 145) contextualDescription = "Организует прием заказов на доставку и самовывоз, управляя статусами от готовки до вручения.";
          else if (module.number === 5) contextualDescription = "Позволяет клиентам оплачивать заказы онлайн картой или через Telegram Pay.";
          else if (module.number === 165) contextualDescription = "Полное управление рестораном: меню, заказы, персонал и аналитика в одной системе.";
          else if (module.number === 55) contextualDescription = "Система бронирования столиков с выбором времени и количества гостей.";
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