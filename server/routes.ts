import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import crypto from "crypto";

const telegramAuthSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string(),
});

const ALLOWED_ACCOUNTS = [
  "balilegend",
  "dudewernon", 
  "krutikov201318",
  "partners_IRE",
  "fluuxerr",
  "Protasbali",
  "Radost_no"
];

function verifyTelegramAuth(authData: any): boolean {
  const { hash, ...data } = authData;
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN not found");
    return false;
  }
  
  // Create data-check-string
  const dataCheckArr = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
  
  // Create secret key
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  
  // Create hash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckArr)
    .digest('hex');
  
  return calculatedHash === hash;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/telegram", async (req, res) => {
    try {
      const authData = telegramAuthSchema.parse(req.body);
      
      // Verify Telegram authentication data
      if (!verifyTelegramAuth(authData)) {
        return res.status(401).json({ 
          message: "Неверная подпись Telegram. Попробуйте войти заново." 
        });
      }
      
      // Check if username is in allowed accounts
      if (!authData.username || !ALLOWED_ACCOUNTS.includes(authData.username)) {
        return res.status(403).json({ 
          message: "Доступ запрещен. Обратитесь к @balilegend для получения доступа." 
        });
      }
      
      // Check auth date (should be within 24 hours)
      const authDate = new Date(authData.auth_date * 1000);
      const now = new Date();
      const hoursDiff = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        return res.status(401).json({ 
          message: "Данные авторизации устарели. Попробуйте войти заново." 
        });
      }

      const user = await storage.authenticateTelegramUser(authData.username);
      return res.json({ user, message: "Авторизация успешна" });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(400).json({ message: "Неверные данные авторизации" });
    }
  });

  // Modules routes
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      return res.json(modules);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки модулей" });
    }
  });

  app.get("/api/modules/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const modules = await storage.getModulesByCategory(decodeURIComponent(category));
      return res.json(modules);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки модулей категории" });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const module = await storage.getModule(id);
      if (!module) {
        return res.status(404).json({ message: "Модуль не найден" });
      }
      return res.json(module);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки модуля" });
    }
  });

  // Industries routes
  app.get("/api/industries", async (req, res) => {
    try {
      const industries = await storage.getAllIndustries();
      return res.json(industries);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки отраслей" });
    }
  });

  app.get("/api/industries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const industry = await storage.getIndustry(id);
      if (!industry) {
        return res.status(404).json({ message: "Отрасль не найдена" });
      }
      return res.json(industry);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки отрасли" });
    }
  });

  // USPs routes
  app.get("/api/usps", async (req, res) => {
    try {
      const usps = await storage.getAllUSPs();
      return res.json(usps);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки преимуществ" });
    }
  });

  app.get("/api/usps/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const usps = await storage.getUSPsByCategory(decodeURIComponent(category));
      return res.json(usps);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки преимуществ категории" });
    }
  });

  // Objections routes
  app.get("/api/objections", async (req, res) => {
    try {
      const objections = await storage.getAllObjections();
      return res.json(objections);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки возражений" });
    }
  });

  app.get("/api/objections/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const objections = await storage.getObjectionsByCategory(decodeURIComponent(category));
      return res.json(objections);
    } catch (error) {
      return res.status(500).json({ message: "Ошибка загрузки возражений категории" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
