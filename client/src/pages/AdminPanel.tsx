import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Users, Shield, Settings, BarChart3, MessageSquare, Clock, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WhitelistUser {
  id: number;
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  realName?: string;
  addedAt: string;
  isActive: boolean;
  accessHome: boolean;
  accessModules: boolean;
  accessIndustries: boolean;
  accessAiConstructor: boolean;
  accessMyApp: boolean;
  accessAdvantages: boolean;
  accessPartners: boolean;
  referralCode?: string;
  referredBy?: string;
  phone?: string;
}

interface AiChatStats {
  telegramId: string;
  totalSessions: number;
  totalMessages: number;
  totalTokensInput: number;
  totalTokensOutput: number;
  totalCostUsd: string;
  lastSessionAt: string | null;
  firstSessionAt: string;
  username?: string;
  firstName?: string;
  realName?: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [newUserId, setNewUserId] = useState("");
  const [bulkUserIds, setBulkUserIds] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<WhitelistUser>>({});
  const [viewingChats, setViewingChats] = useState<string | null>(null);
  const [userChats, setUserChats] = useState<any[]>([]);
  
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

  // Получение AI статистики
  const { data: aiStats = [], isLoading: isLoadingAiStats } = useQuery({
    queryKey: ["/api/admin/ai-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ai-stats");
      if (!response.ok) throw new Error("Ошибка загрузки статистики AI");
      return response.json();
    },
    enabled: isAuthenticated
  });

  // Добавление пользователя в вайт-лист
  const addUserMutation = useMutation({
    mutationFn: async (telegramId: string) => {
      const response = await fetch("/api/admin/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId }),
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
    mutationFn: async (telegramId: string) => {
      const response = await fetch(`/api/admin/whitelist/${telegramId}`, {
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

  // Обновление пользователя
  const updateUserMutation = useMutation({
    mutationFn: async ({ telegramId, updates }: { telegramId: string, updates: Partial<WhitelistUser> }) => {
      const response = await fetch(`/api/admin/whitelist/${telegramId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Ошибка обновления");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/whitelist"] });
      toast({
        title: "Пользователь обновлен",
        description: "Данные пользователя успешно обновлены",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить пользователя",
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

  const handleRemoveUser = (telegramId: string) => {
    removeUserMutation.mutate(telegramId);
  };

  const handleEditUser = (user: WhitelistUser) => {
    setEditingUser(user.telegramId);
    setEditForm({
      realName: user.realName || '',
      accessHome: user.accessHome,
      accessModules: user.accessModules,
      accessIndustries: user.accessIndustries,
      accessAiConstructor: user.accessAiConstructor,
      accessMyApp: user.accessMyApp,
      accessAdvantages: user.accessAdvantages,
      accessPartners: user.accessPartners,
      isActive: user.isActive
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      await updateUserMutation.mutateAsync({ 
        telegramId: editingUser, 
        updates: editForm 
      });
      
      setEditingUser(null);
      setEditForm({});
      
      toast({
        title: "Успешно",
        description: "Пользователь обновлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить пользователя",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleViewUserChats = async (telegramId: string) => {
    try {
      setUserChats([]); // Clear previous chats
      const response = await fetch(`/api/admin/ai-history/${telegramId}`);
      if (response.ok) {
        const chats = await response.json();
        setUserChats(chats || []);
        setViewingChats(telegramId);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить чаты пользователя",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка при загрузке чатов",
        variant: "destructive",
      });
    }
  };

  const handleCloseChatModal = () => {
    setViewingChats(null);
    setUserChats([]);
  };

  const formatUserName = (user: WhitelistUser) => {
    if (user.realName) {
      return user.realName;
    }
    
    const parts = [user.firstName, user.lastName].filter(Boolean);
    const displayName = parts.length > 0 ? parts.join(" ") : `@${user.telegramId}`;
    
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Нет данных";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const totalTokensUsed = Array.isArray(aiStats) ? aiStats.reduce((sum: number, user: AiChatStats) => sum + (user.totalTokensInput || 0) + (user.totalTokensOutput || 0), 0) : 0;
  const totalCost = Array.isArray(aiStats) ? aiStats.reduce((sum: number, user: AiChatStats) => sum + parseFloat(user.totalCostUsd || "0"), 0) : 0;
  const totalSessions = Array.isArray(aiStats) ? aiStats.reduce((sum: number, user: AiChatStats) => sum + (user.totalSessions || 0), 0) : 0;
  const totalMessages = Array.isArray(aiStats) ? aiStats.reduce((sum: number, user: AiChatStats) => sum + (user.totalMessages || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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
                Управление доступом и мониторинг AI статистики
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

        {/* Основной контент с вкладками */}
        <Tabs defaultValue="whitelist" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whitelist" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Вайт-лист ({whitelist.length})
            </TabsTrigger>
            <TabsTrigger value="ai-stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              AI Статистика
            </TabsTrigger>
          </TabsList>

          {/* Вкладка Вайт-лист */}
          <TabsContent value="whitelist" className="mt-6 space-y-6">
            {/* Статистика вайт-листа */}
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
                          {user.firstName?.[0] || user.username?.[0] || user.telegramId[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatUserName(user)}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            ID: {user.telegramId}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Добавлен: {new Date(user.addedAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.accessHome && <Badge variant="secondary" className="text-xs">Главная</Badge>}
                          {user.accessModules && <Badge variant="secondary" className="text-xs">Модули</Badge>}
                          {user.accessIndustries && <Badge variant="secondary" className="text-xs">Отрасли</Badge>}
                          {user.accessAiConstructor && <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">AI-конструктор</Badge>}
                          {user.accessMyApp && <Badge variant="secondary" className="text-xs">Мое приложение</Badge>}
                          {user.accessAdvantages && <Badge variant="secondary" className="text-xs">Преимущества</Badge>}
                          {user.accessPartners && <Badge variant="secondary" className="text-xs">Партнерам</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveUser(user.telegramId)}
                        disabled={removeUserMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Форма редактирования (отображается инлайн при editingUser === user.telegramId) */}
                    {editingUser === user.telegramId && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <h3 className="text-lg font-semibold mb-4">Редактирование пользователя</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Настоящее имя</label>
                              <Input
                                value={editForm.realName || ''}
                                onChange={(e) => setEditForm({...editForm, realName: e.target.value})}
                                placeholder="Введите настоящее имя"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Доступ к разделам</label>
                              <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessHome || false}
                                    onChange={(e) => setEditForm({...editForm, accessHome: e.target.checked})}
                                  />
                                  <span className="text-sm">Главная</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessModules || false}
                                    onChange={(e) => setEditForm({...editForm, accessModules: e.target.checked})}
                                  />
                                  <span className="text-sm">Модули</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessIndustries || false}
                                    onChange={(e) => setEditForm({...editForm, accessIndustries: e.target.checked})}
                                  />
                                  <span className="text-sm">Отрасли</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessAiConstructor || false}
                                    onChange={(e) => setEditForm({...editForm, accessAiConstructor: e.target.checked})}
                                  />
                                  <span className="text-sm">AI-конструктор</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessMyApp || false}
                                    onChange={(e) => setEditForm({...editForm, accessMyApp: e.target.checked})}
                                  />
                                  <span className="text-sm">Мое приложение</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessAdvantages || false}
                                    onChange={(e) => setEditForm({...editForm, accessAdvantages: e.target.checked})}
                                  />
                                  <span className="text-sm">Преимущества</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.accessPartners || false}
                                    onChange={(e) => setEditForm({...editForm, accessPartners: e.target.checked})}
                                  />
                                  <span className="text-sm">Партнерам</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editForm.isActive || false}
                                    onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                                  />
                                  <span className="text-sm">Активен</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button onClick={handleSaveUser} disabled={updateUserMutation.isPending}>
                              Сохранить
                            </Button>
                            <Button variant="outline" onClick={handleCancelEdit}>
                              Отмена
                            </Button>
                          </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

          {/* Вкладка AI Статистика */}
          <TabsContent value="ai-stats" className="mt-6 space-y-6">
            {/* Общая статистика AI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего токенов</CardTitle>
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTokensUsed?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">Использовано</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Общие расходы</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalCost?.toFixed(4) || '0.0000'}</div>
                  <p className="text-xs text-muted-foreground">На AI запросы</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Сессии</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSessions}</div>
                  <p className="text-xs text-muted-foreground">Всего сессий</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Сообщения</CardTitle>
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalMessages}</div>
                  <p className="text-xs text-muted-foreground">Всего сообщений</p>
                </CardContent>
              </Card>
            </div>

            {/* Детальная статистика по пользователям */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика AI чата по пользователям</CardTitle>
                <CardDescription>
                  Подробная статистика использования AI каждым пользователем
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAiStats ? (
                  <div className="text-center py-8">Загрузка статистики...</div>
                ) : aiStats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет данных о использовании AI чата
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Пользователь</th>
                            <th className="text-left p-2">Сессий</th>
                            <th className="text-left p-2">Сообщений</th>
                            <th className="text-left p-2">Токенов</th>
                            <th className="text-left p-2">Расходы</th>
                            <th className="text-left p-2">Последняя активность</th>
                            <th className="text-left p-2">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {aiStats.map((userStat: AiChatStats) => (
                            <tr key={userStat.telegramId} className="border-b hover:bg-muted/50">
                              <td className="p-2">
                                <div>
                                  <div className="font-medium">
                                    {userStat.realName || userStat.firstName || userStat.username || `@${userStat.telegramId}`}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    ID: {userStat.telegramId}
                                  </div>
                                </div>
                              </td>
                              <td className="p-2">
                                <Badge variant="secondary">
                                  {userStat.totalSessions}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <Badge variant="outline">
                                  {userStat.totalMessages}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <span className="font-mono text-blue-600">
                                  {(userStat.totalTokensInput + userStat.totalTokensOutput).toLocaleString()}
                                </span>
                              </td>
                              <td className="p-2">
                                <span className="font-mono text-green-600">
                                  ${parseFloat(userStat.totalCostUsd).toFixed(4)}
                                </span>
                              </td>
                              <td className="p-2 text-xs text-muted-foreground">
                                {formatDate(userStat.lastSessionAt)}
                              </td>
                              <td className="p-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewUserChats(userStat.telegramId)}
                                  className="text-xs"
                                >
                                  Просмотр чатов
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальное окно для просмотра чатов пользователя */}
      {viewingChats && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseChatModal();
            }
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Чаты пользователя {viewingChats}</h2>
              <Button 
                variant="outline" 
                onClick={handleCloseChatModal}
              >
                Закрыть
              </Button>
            </div>
            
            {userChats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Нет сообщений в чате
              </div>
            ) : (
              <div className="space-y-4">
                {userChats.map((message: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' 
                      : 'bg-gray-50 dark:bg-gray-800 mr-8'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                        {message.role === 'user' ? 'Пользователь' : 'AI'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    {message.tokensInput && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Токенов: {message.tokensInput + message.tokensOutput} | 
                        Стоимость: ${parseFloat(message.cost || '0').toFixed(6)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}