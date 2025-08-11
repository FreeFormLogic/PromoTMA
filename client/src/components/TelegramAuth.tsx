import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Telegram?: {
      Login: {
        auth: (options: {
          bot_id: string;
          request_access: string;
          embed: number;
        }, callback: (user: any) => void) => void;
      };
    };
  }
}

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

export function TelegramAuth({ onAuth }: TelegramAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  // Clear any existing auth data when component mounts
  useEffect(() => {
    localStorage.removeItem('telegram_auth');
  }, []);

  useEffect(() => {
    // Define global callback first
    (window as any).onTelegramAuth = (user: any) => {
      console.log('Telegram auth callback received:', user);
      handleTelegramAuth(user);
    };

    // Create Telegram Login Widget directly
    setTimeout(() => {
      const container = document.getElementById('telegram-login-widget');
      if (container) {
        // Create script element dynamically
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'tmasalesbot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        
        // Clear container and add script
        container.innerHTML = '';
        container.appendChild(script);
        
        console.log('Telegram widget script added');
      }
    }, 500);

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, []);

  const handleTelegramAuth = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('telegram_auth', JSON.stringify({
          user: data.user,
          timestamp: Date.now()
        }));
        toast({
          title: "Успешная авторизация",
          description: `Добро пожаловать, @${userData.username}!`,
        });
        onAuth(data.user);
      } else {
        toast({
          title: "Ошибка авторизации",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startTelegramAuth = async () => {
    setIsLoading(true);
    
    try {
      // Try to use the widget first
      const widgetContainer = document.getElementById('telegram-login-widget');
      if (widgetContainer && widgetContainer.innerHTML.includes('telegram-widget')) {
        toast({
          title: "Используйте виджет",
          description: "Нажмите синюю кнопку 'Log in via Telegram' выше",
        });
        setIsLoading(false);
        return;
      }

      // Fallback to bot
      const botUsername = 'tmasalesbot';
      const telegramUrl = `https://t.me/${botUsername}?start=auth_${Date.now()}`;
      
      window.open(telegramUrl, '_blank');
      
      toast({
        title: "Откройте бота",
        description: "Нажмите /start в боте, затем вернитесь и обновите страницу",
      });
      
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Ошибка",
        description: "Не удалось запустить авторизацию",
        variant: "destructive",
      });
    }
  };

  const handleDemoAuth = async () => {
    if (!username) return;
    
    setIsLoading(true);
    
    try {
      // Create demo auth data
      const demoAuthData = {
        id: Date.now(),
        username: username,
        first_name: username.charAt(0).toUpperCase() + username.slice(1),
        auth_date: Math.floor(Date.now() / 1000),
        hash: `demo_hash_${username}_${Date.now()}`,
        fromBot: true,
        isAuthorized: true
      };

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoAuthData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('telegram_auth', JSON.stringify({
          user: data.user,
          timestamp: Date.now()
        }));
        
        toast({
          title: "Успешная авторизация",
          description: `Добро пожаловать, @${username}!`,
        });
        
        onAuth(data.user);
      } else {
        toast({
          title: "Ошибка авторизации",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    toast({
      title: "Ожидание авторизации",
      description: "Нажмите /start в боте для авторизации",
    });

    // Show message about manual refresh
    setTimeout(() => {
      toast({
        title: "Важно",
        description: "После нажатия /start в боте обновите эту страницу",
        variant: "default",
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-telegram rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Добро пожаловать</CardTitle>
          <CardDescription>
            Войдите в Telegram и откройте бота для авторизации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Telegram Login Widget */}
            <div 
              id="telegram-login-widget"
              className="w-full flex justify-center"
            />
            
            {/* Demo Authorization */}
            <div className="space-y-2">
              <Label htmlFor="demo-username">Выберите тестового пользователя:</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              >
                <option value="">Выберите пользователя...</option>
                <option value="balilegend">@balilegend</option>
                <option value="dudewernon">@dudewernon</option>
                <option value="krutikov201318">@krutikov201318</option>
                <option value="partners_IRE">@partners_IRE</option>
                <option value="fluuxerr">@fluuxerr</option>
                <option value="Protasbali">@Protasbali</option>
                <option value="Radost_no">@Radost_no</option>
              </select>
              
              <Button 
                onClick={handleDemoAuth}
                disabled={isLoading || !username}
                className="w-full bg-telegram hover:bg-telegram/90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Авторизация...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Войти как {username || "пользователь"}
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">или</span>
              </div>
            </div>

            {/* Fallback button */}
            <Button 
              onClick={startTelegramAuth}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Авторизация...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Войти через Telegram (требует настройки бота)
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Выберите тестового пользователя для демонстрации или используйте Telegram</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}