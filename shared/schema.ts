import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, boolean, serial, timestamp } from "drizzle-orm/pg-core";
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
  addedAt: timestamp("added_at").defaultNow(),
  addedBy: varchar("added_by", { length: 255 }),
  isActive: boolean("is_active").default(true),
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

export const insertFunctionalityUserSchema = createInsertSchema(functionalityUsers).omit({
  id: true,
  addedAt: true,
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
export type InsertFunctionalityUser = z.infer<typeof insertFunctionalityUserSchema>;
