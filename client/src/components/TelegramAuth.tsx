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

  const startTelegramAuth = () => {
    const botUsername = "tmasalesbot";
    const telegramUrl = `https://t.me/${botUsername}`;
    
    toast({
      title: "Открытие Telegram",
      description: "Откройте бот в Telegram для авторизации",
    });
    
    window.open(telegramUrl, '_blank');
    
    // Start polling for auth status
    setTimeout(() => {
      checkAuthStatus();
    }, 3000);
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
          <Button 
            onClick={startTelegramAuth}
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
                Открыть Telegram бота
              </>
            )}
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>После авторизации в боте вернитесь и обновите страницу</p>
            <div className="mt-3">
              <button 
                onClick={() => window.location.reload()} 
                className="text-telegram hover:underline text-sm"
              >
                Обновить страницу
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}