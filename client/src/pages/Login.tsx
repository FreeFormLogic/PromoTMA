import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest("POST", "/api/auth/telegram", { username });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('telegram_auth', JSON.stringify(data));
      toast({
        title: "Успешная авторизация",
        description: `Добро пожаловать, ${data.user.telegramUsername}!`,
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка авторизации",
        description: error.message || "Проверьте имя пользователя",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите имя пользователя Telegram",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(username.replace('@', ''));
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
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Доступ имеют только авторизованные пользователи: @balilegend и @Protasbali
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя Telegram</Label>
              <Input
                id="username"
                type="text"
                placeholder="Введите ваш username (без @)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loginMutation.isPending}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-telegram hover:bg-telegram-dark"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Проверка доступа...</span>
                </div>
              ) : (
                "Войти"
              )}
            </Button>
          </form>

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
