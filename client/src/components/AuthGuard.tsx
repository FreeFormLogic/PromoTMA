import { useEffect, useState } from "react";
import { TelegramAuth } from "./TelegramAuth";

// Removed hardcoded whitelist - now checking server-side whitelist dynamically

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
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
          // Динамическая проверка whitelist с сервера
          const userId = authData.user.id;
          
          try {
            const response = await fetch('/api/admin/whitelist');
            const whitelist = await response.json();
            const isInWhitelist = whitelist.some((user: any) => user.id === userId);
            
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
          } catch (error) {
            console.error('Ошибка проверки whitelist:', error);
            // В случае ошибки запроса, разрешаем доступ в режиме разработки
            const urlParams = new URLSearchParams(window.location.search);
            const isPreview = urlParams.get('preview') === 'true';
            const isDevelopment = window.location.hostname.includes('replit') || 
                                 window.location.hostname === 'localhost' ||
                                 import.meta.env.DEV;
            
            if (isDevelopment && isPreview) {
              console.log('Пользователь авторизован (fallback режим разработки):', authData.user);
              setUser(authData.user);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
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
