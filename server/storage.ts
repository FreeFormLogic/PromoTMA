import { 
  type User, type InsertUser, type Module, type Industry, type USP, type Objection,
  type AuthorizedUser, type InsertAuthorizedUser, type UpdateAuthorizedUser,
  type AiChatSession, type AiChatMessage, type AiChatUserStats,
  type InsertAiChatSession, type InsertAiChatMessage, type InsertAiChatUserStats,
  type ReferralRegistration, type InsertReferralRegistration
} from "@shared/schema";
import { randomUUID } from "crypto";
import { allModulesData } from "./seedModules";
import { allIndustriesData } from "./seedIndustries";
import { db } from "./db";
import { 
  users, authorizedUsers, modules, industries, usps, objections,
  aiChatSessions, aiChatMessages, aiChatUserStats, referralRegistrations
} from "@shared/schema";
import { eq, desc, asc, sql, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<AuthorizedUser | undefined>;
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

  // Referral system methods
  generateReferralCode(telegramId: string): Promise<string>;
  getUserReferralInfo(telegramId: string): Promise<{ referralCode: string; referrals: ReferralRegistration[] }>;
  registerViaReferral(referralCode: string, newUserName: string, newUserPhone: string): Promise<{ success: boolean; message: string }>;
  getReferralStats(): Promise<any[]>;
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

  // User methods - простая реализация для совместимости
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch {
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByTelegramId(telegramId: string): Promise<AuthorizedUser | undefined> {
    try {
      const [user] = await db.select().from(authorizedUsers).where(eq(authorizedUsers.telegramId, telegramId));
      return user;
    } catch {
      return undefined;
    }
  }

  async linkTelegramId(userId: string, telegramId: string): Promise<void> {
    // Для совместимости - не используется в новой системе
  }

  async authenticateTelegramUser(username: string): Promise<User | undefined> {
    // Для совместимости - не используется в новой системе
    return undefined;
  }

  // Module methods
  async getAllModules(): Promise<Module[]> {
    return await db.select().from(modules);
  }

  async getModulesByCategory(category: string): Promise<Module[]> {
    return await db.select().from(modules).where(eq(modules.category, category));
  }

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  // Industry methods
  async getAllIndustries(): Promise<Industry[]> {
    return await db.select().from(industries);
  }

  async getIndustry(id: string): Promise<Industry | undefined> {
    const [industry] = await db.select().from(industries).where(eq(industries.id, id));
    return industry;
  }

  // USP methods
  async getAllUSPs(): Promise<USP[]> {
    return await db.select().from(usps);
  }

  async getUSPsByCategory(category: string): Promise<USP[]> {
    return await db.select().from(usps).where(eq(usps.category, category));
  }

  // Objection methods
  async getAllObjections(): Promise<Objection[]> {
    return await db.select().from(objections);
  }

  async getObjectionsByCategory(category: string): Promise<Objection[]> {
    return await db.select().from(objections).where(eq(objections.category, category));
  }

  // Whitelist и permissions methods
  async getWhitelist(): Promise<AuthorizedUser[]> {
    return await db.select().from(authorizedUsers).where(eq(authorizedUsers.isActive, true));
  }

  async addToWhitelist(telegramId: string, userData?: Partial<InsertAuthorizedUser>): Promise<{ success: boolean; message: string }> {
    try {
      const newUser: InsertAuthorizedUser = {
        telegramId,
        username: userData?.username || `user_${telegramId}`,
        firstName: userData?.firstName || 'User',
        lastName: userData?.lastName,
        realName: userData?.realName,
        isActive: true,
        // Все разрешения по умолчанию включены
        accessHome: userData?.accessHome ?? true,
        accessModules: userData?.accessModules ?? true,
        accessIndustries: userData?.accessIndustries ?? true,
        accessAiConstructor: userData?.accessAiConstructor ?? true,
        accessMyApp: userData?.accessMyApp ?? true,
        accessAdvantages: userData?.accessAdvantages ?? true,
        accessPartners: userData?.accessPartners ?? true
      };

      await db.insert(authorizedUsers).values(newUser);
      return { success: true, message: `Пользователь ${telegramId} добавлен в whitelist` };
    } catch (error) {
      return { success: false, message: `Ошибка добавления пользователя: ${error}` };
    }
  }

  async updateUserPermissions(telegramId: string, permissions: UpdateAuthorizedUser): Promise<{ success: boolean; message: string }> {
    try {
      await db.update(authorizedUsers)
        .set(permissions)
        .where(eq(authorizedUsers.telegramId, telegramId));
      return { success: true, message: `Разрешения пользователя ${telegramId} обновлены` };
    } catch (error) {
      return { success: false, message: `Ошибка обновления разрешений: ${error}` };
    }
  }

  async removeFromWhitelist(telegramId: string): Promise<{ success: boolean; message: string }> {
    try {
      await db.update(authorizedUsers)
        .set({ isActive: false })
        .where(eq(authorizedUsers.telegramId, telegramId));
      return { success: true, message: `Пользователь ${telegramId} удален из whitelist` };
    } catch (error) {
      return { success: false, message: `Ошибка удаления пользователя: ${error}` };
    }
  }

  async isUserAuthorized(telegramId: string): Promise<boolean> {
    try {
      const [user] = await db.select()
        .from(authorizedUsers)
        .where(and(eq(authorizedUsers.telegramId, telegramId), eq(authorizedUsers.isActive, true)));
      return !!user;
    } catch {
      return false;
    }
  }

  async getUserPermissions(telegramId: string): Promise<AuthorizedUser | null> {
    try {
      const [user] = await db.select()
        .from(authorizedUsers)
        .where(eq(authorizedUsers.telegramId, telegramId));
      return user || null;
    } catch {
      return null;
    }
  }

  async canUserAccessPage(telegramId: string, page: string): Promise<boolean> {
    try {
      const user = await this.getUserPermissions(telegramId);
      if (!user || !user.isActive) return false;

      switch (page) {
        case 'home': return user.accessHome || false;
        case 'modules': return user.accessModules || false;
        case 'industries': return user.accessIndustries || false;
        case 'ai-constructor': return user.accessAiConstructor || false;
        case 'my-app': return user.accessMyApp || false;
        case 'advantages': return user.accessAdvantages || false;
        case 'partners': return user.accessPartners || false;
        default: return false;
      }
    } catch {
      return false;
    }
  }

  // AI Chat Statistics methods
  async createAiChatSession(telegramId: string): Promise<string> {
    const sessionId = `session_${telegramId}_${Date.now()}`;
    const sessionData = {
      id: sessionId,
      telegramId: telegramId
    };

    await db.insert(aiChatSessions).values(sessionData);
    return sessionId;
  }

  async endAiChatSession(sessionId: string): Promise<void> {
    await db.update(aiChatSessions)
      .set({ endedAt: new Date(), isActive: false })
      .where(eq(aiChatSessions.id, sessionId));
    
    // Обновляем статистику пользователя
    const [session] = await db.select().from(aiChatSessions).where(eq(aiChatSessions.id, sessionId));
    if (session) {
      await this.updateUserStats(session.telegramId);
    }
  }

  async logAiChatMessage(
    sessionId: string, 
    telegramId: string, 
    role: 'user' | 'assistant', 
    content: string, 
    tokensInput: number, 
    tokensOutput: number, 
    cost: number, 
    metadata?: any
  ): Promise<void> {
    const messageData = {
      sessionId,
      telegramId,
      role,
      content,
      tokensInput: role === 'user' ? tokensInput : 0,
      tokensOutput: role === 'assistant' ? tokensOutput : 0,
      costUsd: cost.toString(),
      metadata: metadata || {}
    };

    await db.insert(aiChatMessages).values(messageData);

    // Обновляем счетчики в сессии
    await db.update(aiChatSessions)
      .set({
        messagesCount: sql`messages_count + 1`,
        tokensInput: sql`tokens_input + ${role === 'user' ? tokensInput : 0}`,
        tokensOutput: sql`tokens_output + ${role === 'assistant' ? tokensOutput : 0}`,
        costUsd: sql`cost_usd + ${cost}`
      })
      .where(eq(aiChatSessions.id, sessionId));

    // Обновляем статистику пользователя
    await this.updateUserStats(telegramId);
  }

  async updateUserStats(telegramId: string): Promise<void> {
    // Получаем агрегированную статистику из сессий
    const [stats] = await db.select({
      totalSessions: sql<number>`count(distinct ${aiChatSessions.id})`,
      totalMessages: sql<number>`coalesce(sum(${aiChatSessions.messagesCount}), 0)`,
      totalTokensInput: sql<number>`coalesce(sum(${aiChatSessions.tokensInput}), 0)`,
      totalTokensOutput: sql<number>`coalesce(sum(${aiChatSessions.tokensOutput}), 0)`,
      totalCost: sql<string>`coalesce(sum(${aiChatSessions.costUsd}), 0)`,
      lastActiveAt: sql<Date>`max(${aiChatSessions.startedAt})`,
      firstActiveAt: sql<Date>`min(${aiChatSessions.startedAt})`
    }).from(aiChatSessions).where(eq(aiChatSessions.telegramId, telegramId));

    const userStatsData = {
      telegramId,
      totalSessions: stats.totalSessions,
      totalMessages: stats.totalMessages,
      totalTokensInput: stats.totalTokensInput,
      totalTokensOutput: stats.totalTokensOutput,
      totalCostUsd: stats.totalCost,
      lastSessionAt: stats.lastActiveAt,
      firstSessionAt: stats.firstActiveAt
    };

    await db.insert(aiChatUserStats)
      .values(userStatsData)
      .onConflictDoUpdate({
        target: aiChatUserStats.telegramId,
        set: {
          ...userStatsData,
          updatedAt: new Date()
        }
      });
  }

  async getUserStats(telegramId: string): Promise<AiChatUserStats | null> {
    try {
      const [stats] = await db.select()
        .from(aiChatUserStats)
        .where(eq(aiChatUserStats.telegramId, telegramId));
      return stats || null;
    } catch {
      return null;
    }
  }

  async getAllUserStats(): Promise<any[]> {
    // Объединяем статистику с данными пользователей из whitelist
    const stats = await db.select({
      telegramId: aiChatUserStats.telegramId,
      totalSessions: aiChatUserStats.totalSessions,
      totalMessages: aiChatUserStats.totalMessages,
      totalTokensInput: aiChatUserStats.totalTokensInput,
      totalTokensOutput: aiChatUserStats.totalTokensOutput,
      totalCostUsd: aiChatUserStats.totalCostUsd,
      lastSessionAt: aiChatUserStats.lastSessionAt,
      firstSessionAt: aiChatUserStats.firstSessionAt,
      username: authorizedUsers.username,
      firstName: authorizedUsers.firstName,
      realName: authorizedUsers.realName
    })
    .from(aiChatUserStats)
    .leftJoin(authorizedUsers, eq(aiChatUserStats.telegramId, authorizedUsers.telegramId))
    .orderBy(desc(aiChatUserStats.lastSessionAt));

    return stats;
  }

  async getUserChatHistory(telegramId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    const messages = await db.select({
      id: aiChatMessages.id,
      sessionId: aiChatMessages.sessionId,
      role: aiChatMessages.role,
      content: aiChatMessages.content,
      tokensInput: aiChatMessages.tokensInput,
      tokensOutput: aiChatMessages.tokensOutput,
      costUsd: aiChatMessages.costUsd,
      timestamp: aiChatMessages.timestamp,
      metadata: aiChatMessages.metadata
    })
    .from(aiChatMessages)
    .where(eq(aiChatMessages.telegramId, telegramId))
    .orderBy(desc(aiChatMessages.timestamp))
    .limit(limit)
    .offset(offset);

    return messages;
  }

  async getSessionMessages(sessionId: string): Promise<AiChatMessage[]> {
    return await db.select()
      .from(aiChatMessages)
      .where(eq(aiChatMessages.sessionId, sessionId))
      .orderBy(asc(aiChatMessages.timestamp));
  }

  // Missing methods for routes compatibility  
  async getUserByTelegramId(telegramId: string): Promise<any | null> {
    try {
      const [user] = await db.select()
        .from(authorizedUsers)
        .where(eq(authorizedUsers.telegramId, telegramId));
      return user || null;
    } catch {
      return null;
    }
  }

  async getAllModules(): Promise<Module[]> {
    try {
      const allModules = await db.select().from(modules).orderBy(modules.number);
      return allModules;
    } catch {
      return [];
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const [user] = await db.insert(authorizedUsers)
        .values({
          telegramId: userData.telegramId || Date.now().toString(),
          username: userData.username,
          firstName: userData.firstName || 'User',
          isActive: userData.isAuthorized || false
        })
        .returning();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async linkTelegramId(userId: number, telegramId: string): Promise<void> {
    // This method is not needed with current schema but adding for compatibility
    return;
  }

  // Referral system methods
  async generateReferralCode(telegramId: string): Promise<string> {
    try {
      // Генерируем уникальный реферальный код
      const referralCode = `REF_${telegramId}_${Date.now()}`;
      
      // Обновляем пользователя с реферальным кодом
      await db.update(authorizedUsers)
        .set({ referralCode })
        .where(eq(authorizedUsers.telegramId, telegramId));
      
      return referralCode;
    } catch (error) {
      console.error("Error generating referral code:", error);
      throw error;
    }
  }

  async getUserReferralInfo(telegramId: string): Promise<{ referralCode: string; referrals: ReferralRegistration[] }> {
    try {
      const [user] = await db.select()
        .from(authorizedUsers)
        .where(eq(authorizedUsers.telegramId, telegramId));
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Если у пользователя нет реферального кода, создаем его
      let referralCode = user.referralCode;
      if (!referralCode) {
        referralCode = await this.generateReferralCode(telegramId);
      }
      
      // Получаем всех рефералов этого пользователя
      const referrals = await db.select()
        .from(referralRegistrations)
        .where(eq(referralRegistrations.referrerTelegramId, telegramId))
        .orderBy(desc(referralRegistrations.registeredAt));
      
      return { referralCode, referrals };
    } catch (error) {
      console.error("Error getting referral info:", error);
      throw error;
    }
  }

  async registerViaReferral(referralCode: string, newUserName: string, newUserPhone: string): Promise<{ success: boolean; message: string }> {
    try {
      // Находим пользователя по реферальному коду
      const [referrer] = await db.select()
        .from(authorizedUsers)
        .where(eq(authorizedUsers.referralCode, referralCode));
      
      if (!referrer) {
        return { success: false, message: "Реферальный код не найден" };
      }
      
      // Создаем запись регистрации по реферальной ссылке
      const [registration] = await db.insert(referralRegistrations)
        .values({
          referralCode,
          referrerTelegramId: referrer.telegramId,
          newUserName,
          newUserPhone,
        })
        .returning();
      
      return { success: true, message: `Регистрация успешна! ID: ${registration.id}` };
    } catch (error) {
      console.error("Error registering via referral:", error);
      return { success: false, message: `Ошибка регистрации: ${error}` };
    }
  }

  async getReferralStats(): Promise<any[]> {
    try {
      const stats = await db.select({
        referrerTelegramId: referralRegistrations.referrerTelegramId,
        referrerName: authorizedUsers.realName,
        referrerUsername: authorizedUsers.username,
        totalReferrals: sql<number>`count(*)`.as('totalReferrals')
      })
      .from(referralRegistrations)
      .leftJoin(authorizedUsers, eq(referralRegistrations.referrerTelegramId, authorizedUsers.telegramId))
      .groupBy(referralRegistrations.referrerTelegramId, authorizedUsers.realName, authorizedUsers.username)
      .orderBy(desc(sql`count(*)`));

      return stats;
    } catch (error) {
      console.error("Error getting referral stats:", error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();