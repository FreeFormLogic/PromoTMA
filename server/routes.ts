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
  
  // Оптимизированная проверка whitelist для одного пользователя
  app.get("/api/admin/whitelist/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserByTelegramId(userId);
      
      if (user && user.isActive) {
        res.json({ 
          isActive: true,
          userId: user.id,
          telegramId: user.telegramId,
          username: user.username,
          realName: user.realName
        });
      } else {
        res.status(404).json({ isActive: false });
      }
    } catch (error) {
      console.error("Whitelist check error:", error);
      res.status(500).json({ isActive: false });
    }
  });

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
        user = await storage.addToWhitelist(authData.id.toString(), {
          firstName: authData.first_name,
          lastName: authData.last_name,
          username: authData.username,
          isActive: true
        });
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

  // Reset modules endpoint for development
  app.delete("/api/modules/reset", async (req, res) => {
    try {
      await storage.resetModules();
      return res.json({ message: "Модули сброшены и переинициализированы" });
    } catch (error) {
      console.error("Error resetting modules:", error);
      return res.status(500).json({ message: "Ошибка сброса модулей" });
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
      
      console.log('AI Chat Debug:');
      console.log('- Messages received:', messages.length);
      console.log('- Already shown modules:', alreadyShownModules.length);
      console.log('- Raw messages format:', messages.map(m => `${m.role}: "${m.content}"`));
      
      // Use generateAIResponse with already shown modules tracking
      const result = await generateAIResponse(messages, alreadyShownModules);
      
      console.log('- AI recommended module numbers:', result.recommendedModules);
      
      // Расчет токенов для Claude 4.0 (примерно 4 символа = 1 токен)
      const userMessage = messages[messages.length - 1]?.content || '';
      const inputTokens = Math.ceil(userMessage.length / 4);
      const outputTokens = Math.ceil(result.response.length / 4);
      
      // Цены для Claude Sonnet 4.0: $3/1M input tokens, $15/1M output tokens  
      const inputCost = (inputTokens / 1000000) * 3;
      const outputCost = (outputTokens / 1000000) * 15;
      const totalCost = inputCost + outputCost;
      
      // Создаем сессию для AI чата если ее нет
      const telegramId = req.headers['x-telegram-user-id'] as string || 'unknown';
      let sessionId = req.headers['x-session-id'] as string;
      if (!sessionId) {
        sessionId = await storage.createAiChatSession(telegramId);
      }
      
      // Сохраняем сообщение пользователя
      await storage.saveAiChatMessage(sessionId, {
        role: 'user',
        content: userMessage,
        tokensInput: inputTokens,
        tokensOutput: 0,
        costUsd: inputCost
      });
      
      // Сохраняем ответ AI
      await storage.saveAiChatMessage(sessionId, {
        role: 'assistant', 
        content: result.response,
        tokensInput: 0,
        tokensOutput: outputTokens,
        costUsd: outputCost
      });
      
      // Get recommended module details with validation  
      const allModules = await storage.getAllModules();
      const recommendedModules = result.recommendedModules
        .map(number => {
          const module = allModules.find(m => m.number === number);
          if (!module) {
            console.warn(`Module #${number} not found in database of ${allModules.length} modules`);
          }
          return module;
        })
        .filter(Boolean);

      console.log('- Found recommended modules:', recommendedModules.map(m => m ? `#${m.number}: ${m.name}` : 'undefined'));
      
      res.json({
        response: result.response,
        recommendedModules
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Handle rate limiting specifically
      if ((error as any).status === 429 || (error as any).message?.includes('rate_limit')) {
        return res.json({
          response: "⏱️ Слишком много запросов. Пожалуйста, подождите 1-2 минуты перед следующим запросом.",
          recommendedModules: []
        });
      }
      
      // Handle overload errors
      if ((error as any).status === 529 || (error as any).message?.includes('overloaded')) {
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
      const whitelist = await storage.getWhitelist();
      res.json(whitelist);
    } catch (error) {
      console.error("Error fetching whitelist:", error);
      res.status(500).json({ message: "Ошибка получения списка пользователей" });
    }
  });

  app.post("/api/admin/whitelist", async (req, res) => {
    try {
      const { telegramId, userData } = req.body;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const result = await storage.addToWhitelist(telegramId, userData);
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

      let added = 0;
      let skipped = 0;

      for (const telegramId of userIds) {
        if (!/^\d+$/.test(telegramId)) {
          skipped++;
          continue;
        }

        const result = await storage.addToWhitelist(telegramId);
        if (result.success) {
          added++;
        } else {
          skipped++;
        }
      }

      res.json({ 
        message: `Добавлено ${added} пользователей, пропущено ${skipped}`,
        added, 
        skipped 
      });
    } catch (error) {
      console.error("Error bulk adding to whitelist:", error);
      res.status(500).json({ message: "Ошибка массового добавления пользователей" });
    }
  });

  app.delete("/api/admin/whitelist/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const result = await storage.removeFromWhitelist(telegramId);
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

  // Update user endpoint (PATCH)
  app.patch("/api/admin/whitelist/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const updates = req.body;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const result = await storage.updateWhitelistUser(telegramId, updates);
      if (result.success) {
        res.json({ message: "Пользователь обновлен", user: result.user });
      } else {
        res.status(404).json({ message: result.message });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Ошибка обновления пользователя" });
    }
  });

  // User permissions management
  app.put("/api/admin/whitelist/:telegramId/permissions", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const permissions = req.body;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const result = await storage.updateUserPermissions(telegramId, permissions);
      if (result.success) {
        res.json({ message: "Разрешения пользователя обновлены" });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Error updating user permissions:", error);
      res.status(500).json({ message: "Ошибка обновления разрешений" });
    }
  });

  app.get("/api/admin/whitelist/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const user = await storage.getUserPermissions(telegramId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Пользователь не найден" });
      }
    } catch (error) {
      console.error("Error getting user permissions:", error);
      res.status(500).json({ message: "Ошибка получения данных пользователя" });
    }
  });

  // Authorization check endpoint
  app.get("/api/auth/check/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const isAuthorized = await storage.isUserAuthorized(telegramId);
      const permissions = await storage.getUserPermissions(telegramId);
      
      res.json({ 
        isAuthorized,
        permissions: permissions || null
      });
    } catch (error) {
      console.error("Error checking authorization:", error);
      res.status(500).json({ message: "Ошибка проверки авторизации" });
    }
  });

  // Page access check endpoint
  app.get("/api/auth/page-access/:telegramId/:page", async (req, res) => {
    try {
      const { telegramId, page } = req.params;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const canAccess = await storage.canUserAccessPage(telegramId, page);
      res.json({ canAccess });
    } catch (error) {
      console.error("Error checking page access:", error);
      res.status(500).json({ message: "Ошибка проверки доступа к странице" });
    }
  });

  // AI Chat Statistics routes
  // Referral system routes
  app.get('/api/referrals/:telegramId', async (req, res) => {
    try {
      const { telegramId } = req.params;
      
      if (!telegramId || !/^\d+$/.test(telegramId)) {
        return res.status(400).json({ message: "Некорректный Telegram ID" });
      }

      const referralInfo = await storage.getUserReferralInfo(telegramId);
      res.json(referralInfo);
    } catch (error) {
      console.error("Error getting referral info:", error);
      res.status(500).json({ message: "Ошибка получения реферальной информации" });
    }
  });

  app.post('/api/referrals/register', async (req, res) => {
    try {
      const { referralCode, newUserName, newUserPhone } = req.body;
      
      if (!referralCode || !newUserName || !newUserPhone) {
        return res.status(400).json({ message: "Все поля обязательны для заполнения" });
      }

      const result = await storage.registerViaReferral(referralCode, newUserName, newUserPhone);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error registering via referral:", error);
      res.status(500).json({ message: "Ошибка регистрации по реферальной ссылке" });
    }
  });

  app.get('/api/admin/referral-stats', async (req, res) => {
    try {
      const stats = await storage.getReferralStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting referral stats:", error);
      res.status(500).json({ message: "Ошибка получения статистики рефералов" });
    }
  });

  app.get('/api/admin/ai-stats', async (req, res) => {
    try {
      const stats = await storage.getAllUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get AI chat statistics' });
    }
  });

  app.get('/api/admin/ai-stats/:telegramId', async (req, res) => {
    try {
      const { telegramId } = req.params;
      const stats = await storage.getUserStats(telegramId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user AI statistics' });
    }
  });

  app.get('/api/admin/ai-history/:telegramId', async (req, res) => {
    try {
      const { telegramId } = req.params;
      const { limit = '50', offset = '0' } = req.query;
      const history = await storage.getUserChatHistory(telegramId, parseInt(limit as string), parseInt(offset as string));
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user chat history' });
    }
  });

  // AI Chat session management routes
  app.post('/api/ai-chat/session', async (req, res) => {
    try {
      const { telegramId, userAgent, ipAddress } = req.body;
      const sessionId = await storage.createAiChatSession(telegramId, userAgent, ipAddress);
      res.json({ sessionId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create chat session' });
    }
  });

  app.post('/api/ai-chat/message', async (req, res) => {
    try {
      const { sessionId, telegramId, role, content, tokensUsed, cost, model, metadata } = req.body;
      await storage.saveAiChatMessage(sessionId, telegramId, role, content, tokensUsed, cost, model, metadata);
      await storage.updateUserStats(telegramId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save chat message' });
    }
  });

  app.post('/api/ai-chat/session/:sessionId/end', async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.endAiChatSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to end chat session' });
    }
  });

  // AI Chat Statistics API
  app.get("/api/admin/ai-stats", async (req, res) => {
    try {
      const stats = await storage.getAllUserStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching AI stats:", error);
      res.status(500).json({ message: "Ошибка получения AI-статистики" });
    }
  });

  app.get("/api/admin/ai-stats/:telegramId", async (req, res) => {
    try {
      const { telegramId } = req.params;
      const userStats = await storage.getUserStats(telegramId);
      const chatHistory = await storage.getUserChatHistory(telegramId, 100);
      
      res.json({
        userStats,
        chatHistory
      });
    } catch (error) {
      console.error("Error fetching user AI stats:", error);
      res.status(500).json({ message: "Ошибка получения статистики пользователя" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
