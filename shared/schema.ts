import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, boolean, serial, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  telegramUsername: text("telegram_username"),
  isAuthorized: boolean("is_authorized").default(false),
});

export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: integer("number").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  keyFeatures: jsonb("key_features").notNull(),
  benefits: text("benefits").notNull(),
  isPopular: boolean("is_popular").default(false),
});

export const industries = pgTable("industries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  importance: text("importance").notNull(), // Почему критически важен
  category: text("category").notNull(), // КРИТИЧЕСКИ ВАЖНО, ОЧЕНЬ ПОЛЕЗНО, ПОЛЕЗНО
  icon: text("icon").notNull(),
  painPoints: jsonb("pain_points").notNull(), // Болевые точки и решения
  requiredModules: jsonb("required_modules").notNull(), // Обязательные модули
  recommendedModules: jsonb("recommended_modules").notNull(), // Рекомендуемые модули
  keyMetrics: jsonb("key_metrics").notNull(), // Ключевые метрики
});

export const usps = pgTable("usps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
});

export const objections = pgTable("objections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
});

// Authorized users table (first whitelist - app access)
export const authorizedUsers = pgTable("authorized_users", {
  id: serial("id").primaryKey(),
  telegramId: varchar("telegram_id", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  realName: varchar("real_name", { length: 255 }), // Редактируемое реальное имя
  addedAt: timestamp("added_at").defaultNow(),
  addedBy: varchar("added_by", { length: 255 }),
  isActive: boolean("is_active").default(true),
  // Разрешения доступа к страницам
  accessHome: boolean("access_home").default(true),
  accessModules: boolean("access_modules").default(true),
  accessIndustries: boolean("access_industries").default(true),
  accessAiConstructor: boolean("access_ai_constructor").default(true),
  accessMyApp: boolean("access_my_app").default(true),
  accessAdvantages: boolean("access_advantages").default(true),
  accessPartners: boolean("access_partners").default(true),
});

// Functionality access users table (second whitelist - module access)
export const functionalityUsers = pgTable("functionality_users", {
  id: serial("id").primaryKey(),
  telegramId: varchar("telegram_id", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  addedAt: timestamp("added_at").defaultNow(),
  addedBy: varchar("added_by", { length: 255 }),
  isActive: boolean("is_active").default(true),
});

// AI Chat Sessions - для отслеживания сессий пользователя
export const aiChatSessions = pgTable("ai_chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id", { length: 255 }).notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  totalMessages: integer("total_messages").default(0),
  totalTokensUsed: integer("total_tokens_used").default(0),
  totalCost: decimal("total_cost", { precision: 10, scale: 4 }).default("0.0000"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
});

// AI Chat Messages - для сохранения всех сообщений
export const aiChatMessages = pgTable("ai_chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  telegramId: varchar("telegram_id", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'user' или 'assistant'
  content: text("content").notNull(),
  tokensUsed: integer("tokens_used").default(0),
  cost: decimal("cost", { precision: 10, scale: 4 }).default("0.0000"),
  model: varchar("model", { length: 100 }).default("claude-sonnet-4-20250514"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // дополнительная информация (рекомендованные модули и т.д.)
});

// AI Chat User Statistics - агрегированная статистика по пользователям
export const aiChatUserStats = pgTable("ai_chat_user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegramId: varchar("telegram_id", { length: 255 }).notNull().unique(),
  totalSessions: integer("total_sessions").default(0),
  totalMessages: integer("total_messages").default(0),
  totalTokensUsed: integer("total_tokens_used").default(0),
  totalCost: decimal("total_cost", { precision: 10, scale: 4 }).default("0.0000"),
  averageSessionLength: decimal("average_session_length", { precision: 10, scale: 2 }).default("0.00"), // в минутах
  lastActiveAt: timestamp("last_active_at"),
  firstActiveAt: timestamp("first_active_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  telegramUsername: true,
  isAuthorized: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export const insertIndustrySchema = createInsertSchema(industries).omit({
  id: true,
});

export const insertUspSchema = createInsertSchema(usps).omit({
  id: true,
});

export const insertObjectionSchema = createInsertSchema(objections).omit({
  id: true,
});

export const insertAuthorizedUserSchema = createInsertSchema(authorizedUsers).omit({
  id: true,
  addedAt: true,
});

export const updateAuthorizedUserSchema = createInsertSchema(authorizedUsers).omit({
  id: true,
  telegramId: true,
  addedAt: true,
  addedBy: true,
}).partial();

export const insertFunctionalityUserSchema = createInsertSchema(functionalityUsers).omit({
  id: true,
  addedAt: true,
});

export const insertAiChatSessionSchema = createInsertSchema(aiChatSessions).omit({
  id: true,
  startedAt: true,
});

export const insertAiChatMessageSchema = createInsertSchema(aiChatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertAiChatUserStatsSchema = createInsertSchema(aiChatUserStats).omit({
  id: true,
  firstActiveAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type InsertIndustry = z.infer<typeof insertIndustrySchema>;
export type USP = typeof usps.$inferSelect;
export type Objection = typeof objections.$inferSelect;
export type AuthorizedUser = typeof authorizedUsers.$inferSelect;
export type FunctionalityUser = typeof functionalityUsers.$inferSelect;
export type InsertAuthorizedUser = z.infer<typeof insertAuthorizedUserSchema>;
export type UpdateAuthorizedUser = z.infer<typeof updateAuthorizedUserSchema>;
export type InsertFunctionalityUser = z.infer<typeof insertFunctionalityUserSchema>;
export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type AiChatUserStats = typeof aiChatUserStats.$inferSelect;
export type InsertAiChatSession = z.infer<typeof insertAiChatSessionSchema>;
export type InsertAiChatMessage = z.infer<typeof insertAiChatMessageSchema>;
export type InsertAiChatUserStats = z.infer<typeof insertAiChatUserStatsSchema>;
