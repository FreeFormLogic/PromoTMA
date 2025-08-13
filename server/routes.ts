import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import crypto from "crypto";
import { analyzeBusinessContext, generateAIResponse, calculateModuleRelevance, generateChatResponse } from "./ai";

const telegramAuthSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string(),
});



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
  
  // Simplified authentication routes
  app.post("/api/auth/simple", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ 
          message: "Имя пользователя обязательно" 
        });
      }

      // Find or create user
      let user = await storage.authenticateTelegramUser(username);
      
      if (!user) {
        // Create new user if not exists
        user = await storage.createUser({
          username: username,
          password: 'simple_auth',
          telegramUsername: `@${username}`,
          isAuthorized: true
        });
      }
      
      return res.json({ user, message: "Авторизация успешна" });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Ошибка авторизации" });
    }
  });

  // Telegram Login Widget authentication - secure with hash verification
  app.post("/api/auth/telegram", async (req, res) => {
    try {
      const authData = telegramAuthSchema.parse(req.body);
      
      // Verify Telegram authentication data hash for security
      if (!verifyTelegramAuth(authData)) {
        return res.status(401).json({ 
          message: "Неверная подпись Telegram. Попробуйте войти заново." 
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

      // Find or create user based on Telegram ID (more secure than username)
      let user = await storage.getUserByTelegramId(authData.id.toString());
      
      if (!user) {
        // Create new user with Telegram data
        user = await storage.createUser({
          username: authData.username || `user_${authData.id}`,
          password: 'telegram_auth',
          telegramUsername: authData.username ? `@${authData.username}` : `@user_${authData.id}`,
          isAuthorized: true
        });
        
        // Store telegram ID for future authentication
        await storage.linkTelegramId(user.id, authData.id.toString());
      }
      
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

  // AI Chat endpoints
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }
      
      const analysis = await analyzeBusinessContext(messages);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing business context:", error);
      res.status(500).json({ message: "Ошибка анализа контекста" });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, alreadyShownModules = [] } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }
      
      // Get ALL modules for AI context - this is critical for accurate recommendations
      const allModules = await storage.getAllModules();
      
      console.log('AI Chat Debug:');
      console.log('- Total modules in database:', allModules.length);
      console.log('- Messages received:', messages.length);
      console.log('- Already shown modules:', alreadyShownModules.length);
      
      // Convert message objects to proper format for AI
      console.log('- Raw messages format:', messages.map(m => `${m.role}: "${m.content}"`));
      
      // Use the improved generateChatResponse with complete module database
      const result = await generateChatResponse(messages, allModules, alreadyShownModules);
      
      console.log('- AI recommended module numbers:', result.recommendedModules);
      
      // Get recommended module details with validation
      const recommendedModules = result.recommendedModules
        .map(number => {
          const module = allModules.find(m => m.number === number);
          if (!module) {
            console.warn(`Module #${number} not found in database of ${allModules.length} modules`);
          }
          return module;
        })
        .filter(Boolean);

      console.log('- Found recommended modules:', recommendedModules.map(m => `#${m.number}: ${m.name}`));
      
      res.json({
        response: result.response,
        recommendedModules
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Handle rate limiting specifically
      if (error.status === 429 || error.message?.includes('rate_limit')) {
        return res.json({
          response: "⏱️ Слишком много запросов. Пожалуйста, подождите 1-2 минуты перед следующим запросом.",
          recommendedModules: []
        });
      }
      
      // Handle overload errors
      if (error.status === 529 || error.message?.includes('overloaded')) {
        return res.json({
          response: "🔄 Система временно перегружена. Попробуйте еще раз через несколько секунд.",
          recommendedModules: []
        });
      }
      
      // Generic error
      res.json({
        response: "Извините, произошла ошибка. Попробуйте еще раз.",
        recommendedModules: []
      });
    }
  });

  app.post("/api/ai/modules/relevant", async (req, res) => {
    try {
      const { moduleNumbers } = req.body;
      if (!moduleNumbers || !Array.isArray(moduleNumbers)) {
        return res.status(400).json({ message: "Module numbers array is required" });
      }
      
      const modules = await storage.getAllModules();
      
      // Filter modules to only include those recommended by AI
      const relevantModules = modules.filter(module => 
        moduleNumbers.includes(module.number)
      );
      
      // Sort by the order they were recommended
      relevantModules.sort((a, b) => {
        const aIndex = moduleNumbers.indexOf(a.number);
        const bIndex = moduleNumbers.indexOf(b.number);
        return aIndex - bIndex;
      });
      
      res.json(relevantModules);
    } catch (error) {
      console.error("Error getting relevant modules:", error);
      res.status(500).json({ message: "Ошибка получения релевантных модулей" });
    }
  });

  // Admin API для управления вайт-листом
  app.get("/api/admin/whitelist", async (req, res) => {
    try {
      const whitelist = storage.getWhitelist();
      res.json(whitelist);
    } catch (error) {
      console.error("Error fetching whitelist:", error);
      res.status(500).json({ message: "Ошибка получения списка пользователей" });
    }
  });

  app.post("/api/admin/whitelist", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId || !/^\d+$/.test(userId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const result = storage.addToWhitelist(userId);
      if (result.success) {
        res.json({ message: "Пользователь добавлен в вайт-лист" });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Error adding to whitelist:", error);
      res.status(500).json({ message: "Ошибка добавления пользователя" });
    }
  });

  app.post("/api/admin/whitelist/bulk", async (req, res) => {
    try {
      const { userIds } = req.body;
      
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "Список пользователей не может быть пустым" });
      }

      const results = storage.bulkAddToWhitelist(userIds);
      res.json({ 
        message: `Добавлено ${results.added} пользователей, пропущено ${results.skipped}`,
        results 
      });
    } catch (error) {
      console.error("Error bulk adding to whitelist:", error);
      res.status(500).json({ message: "Ошибка массового добавления пользователей" });
    }
  });

  app.delete("/api/admin/whitelist/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId || !/^\d+$/.test(userId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const result = storage.removeFromWhitelist(userId);
      if (result.success) {
        res.json({ message: "Пользователь удален из вайт-листа" });
      } else {
        res.status(404).json({ message: result.message });
      }
    } catch (error) {
      console.error("Error removing from whitelist:", error);
      res.status(500).json({ message: "Ошибка удаления пользователя" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
