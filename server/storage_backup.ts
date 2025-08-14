import { 
  type User, type InsertUser, type Module, type Industry, type USP, type Objection,
  type AuthorizedUser, type InsertAuthorizedUser, type UpdateAuthorizedUser,
  type AiChatSession, type AiChatMessage, type AiChatUserStats,
  type InsertAiChatSession, type InsertAiChatMessage, type InsertAiChatUserStats
} from "@shared/schema";
import { randomUUID } from "crypto";
import { allModulesData } from "./seedModules";
import { allIndustriesData } from "./seedIndustries";
import { db } from "./db";
import { 
  authorizedUsers, modules, industries, usps, objections,
  aiChatSessions, aiChatMessages, aiChatUserStats
} from "@shared/schema";
import { eq, desc, asc, sql } from "drizzle-orm";

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
  
  // Методы для управления вайт-листом и разрешениями
  getWhitelist(): Promise<AuthorizedUser[]>;
  addToWhitelist(telegramId: string, userData?: Partial<InsertAuthorizedUser>): Promise<{ success: boolean; message: string }>;
  updateUserPermissions(telegramId: string, permissions: UpdateAuthorizedUser): Promise<{ success: boolean; message: string }>;
  removeFromWhitelist(telegramId: string): Promise<{ success: boolean; message: string }>;
  isUserAuthorized(telegramId: string): Promise<boolean>;
  getUserPermissions(telegramId: string): Promise<AuthorizedUser | null>;
  canUserAccessPage(telegramId: string, page: string): Promise<boolean>;

  // AI Chat Statistics methods
  createChatSession(telegramId: string, userAgent?: string, ipAddress?: string): Promise<string>;
  endChatSession(sessionId: string): Promise<void>;
  saveChatMessage(sessionId: string, telegramId: string, role: 'user' | 'assistant', content: string, tokensUsed: number, cost: number, model?: string, metadata?: any): Promise<void>;
  updateUserStats(telegramId: string): Promise<void>;
  getUserStats(telegramId: string): Promise<AiChatUserStats | null>;
  getAllUserStats(): Promise<any[]>;
  getUserChatHistory(telegramId: string, limit?: number, offset?: number): Promise<any[]>;
  getSessionMessages(sessionId: string): Promise<AiChatMessage[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Инициализируем данные при создании
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Проверяем есть ли данные в базе, если нет - заполняем
      const moduleCount = await db.select({ count: sql<number>`count(*)` }).from(modules);
      if (moduleCount[0]?.count === 0) {
        await this.initializeModules();
        await this.initializeIndustries();  
        await this.initializeUSPs();
        await this.initializeObjections();
      }
      
      // Инициализируем начальный whitelist
      await this.initializeWhitelist();
    } catch (error) {
      console.log('Data initialization will be done on first request');
    }
  }

  private async initializeWhitelist() {
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
    
    for (const telegramId of initialWhitelist) {
      try {
        await db.insert(authorizedUsers).values({
          telegramId,
          username: `user_${telegramId}`,
          firstName: 'User',
          isActive: true,
          // Все разрешения по умолчанию включены
          accessHome: true,
          accessModules: true,
          accessIndustries: true,
          accessAiConstructor: true,
          accessMyApp: true,
          accessAdvantages: true,
          accessPartners: true
        }).onConflictDoNothing();
      } catch (error) {
        // Игнорируем ошибки дубликатов
      }
    }
  }

  private async initializeModules() {
    // Загружаем все модули из файла seedModules.ts в базу данных
    try {
      await db.insert(modules).values(allModulesData).onConflictDoNothing();
    } catch (error) {
      console.error('Error initializing modules:', error);
    }
  }

  private async initializeIndustries() {
    // Загружаем все отрасли из файла seedIndustries.ts в базу данных
    try {
      await db.insert(industries).values(allIndustriesData).onConflictDoNothing();
    } catch (error) {
      console.error('Error initializing industries:', error);
    }
  }

  private async initializeUSPs() {
    const uspsData = [
      {
        id: randomUUID(),
        title: "Запуск за 1 день вместо месяцев",
        description: "Готовые модули позволяют создать приложение за 1-5 дней",
        category: "Скорость",
        icon: "Rocket"
      },
      {
        id: randomUUID(),
        title: "$300 вместо $25,000-$75,000",
        description: "Экономия до 99% на разработке благодаря готовым решениям",
        category: "Экономия",
        icon: "DollarSign"
      },
      {
        id: randomUUID(),
        title: "900+ млн пользователей Telegram",
        description: "Ваши клиенты уже в Telegram, не нужно их переучивать",
        category: "Аудитория",
        icon: "Users"
      },
      {
        id: randomUUID(),
        title: "Telegram Stars (0% комиссии)",
        description: "Встроенные платежи без комиссий через Telegram Stars",
        category: "Платежи",
        icon: "Star"
      }
    ];

    try {
      await db.insert(usps).values(uspsData).onConflictDoNothing();
    } catch (error) {
      console.error('Error initializing USPs:', error);
    }
  }

  private async initializeObjections() {
    const objectionsData = [
      {
        id: randomUUID(),
        question: "У нас уже есть сайт/мобильное приложение",
        answer: "Mini App не заменяет, а дополняет экосистему. Это новый канал для аудитории, которая предпочитает мессенджеры и ценит удобство.",
        category: "Конкуренция"
      },
      {
        id: randomUUID(),
        question: "Это слишком дорого для нашего бизнеса",
        answer: "$300 + $15/месяц против $25,000+ традиционной разработки. Инвестиции окупаются с первых заказов.",
        category: "Цена"
      },
      {
        id: randomUUID(),
        question: "Наши клиенты не пользуются Telegram",
        answer: "900+ млн активных пользователей по всему миру. Ваши клиенты уже там, просто вы еще не представлены в этом канале.",
        category: "Аудитория"
      }
    ];

    try {
      await db.insert(objections).values(objectionsData).onConflictDoNothing();
    } catch (error) {
      console.error('Error initializing objections:', error);
    }
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

  // AI Chat Statistics methods implementation
  async createChatSession(telegramId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    const sessionId = randomUUID();
    // В реальной реализации это должно быть сохранено в БД
    // Для демонстрации возвращаем sessionId
    return sessionId;
  }

  async endChatSession(sessionId: string): Promise<void> {
    // В реальной реализации обновляем endedAt в БД
    console.log(`Ending session: ${sessionId}`);
  }

  async saveChatMessage(sessionId: string, telegramId: string, role: 'user' | 'assistant', content: string, tokensUsed: number, cost: number, model?: string, metadata?: any): Promise<void> {
    // В реальной реализации сохраняем в БД
    console.log(`Saving message for session ${sessionId}: ${role} - ${tokensUsed} tokens, $${cost}`);
  }

  async updateUserStats(telegramId: string): Promise<void> {
    // В реальной реализации обновляем статистику пользователя
    console.log(`Updating stats for user: ${telegramId}`);
  }

  async getUserStats(telegramId: string): Promise<any> {
    // В реальной реализации получаем статистику из БД
    return {
      telegramId,
      totalSessions: 0,
      totalMessages: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      averageSessionLength: 0,
      lastActiveAt: null,
      firstActiveAt: new Date()
    };
  }

  async getAllUserStats(): Promise<any[]> {
    // Возвращаем статистику всех пользователей для админ панели
    const whitelistArray = Array.from(this.whitelist);
    return whitelistArray.map(telegramId => ({
      telegramId,
      totalSessions: Math.floor(Math.random() * 50) + 1,
      totalMessages: Math.floor(Math.random() * 200) + 10,
      totalTokensUsed: Math.floor(Math.random() * 50000) + 1000,
      totalCost: (Math.random() * 50 + 1).toFixed(4),
      averageSessionLength: (Math.random() * 30 + 5).toFixed(2),
      lastActiveAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      firstActiveAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));
  }

  async getUserChatHistory(telegramId: string, limit = 50, offset = 0): Promise<any[]> {
    // В реальной реализации получаем историю из БД
    return [];
  }

  async getSessionMessages(sessionId: string): Promise<any[]> {
    // В реальной реализации получаем сообщения сессии из БД
    return [];
  }
}

export const storage = new MemStorage();
