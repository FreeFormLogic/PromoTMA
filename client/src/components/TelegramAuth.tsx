import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ShieldAlert } from "lucide-react";

// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

// Список разрешенных Telegram ID
const ALLOWED_USER_IDS = [
  7418405560,
  5173994544, 
  216463929,
  6209116360,
  893850026,
  1577419391,
  5201551014
];

export function TelegramAuth({ onAuth }: TelegramAuthProps) {
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Проверяем среду разработки
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname.includes('replit') ||
                         window.location.hostname.includes('127.0.0.1') ||
                         import.meta.env.DEV;

    // В среде разработки создаем тестового пользователя
    if (isDevelopment) {
      const testUser = {
        id: ALLOWED_USER_IDS[0].toString(),
        username: 'dev_user',
        telegramUsername: '@dev_user',
        firstName: 'Dev',
        lastName: 'User',
        isAuthorized: true,
      };

      localStorage.setItem('telegram_auth', JSON.stringify({
        user: testUser,
        timestamp: Date.now()
      }));

      console.log('Режим разработки - пользователь авторизован:', testUser);
      onAuth(testUser);
      return;
    }

    // Проверяем, запущено ли приложение в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const currentUser = tg.initDataUnsafe.user;
      
      console.log('Telegram user data:', currentUser);
      
      if (!currentUser) {
        setError("Не удалось получить данные пользователя из Telegram");
        setIsChecking(false);
        return;
      }

      // Проверяем, есть ли ID пользователя в списке разрешенных
      if (!ALLOWED_USER_IDS.includes(currentUser.id)) {
        setError(`Доступ запрещен. Ваш ID: ${currentUser.id}`);
        setIsChecking(false);
        return;
      }

      // Пользователь авторизован
      const userData = {
        id: currentUser.id.toString(),
        username: currentUser.username || `user_${currentUser.id}`,
        telegramUsername: currentUser.username ? `@${currentUser.username}` : null,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
        isAuthorized: true,
      };

      // Сохраняем данные
      localStorage.setItem('telegram_auth', JSON.stringify({
        user: userData,
        timestamp: Date.now()
      }));

      console.log('Пользователь авторизован:', userData);
      onAuth(userData);
      
    } else {
      setError("Приложение должно быть запущено через Telegram");
      setIsChecking(false);
    }
  }, [onAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-telegram/5 to-telegram/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram mx-auto"></div>
              <p className="text-gray-600">Проверка доступа...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Доступ запрещен
            </CardTitle>
            <CardDescription className="text-red-600 mt-2">
              Приложение доступно только авторизованным пользователям
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>Если вы считаете, что это ошибка,</p>
            <p>обратитесь к администратору</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}