import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer, boolean } from "drizzle-orm/pg-core";
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
  icon: text("icon").notNull(),
  solutions: jsonb("solutions").notNull(),
  painPoints: jsonb("pain_points").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  telegramUsername: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type USP = typeof usps.$inferSelect;
export type Objection = typeof objections.$inferSelect;
