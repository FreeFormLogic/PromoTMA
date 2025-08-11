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
      try {
        // Check URL params for auth success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
          // Remove auth param from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Verify JWT token with server
        const response = await fetch('/api/auth/verify', {
          credentials: 'include' // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            
            // Store user info in localStorage for offline access
            localStorage.setItem('telegram_auth', JSON.stringify({
              user: data.user,
              timestamp: Date.now()
            }));
            return;
          }
        }

        // Fallback: check localStorage for existing auth
        const auth = localStorage.getItem('telegram_auth');
        if (auth) {
          try {
            const authData = JSON.parse(auth);
            // Check if auth data is less than 24 hours old
            const authAge = Date.now() - authData.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            if (authAge <= maxAge && authData.user && authData.user.isAuthorized) {
              setUser(authData.user);
              setIsAuthenticated(true);
              return;
            } else {
              localStorage.removeItem('telegram_auth');
            }
          } catch (error) {
            localStorage.removeItem('telegram_auth');
          }
        }

        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error('Auth check error:', error);
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
