import { type User, type InsertUser, type Module, type Industry, type USP, type Objection } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateTelegramUser(username: string): Promise<User | undefined>;
  
  getAllModules(): Promise<Module[]>;
  getModulesByCategory(category: string): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  
  getAllIndustries(): Promise<Industry[]>;
  getIndustry(id: string): Promise<Industry | undefined>;
  
  getAllUSPs(): Promise<USP[]>;
  getUSPsByCategory(category: string): Promise<USP[]>;
  
  getAllObjections(): Promise<Objection[]>;
  getObjectionsByCategory(category: string): Promise<Objection[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private modules: Map<string, Module>;
  private industries: Map<string, Industry>;
  private usps: Map<string, USP>;
  private objections: Map<string, Objection>;

  constructor() {
    this.users = new Map();
    this.modules = new Map();
    this.industries = new Map();
    this.usps = new Map();
    this.objections = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize authorized users
    const authorizedUsers = [
      { username: 'balilegend', telegramUsername: '@balilegend' },
      { username: 'Protasbali', telegramUsername: '@Protasbali' }
    ];

    authorizedUsers.forEach(userData => {
      const user: User = {
        id: randomUUID(),
        username: userData.username,
        password: 'authorized',
        telegramUsername: userData.telegramUsername,
        isAuthorized: true
      };
      this.users.set(user.id, user);
    });

    // Initialize modules data
    this.initializeModules();
    this.initializeIndustries();
    this.initializeUSPs();
    this.initializeObjections();
  }

  private initializeModules() {
    const moduleCategories = [
      {
        category: "E-COMMERCE И ПРОДАЖИ",
        modules: [
          { name: "Витрина товаров с AI-описаниями", icon: "Store", features: ["AI-генерация описаний", "Каталог товаров", "Поиск и фильтры"] },
          { name: "Карточка товара с 360° галереей", icon: "Image", features: ["360° просмотр", "Увеличение фото", "Множественные ракурсы"] },
          { name: "Корзина и быстрое оформление в 2 клика", icon: "ShoppingCart", features: ["Быстрый заказ", "Сохранение корзины", "Одним кликом"] },
          { name: "Автоматический прием платежей (Telegram Stars 0%)", icon: "CreditCard", features: ["Telegram Stars", "Криптоплатежи", "Автоматическая обработка"] },
          { name: "Система статусов заказов с трекингом", icon: "Package", features: ["Отслеживание заказа", "SMS/Push уведомления", "История заказов"] }
        ]
      },
      {
        category: "МАРКЕТИНГ И АНАЛИТИКА",
        modules: [
          { name: "AI-персонализация контента", icon: "Brain", features: ["Персональные рекомендации", "Умная лента", "Поведенческий анализ"] },
          { name: "Дашборд бизнес-аналитики в реальном времени", icon: "BarChart3", features: ["Реальные метрики", "Конверсии", "ROI анализ"] },
          { name: "Гео-таргетированные push-уведомления", icon: "MapPin", features: ["Геолокация", "Персональные сообщения", "Автоматическая отправка"] },
          { name: "A/B тестирование интерфейсов", icon: "TestTube", features: ["Сплит-тесты", "Статистика", "Оптимизация конверсий"] }
        ]
      },
      {
        category: "ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ",
        modules: [
          { name: "Система баллов и VIP-статусы", icon: "Crown", features: ["Программа лояльности", "VIP уровни", "Бонусные баллы"] },
          { name: "Игровые достижения и коллекционные бейджи", icon: "Trophy", features: ["Достижения", "Коллекции", "Игровые механики"] },
          { name: "Ежедневные задания и streak-система", icon: "Calendar", features: ["Ежедневные задачи", "Серии дней", "Мотивация"] },
          { name: "Партнерская MLM программа", icon: "Users", features: ["Реферальная система", "Многоуровневость", "Комиссии"] }
        ]
      }
    ];

    moduleCategories.forEach(category => {
      category.modules.forEach(moduleData => {
        const module: Module = {
          id: randomUUID(),
          name: moduleData.name,
          description: `Модуль ${moduleData.name} включает полный функционал для автоматизации и улучшения пользовательского опыта.`,
          category: category.category,
          icon: moduleData.icon,
          features: moduleData.features,
          isPopular: Math.random() > 0.7
        };
        this.modules.set(module.id, module);
      });
    });
  }

  private initializeIndustries() {
    const industriesData = [
      {
        name: "Розничная торговля и e-commerce",
        description: "Полноценный интернет-магазин в Telegram",
        icon: "Store",
        solutions: ["Каталог товаров", "Корзина и оплата", "Система скидок", "Управление заказами"],
        painPoints: ["Высокие комиссии маркетплейсов", "Сложность привлечения клиентов", "Дорогая разработка сайта"]
      },
      {
        name: "Рестораны и доставка еды",
        description: "Прием заказов и доставка через Telegram",
        icon: "UtensilsCrossed",
        solutions: ["Меню с фото", "Онлайн заказы", "Система доставки", "Программа лояльности"],
        painPoints: ["Высокие комиссии агрегаторов", "Сложность управления заказами", "Отсутствие прямой связи с клиентами"]
      },
      {
        name: "Образование и онлайн-курсы",
        description: "Платформа обучения внутри Telegram",
        icon: "GraduationCap",
        solutions: ["Видеоуроки", "Тесты и задания", "Сертификаты", "Прогресс обучения"],
        painPoints: ["Дорогие LMS платформы", "Низкая вовлеченность студентов", "Сложность создания курсов"]
      }
    ];

    industriesData.forEach(industryData => {
      const industry: Industry = {
        id: randomUUID(),
        name: industryData.name,
        description: industryData.description,
        icon: industryData.icon,
        solutions: industryData.solutions,
        painPoints: industryData.painPoints
      };
      this.industries.set(industry.id, industry);
    });
  }

  private initializeUSPs() {
    const uspsData = [
      {
        title: "Запуск за 1 день вместо месяцев",
        description: "Готовые модули позволяют создать приложение за 1-5 дней",
        category: "Скорость",
        icon: "Rocket"
      },
      {
        title: "$300 вместо $25,000-$75,000",
        description: "Экономия до 99% на разработке благодаря готовым решениям",
        category: "Экономия",
        icon: "DollarSign"
      },
      {
        title: "900+ млн пользователей Telegram",
        description: "Ваши клиенты уже в Telegram, не нужно их переучивать",
        category: "Аудитория",
        icon: "Users"
      },
      {
        title: "Telegram Stars (0% комиссии)",
        description: "Встроенные платежи без комиссий через Telegram Stars",
        category: "Платежи",
        icon: "Star"
      }
    ];

    uspsData.forEach(uspData => {
      const usp: USP = {
        id: randomUUID(),
        title: uspData.title,
        description: uspData.description,
        category: uspData.category,
        icon: uspData.icon
      };
      this.usps.set(usp.id, usp);
    });
  }

  private initializeObjections() {
    const objectionsData = [
      {
        question: "У нас уже есть сайт/мобильное приложение",
        answer: "Mini App не заменяет, а дополняет экосистему. Это новый канал для аудитории, которая предпочитает мессенджеры и ценит удобство.",
        category: "Конкуренция"
      },
      {
        question: "Это слишком дорого для нашего бизнеса",
        answer: "$300 + $15/месяц против $25,000+ традиционной разработки. Инвестиции окупаются с первых заказов.",
        category: "Цена"
      },
      {
        question: "Наши клиенты не пользуются Telegram",
        answer: "900+ млн активных пользователей по всему миру. Ваши клиенты уже там, просто вы еще не представлены в этом канале.",
        category: "Аудитория"
      }
    ];

    objectionsData.forEach(objectionData => {
      const objection: Objection = {
        id: randomUUID(),
        question: objectionData.question,
        answer: objectionData.answer,
        category: objectionData.category
      };
      this.objections.set(objection.id, objection);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, isAuthorized: false };
    this.users.set(id, user);
    return user;
  }

  async authenticateTelegramUser(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramUsername === `@${username}` && user.isAuthorized,
    );
  }

  async getAllModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }

  async getModulesByCategory(category: string): Promise<Module[]> {
    return Array.from(this.modules.values()).filter(
      (module) => module.category === category,
    );
  }

  async getModule(id: string): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async getAllIndustries(): Promise<Industry[]> {
    return Array.from(this.industries.values());
  }

  async getIndustry(id: string): Promise<Industry | undefined> {
    return this.industries.get(id);
  }

  async getAllUSPs(): Promise<USP[]> {
    return Array.from(this.usps.values());
  }

  async getUSPsByCategory(category: string): Promise<USP[]> {
    return Array.from(this.usps.values()).filter(
      (usp) => usp.category === category,
    );
  }

  async getAllObjections(): Promise<Objection[]> {
    return Array.from(this.objections.values());
  }

  async getObjectionsByCategory(category: string): Promise<Objection[]> {
    return Array.from(this.objections.values()).filter(
      (objection) => objection.category === category,
    );
  }
}

export const storage = new MemStorage();
