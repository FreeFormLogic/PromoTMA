import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Users, Shield, Settings } from "lucide-react";

interface WhitelistUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  addedAt: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [newUserId, setNewUserId] = useState("");
  const [bulkUserIds, setBulkUserIds] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  // Простая проверка админ-доступа
  const handleAdminLogin = () => {
    if (adminPassword === "PromoTMA2025") {
      setIsAuthenticated(true);
      toast({
        title: "Доступ разрешен",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        title: "Неверный пароль",
        description: "Доступ запрещен",
        variant: "destructive",
      });
    }
  };

  // Получение списка разрешенных пользователей
  const { data: whitelist = [], isLoading } = useQuery({
    queryKey: ["/api/admin/whitelist"],
    queryFn: async () => {
      const response = await fetch("/api/admin/whitelist");
      if (!response.ok) throw new Error("Ошибка загрузки");
      return response.json();
    }
  });

  // Добавление пользователя в вайт-лист
  const addUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch("/api/admin/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error("Ошибка добавления");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whitelist"] });
      setNewUserId("");
      toast({
        title: "Пользователь добавлен",
        description: "Пользователь успешно добавлен в вайт-лист",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить пользователя",
        variant: "destructive",
      });
    },
  });

  // Массовое добавление пользователей
  const bulkAddMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await fetch("/api/admin/whitelist/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) throw new Error("Ошибка массового добавления");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whitelist"] });
      setBulkUserIds("");
      toast({
        title: "Пользователи добавлены",
        description: "Пользователи успешно добавлены в вайт-лист",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить пользователей",
        variant: "destructive",
      });
    },
  });

  // Удаление пользователя из вайт-листа
  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/whitelist/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Ошибка удаления");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whitelist"] });
      toast({
        title: "Пользователь удален",
        description: "Пользователь удален из вайт-листа",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить пользователя",
        variant: "destructive",
      });
    },
  });

  const handleAddUser = () => {
    if (!newUserId.trim()) return;
    
    // Проверяем, что это число
    if (!/^\d+$/.test(newUserId.trim())) {
      toast({
        title: "Ошибка",
        description: "Telegram ID должен содержать только цифры",
        variant: "destructive",
      });
      return;
    }

    addUserMutation.mutate(newUserId.trim());
  };

  const handleBulkAdd = () => {
    if (!bulkUserIds.trim()) return;
    
    const userIds = bulkUserIds
      .split(/[\n,\s]+/)
      .map(id => id.trim())
      .filter(id => id)
      .filter(id => /^\d+$/.test(id));

    if (userIds.length === 0) {
      toast({
        title: "Ошибка",
        description: "Не найдено валидных Telegram ID",
        variant: "destructive",
      });
      return;
    }

    bulkAddMutation.mutate(userIds);
  };

  const handleRemoveUser = (userId: string) => {
    removeUserMutation.mutate(userId);
  };

  const formatUserName = (user: WhitelistUser) => {
    const parts = [user.firstName, user.lastName].filter(Boolean);
    const displayName = parts.length > 0 ? parts.join(" ") : `User ${user.id}`;
    
    if (user.username) {
      return `${displayName} (@${user.username})`;
    }
    
    return displayName;
  };

  // Если не авторизован, показываем форму входа
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Админ-панель</CardTitle>
            <CardDescription>
              Введите пароль для доступа к управлению вайт-листом
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль администратора"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <Button 
              onClick={handleAdminLogin}
              className="w-full"
              disabled={!adminPassword.trim()}
            >
              Войти в админ-панель
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Панель администратора
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Управление доступом к Telegram Mini App
              </p>
            </div>
          </div>
          <Button 
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
            size="sm"
          >
            Выйти
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Авторизованные пользователи</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{Array.isArray(whitelist) ? whitelist.length : 0}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Всего пользователей в вайт-листе
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Уровень безопасности</CardTitle>
              <Shield className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Высокий</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Доступ только по вайт-листу
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Добавление одного пользователя */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Добавить пользователя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Введите Telegram ID (например: 7418405560)"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
              />
              <Button 
                onClick={handleAddUser}
                disabled={addUserMutation.isPending || !newUserId.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Массовое добавление */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Массовое добавление</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Введите несколько Telegram ID через запятую или с новой строки:&#10;7418405560&#10;5173994544&#10;216463929"
              value={bulkUserIds}
              onChange={(e) => setBulkUserIds(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={handleBulkAdd}
              disabled={bulkAddMutation.isPending || !bulkUserIds.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить всех пользователей
            </Button>
          </CardContent>
        </Card>

        {/* Список пользователей */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Вайт-лист пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            ) : !Array.isArray(whitelist) || whitelist.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Нет авторизованных пользователей
              </div>
            ) : (
              <div className="space-y-3">
                {Array.isArray(whitelist) && whitelist.map((user: WhitelistUser) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.firstName?.[0] || user.username?.[0] || user.id[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatUserName(user)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            ID: {user.id}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Добавлен: {new Date(user.addedAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                      disabled={removeUserMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}