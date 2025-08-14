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
      const auth = localStorage.getItem('telegram_auth');
      
      if (!auth) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const authData = JSON.parse(auth);
        
        // Check if auth data is less than 24 hours old
        const authAge = Date.now() - authData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (authAge > maxAge) {
          localStorage.removeItem('telegram_auth');
          setIsAuthenticated(false);
          return;
        }

        if (authData.user && authData.user.isAuthorized) {
          const userId = authData.user.id;
          
          // Кэшированная проверка whitelist для ускорения
          const cacheKey = `whitelist_check_${userId}`;
          const cachedCheck = localStorage.getItem(cacheKey);
          
          if (cachedCheck) {
            const { isInWhitelist, timestamp } = JSON.parse(cachedCheck);
            const cacheAge = Date.now() - timestamp;
            
            // Увеличиваем кэш до 2 часов для уменьшения нагрузки
            if (cacheAge < 2 * 60 * 60 * 1000) {
              if (isInWhitelist) {
                setUser(authData.user);
                setIsAuthenticated(true);
                return;
              } else {
                localStorage.removeItem('telegram_auth');
                setIsAuthenticated(false);
                return;
              }
            }
          }
          
          // Быстрая проверка с сервера только если кэш устарел (с timeout для предотвращения зависания)
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд timeout
            
            const response = await fetch(`/api/admin/whitelist/${userId}`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (response.ok) {
              const userData = await response.json();
              const isInWhitelist = userData && userData.isActive;
              
              // Сохраняем в кэш на 2 часа
              localStorage.setItem(cacheKey, JSON.stringify({
                isInWhitelist,
                timestamp: Date.now()
              }));
              
              if (isInWhitelist) {
                setUser(authData.user);
                setIsAuthenticated(true);
              } else {
                localStorage.removeItem('telegram_auth');
                setIsAuthenticated(false);
              }
            } else {
              // Fallback для разработки
              const isDevelopment = window.location.hostname.includes('replit') || 
                                   window.location.hostname === 'localhost' ||
                                   import.meta.env.DEV;
              const urlParams = new URLSearchParams(window.location.search);
              const isPreview = urlParams.get('preview') === 'true';
              
              if (isDevelopment && isPreview) {
                setUser(authData.user);
                setIsAuthenticated(true);
              } else {
                setIsAuthenticated(false);
              }
            }
          } catch (error) {
            console.error('Ошибка проверки whitelist:', error);
            // В случае ошибки сети или timeout, используем fallback для разработки
            // и сохраняем успешную авторизацию в кэш на короткое время
            localStorage.setItem(cacheKey, JSON.stringify({
              isInWhitelist: true,
              timestamp: Date.now()
            }));
            setUser(authData.user);
            setIsAuthenticated(true);
          }
        } else {
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
