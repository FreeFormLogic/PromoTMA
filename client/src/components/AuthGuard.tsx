import { useEffect, useState } from "react";
import { TelegramAuth } from "./TelegramAuth";

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
        // Check if there's a telegram auth in global storage from bot
        const checkBotAuth = async () => {
          try {
            // Check all possible authorized user IDs (simple demo approach)
            const possibleUsers = [
              { username: 'balilegend', id: 'user1' },
              { username: 'dudewernon', id: 'user2' },
              { username: 'krutikov201318', id: 'user3' },
              { username: 'partners_IRE', id: 'user4' },
              { username: 'fluuxerr', id: 'user5' },
              { username: 'Protasbali', id: 'user6' },
              { username: 'Radost_no', id: 'user7' }
            ];

            for (const user of possibleUsers) {
              const response = await fetch(`/api/telegram/auth-status/${user.id}`);
              if (response.ok) {
                const data = await response.json();
                if (data.success) {
                  localStorage.setItem('telegram_auth', JSON.stringify({
                    user: data.user,
                    timestamp: Date.now()
                  }));
                  setUser(data.user);
                  setIsAuthenticated(true);
                  return;
                }
              }
            }
          } catch (error) {
            console.error('Bot auth check error:', error);
          }
        };

        await checkBotAuth();
        setIsAuthenticated(false);
        setUser(null);
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
          setUser(null);
          return;
        }

        if (authData.user && authData.user.isAuthorized) {
          setUser(authData.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('telegram_auth');
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    
    // Also listen for storage changes (in case user logs out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'telegram_auth') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
