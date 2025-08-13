import { type User, type InsertUser, type Module, type Industry, type USP, type Objection } from "@shared/schema";
import { randomUUID } from "crypto";
import { allModulesData } from "./seedModules";
import { allIndustriesData } from "./seedIndustries";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  linkTelegramId(userId: string, telegramId: string): Promise<void>;
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
  
  // Методы для управления вайт-листом
  getWhitelist(): any[];
  addToWhitelist(userId: string): { success: boolean; message: string };
  bulkAddToWhitelist(userIds: string[]): { added: number; skipped: number };
  removeFromWhitelist(userId: string): { success: boolean; message: string };
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private telegramIdToUserId: Map<string, string>; // Map telegram ID to user ID
  private modules: Map<string, Module>;
  private industries: Map<string, Industry>;
  private usps: Map<string, USP>;
  private objections: Map<string, Objection>;
  private whitelist: Set<string>; // Хранилище разрешенных Telegram ID

  constructor() {
    this.users = new Map();
    this.telegramIdToUserId = new Map();
    this.modules = new Map();
    this.industries = new Map();
    this.usps = new Map();
    this.objections = new Map();
    this.whitelist = new Set();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with empty user storage - all users will be created dynamically

    // Initialize modules data
    this.initializeModules();
    this.initializeIndustries();
    this.initializeUSPs();
    this.initializeObjections();
    this.initializeWhitelist();
  }

  private initializeWhitelist() {
    // Добавляем первоначальный список разрешенных пользователей
    const initialWhitelist = [
      "7418405560",
      "5173994544", 
      "216463929",
      "6209116360",
      "893850026",
      "1577419391",
      "5201551014",
      "666024781"
    ];
    
    initialWhitelist.forEach(id => this.whitelist.add(id));
  }

  private initializeModules() {
    // Загружаем все модули из файла seedModules.ts
    allModulesData.forEach(module => {
      this.modules.set(module.id, module);
    });
  }

  private initializeIndustries() {
    // Загружаем все отрасли из файла seedIndustries.ts
    allIndustriesData.forEach(industry => {
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
    const user: User = { 
      ...insertUser, 
      id, 
      isAuthorized: insertUser.isAuthorized ?? false,
      telegramUsername: insertUser.telegramUsername ?? null 
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const userId = this.telegramIdToUserId.get(telegramId);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  async linkTelegramId(userId: string, telegramId: string): Promise<void> {
    this.telegramIdToUserId.set(telegramId, userId);
  }

  async authenticateTelegramUser(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username || user.telegramUsername === `@${username}`,
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

  // Методы для управления вайт-листом
  getWhitelist(): any[] {
    return Array.from(this.whitelist).map(id => ({
      id,
      firstName: `User`,
      lastName: id.slice(-4),
      username: `user_${id.slice(-4)}`,
      addedAt: new Date().toISOString()
    }));
  }

  addToWhitelist(userId: string): { success: boolean; message: string } {
    if (this.whitelist.has(userId)) {
      return { success: false, message: "Пользователь уже в вайт-листе" };
    }
    
    this.whitelist.add(userId);
    return { success: true, message: "Пользователь добавлен в вайт-лист" };
  }

  bulkAddToWhitelist(userIds: string[]): { added: number; skipped: number } {
    let added = 0;
    let skipped = 0;
    
    userIds.forEach(userId => {
      if (this.whitelist.has(userId)) {
        skipped++;
      } else {
        this.whitelist.add(userId);
        added++;
      }
    });
    
    return { added, skipped };
  }

  removeFromWhitelist(userId: string): { success: boolean; message: string } {
    if (!this.whitelist.has(userId)) {
      return { success: false, message: "Пользователь не найден в вайт-листе" };
    }
    
    this.whitelist.delete(userId);
    return { success: true, message: "Пользователь удален из вайт-листа" };
  }
}

export const storage = new MemStorage();
