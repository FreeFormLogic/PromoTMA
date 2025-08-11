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
    localStorage.removeItem('onboarding_completed');
  }, []);

  useEffect(() => {
    // Load Telegram Login Widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
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

  const handleUsernameAuth = async () => {
    if (!username.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ваш Telegram username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now(), // Temporary ID
          first_name: username,
          username: username.replace('@', ''),
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'temp_hash_' + Date.now() // Temporary hash
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('telegram_auth', JSON.stringify({
          user: data.user,
          timestamp: Date.now()
        }));
        toast({
          title: "Успешная авторизация",
          description: `Добро пожаловать, @${username.replace('@', '')}!`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-telegram rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Добро пожаловать</CardTitle>
          <CardDescription>
            Авторизуйтесь через Telegram бот для доступа к каталогу Mini Apps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Telegram Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="@ваш_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUsernameAuth()}
              />
            </div>
            
            <Button 
              onClick={handleUsernameAuth}
              disabled={isLoading}
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
                  Войти
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Введите ваш Telegram username для входа в систему</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}