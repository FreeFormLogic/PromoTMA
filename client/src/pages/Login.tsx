import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { TelegramLoginWidget } from "@/components/TelegramLoginWidget";

export default function Login() {
  const handleTelegramAuth = (user: any) => {
    console.log("Пользователь авторизован:", user);
    // Перенаправляем на главную страницу
    window.location.href = "/";
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
              Telegram Mini Apps Directory
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Защищенный справочник для разработчиков
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Временно используем упрощенную авторизацию:
            </p>
            <button
              onClick={async () => {
                try {
                  // Создаем пользователя с уникальным ID
                  const userId = `demo_${Date.now()}`;
                  const userData = {
                    id: userId,
                    username: userId,
                    telegramUsername: `@${userId}`,
                    isAuthorized: true
                  };
                  
                  localStorage.setItem('telegram_auth', JSON.stringify({
                    user: userData,
                    timestamp: Date.now()
                  }));
                  
                  // Уведомляем об успехе
                  handleTelegramAuth({
                    id: parseInt(userId.replace('demo_', '')),
                    first_name: 'Demo User',
                    auth_date: Math.floor(Date.now() / 1000),
                    hash: 'demo_hash'
                  });
                  
                } catch (error) {
                  console.error('Auth error:', error);
                }
              }}
              className="w-full bg-telegram hover:bg-telegram/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2 inline" />
              Демо вход (для тестирования)
            </button>
            <p className="text-xs text-gray-500">
              Нажмите для входа в систему.<br/>
              В продакшене будет настоящий Telegram Login Widget.
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              60+ модулей • 30+ ниш • 25+ УТП
            </p>
            <p className="text-xs text-gray-500">
              © 2025 Telegram Mini Apps
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
