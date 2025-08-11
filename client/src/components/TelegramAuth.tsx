import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { toast } = useToast();

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
    if (window.Telegram?.Login) {
      window.Telegram.Login.auth(
        {
          bot_id: "8403061743", // Bot ID from the token
          request_access: "write",
          embed: 1
        },
        handleTelegramAuth
      );
    } else {
      // Fallback: open Telegram login in new window
      const botId = "8403061743";
      const url = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&request_access=write`;
      const popup = window.open(url, 'telegram-auth', 'width=600,height=600');
      
      // Listen for message from popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== 'https://oauth.telegram.org') return;
        
        if (event.data && event.data.user) {
          handleTelegramAuth(event.data.user);
          popup?.close();
          window.removeEventListener('message', messageHandler);
        }
      };
      
      window.addEventListener('message', messageHandler);
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
            Войдите через Telegram для доступа к каталогу Mini Apps
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
                Войти через Telegram
              </>
            )}
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Войдите через Telegram для доступа к справочнику</p>
            <p className="text-xs text-gray-500 mt-2">
              60+ модулей • 30+ ниш • 25+ УТП
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}