import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

export function TelegramAuth({ onAuth }: TelegramAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      // Создаем пользователя с уникальным ID
      const userId = `user_${Date.now()}`;
      const user = {
        id: userId,
        username: `User${Math.floor(Math.random() * 10000)}`,
        telegramUsername: `@${userId}`,
        isAuthorized: true,
      };

      // Сохраняем в localStorage
      const authData = {
        user: user,
        timestamp: Date.now(),
      };

      localStorage.setItem('telegram_auth', JSON.stringify(authData));
      console.log('Сохранили данные авторизации:', authData);

      toast({
        title: "Успешная авторизация",
        description: "Добро пожаловать в каталог модулей!",
      });

      onAuth(user);
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить авторизацию",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-telegram/5 to-telegram/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-telegram rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              PromoTMA Directory
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Каталог Telegram Mini Apps модулей
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Простой вход одним нажатием:
            </p>
            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-telegram hover:bg-telegram/90 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
              size="lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              {isLoading ? "Вход..." : "Войти в систему"}
            </Button>
            <p className="text-xs text-gray-500">
              Нажмите для мгновенного входа в каталог модулей.<br/>
              Без регистрации и SMS.
            </p>
          </div>

          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-gray-600 font-medium">
              📱 60+ модулей • 🏢 30+ ниш • ⭐ 25+ УТП
            </p>
            <p className="text-xs text-gray-500">
              Полный каталог готовых решений для вашего бизнеса
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}