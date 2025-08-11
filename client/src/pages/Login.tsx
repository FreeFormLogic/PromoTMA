import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { TelegramLoginWidget } from "@/components/TelegramLoginWidget";

export default function Login() {
  const handleTelegramAuth = (user: any) => {
    console.log("Пользователь авторизован:", user);
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
              Войдите через Telegram одним нажатием:
            </p>
            <div className="flex justify-center">
              <TelegramLoginWidget 
                botName="miniapps_directory_bot"
                onAuth={handleTelegramAuth}
              />
            </div>
            <p className="text-xs text-gray-500">
              Безопасная авторизация через официальный виджет Telegram.<br/>
              Только владелец аккаунта может войти в систему.
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
