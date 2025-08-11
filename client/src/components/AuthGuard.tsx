import { useEffect, useState } from "react";
import { TelegramAuth } from "./TelegramAuth";

// Список разрешенных Telegram ID (дублируем из TelegramAuth для проверки)
const ALLOWED_USER_IDS = [
  "7418405560",
  "5173994544", 
  "216463929",
  "6209116360",
  "893850026",
  "1577419391",
  "5201551014"
];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Проверка авторизации...');
      const auth = localStorage.getItem('telegram_auth');
      console.log('Данные из localStorage:', auth);
      
      if (!auth) {
        console.log('Авторизация не найдена');
        setIsAuthenticated(false);
        return;
      }

      try {
        const authData = JSON.parse(auth);
        console.log('Распарсенные данные:', authData);
        
        // Check if auth data is less than 24 hours old
        const authAge = Date.now() - authData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (authAge > maxAge) {
          console.log('Сессия истекла');
          localStorage.removeItem('telegram_auth');
          setIsAuthenticated(false);
          return;
        }

        if (authData.user && authData.user.isAuthorized) {
          // Дополнительная проверка whitelist
          const userId = authData.user.id;
          const isInWhitelist = ALLOWED_USER_IDS.includes(userId);
          
          // Проверяем режим preview для разработки
          const urlParams = new URLSearchParams(window.location.search);
          const isPreview = urlParams.get('preview') === 'true';
          const isDevelopment = window.location.hostname.includes('replit') || 
                               window.location.hostname === 'localhost' ||
                               import.meta.env.DEV;
          
          if (isInWhitelist || (isDevelopment && isPreview)) {
            console.log('Пользователь авторизован:', authData.user);
            setUser(authData.user);
            setIsAuthenticated(true);
          } else {
            console.log(`Пользователь ${userId} не в whitelist`);
            localStorage.removeItem('telegram_auth');
            setIsAuthenticated(false);
          }
        } else {
          console.log('Пользователь не авторизован');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Ошибка парсинга:', error);
        localStorage.removeItem('telegram_auth');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuth = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    setIsAuthenticated(true);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <TelegramAuth onAuth={handleAuth} />;
  }

  return <>{children}</>;
}
