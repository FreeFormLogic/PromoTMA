import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AuthGuard } from "@/components/AuthGuard";
import { 
  Share2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Gift,
  Copy,
  CheckCircle,
  UserPlus,
  ArrowRight
} from "lucide-react";

interface ReferralInfo {
  referralCode: string;
  referrals: ReferralRegistration[];
}

interface ReferralRegistration {
  id: string;
  referralCode: string;
  referrerTelegramId: string;
  newUserName: string;
  newUserPhone: string;
  registeredAt: string;
  isActive: boolean;
}

interface RegisterData {
  referralCode: string;
  newUserName: string;
  newUserPhone: string;
}

interface User {
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export default function Partners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Проверяем авторизацию
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("promobotUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState<RegisterData>({
    referralCode: '',
    newUserName: '',
    newUserPhone: ''
  });

  const { data: referralInfo, isLoading: isReferralLoading } = useQuery<ReferralInfo>({
    queryKey: [`/api/referrals/${user?.telegramId}`],
    enabled: !!user?.telegramId,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch('/api/referrals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Регистрация успешна!",
        description: "Новый пользователь зарегистрирован по вашей реферальной ссылке",
      });
      setRegisterData({ referralCode: '', newUserName: '', newUserPhone: '' });
      queryClient.invalidateQueries({ queryKey: [`/api/referrals/${user?.telegramId}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(type);
      toast({
        title: "Скопировано!",
        description: `${type} скопирован в буфер обмена`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Проверяем доступ...</p>
        </div>
      </div>
    );
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Необходима авторизация для доступа к партнерской программе</p>
        </div>
      </div>
    );
  }

  const referralLink = referralInfo?.referralCode 
    ? `https://t.me/PromotmaBot?start=ref_${referralInfo.referralCode}`
    : '';

  const totalReferrals = referralInfo?.referrals?.length || 0;
  const activeReferrals = referralInfo?.referrals?.filter(r => r.isActive)?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Share2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Партнерская программа
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Приглашайте новых пользователей и получайте вознаграждение за каждого активного реферала
            </p>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Всего рефералов</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalReferrals}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Зарегистрированных пользователей
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Активные рефералы</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeReferrals}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Пользователей с доступом
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Потенциальный доход</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">${activeReferrals * 50}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                $50 за каждого активного реферала
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Реферальная ссылка */}
        {referralInfo && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-blue-600" />
                Ваша реферальная ссылка
              </CardTitle>
              <CardDescription>
                Делитесь этой ссылкой с потенциальными клиентами для получения комиссии
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="font-mono text-sm"
                  placeholder="Загрузка реферальной ссылки..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralLink, 'Реферальная ссылка')}
                  className="shrink-0"
                >
                  {copiedCode === 'Реферальная ссылка' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={referralInfo.referralCode}
                  readOnly
                  className="font-mono text-sm"
                  placeholder="Загрузка кода..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralInfo.referralCode, 'Реферальный код')}
                  className="shrink-0"
                >
                  {copiedCode === 'Реферальный код' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Регистрация нового пользователя */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Зарегистрировать нового пользователя
            </CardTitle>
            <CardDescription>
              Введите данные клиента для регистрации по вашей реферальной программе
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referralCode">Реферальный код</Label>
                <Input
                  id="referralCode"
                  value={registerData.referralCode || referralInfo?.referralCode || ''}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, referralCode: e.target.value }))}
                  placeholder="Введите реферальный код"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUserName">Имя клиента</Label>
                <Input
                  id="newUserName"
                  value={registerData.newUserName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, newUserName: e.target.value }))}
                  placeholder="Имя и фамилия"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUserPhone">Телефон клиента</Label>
                <Input
                  id="newUserPhone"
                  type="tel"
                  value={registerData.newUserPhone}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, newUserPhone: e.target.value }))}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>
            <Button
              onClick={() => registerMutation.mutate(registerData)}
              disabled={registerMutation.isPending || !registerData.referralCode || !registerData.newUserName || !registerData.newUserPhone}
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Зарегистрировать клиента
            </Button>
          </CardContent>
        </Card>

        {/* Список рефералов */}
        {referralInfo && referralInfo.referrals && referralInfo.referrals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Ваши рефералы ({referralInfo.referrals.length})
              </CardTitle>
              <CardDescription>
                История регистраций по вашей реферальной программе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referralInfo.referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {referral.newUserName[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{referral.newUserName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {referral.newUserPhone}
                        </div>
                        <div className="text-xs text-gray-400">
                          Зарегистрирован: {new Date(referral.registeredAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={referral.isActive ? "default" : "secondary"}
                        className={referral.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {referral.isActive ? 'Активен' : 'Неактивен'}
                      </Badge>
                      {referral.isActive && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          +$50
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Информация о программе */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Gift className="w-5 h-5" />
              Условия партнерской программы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-yellow-700 dark:text-yellow-300">
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
              <span>$50 комиссии за каждого активного реферала</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Выплата после подтверждения использования платформы клиентом</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Автоматическое предоставление доступа к базовым функциям</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Статистика и отчеты в реальном времени</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}