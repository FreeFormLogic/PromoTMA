import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Gift, 
  Star,
  Target,
  Crown,
  Trophy,
  Handshake,
  Calculator,
  Network,
  Percent,
  ChevronDown,
  ChevronRight,
  Copy,
  Check
} from "lucide-react";

const mlmLevels = [
  { level: 1, commission: 50, color: "bg-yellow-500", description: "Прямые рефералы" },
  { level: 2, commission: 25, color: "bg-orange-500", description: "2-й уровень" },
  { level: 3, commission: 15, color: "bg-red-500", description: "3-й уровень" },
  { level: 4, commission: 7, color: "bg-purple-500", description: "4-й уровень" },
  { level: 5, commission: 3, color: "bg-blue-500", description: "5-й уровень" }
];

const monthlySubscriptionPrice = 15; // $15 per month

export default function Partners() {
  const [newClientCommission, setNewClientCommission] = useState([35]);
  const [isFirstClient, setIsFirstClient] = useState(false);
  const [monthlyReferrals, setMonthlyReferrals] = useState([1]);
  const [copied, setCopied] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const currentCommission = isFirstClient ? 50 : newClientCommission[0];
  const monthlyEarnings = monthlyReferrals[0] * (monthlySubscriptionPrice * 0.1);
  const oneTimeEarning = (300 * currentCommission) / 100;

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://telegram-miniapps.directory/ref/YOUR_ID");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-telegram to-telegram-dark rounded-full mb-4">
            <Handshake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Партнерская программа
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Зарабатывайте до 50% с каждого приведенного клиента и 10% от всех абонентских платежей. 
            Многоуровневая система вознаграждений с 5 уровнями глубины.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Calculator Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-telegram" />
                <span>Калькулятор доходов</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* First Client Toggle */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Первый клиент</h3>
                  <p className="text-sm text-gray-600">Гарантированные 50%</p>
                </div>
                <Button
                  variant={isFirstClient ? "default" : "outline"}
                  onClick={() => setIsFirstClient(!isFirstClient)}
                  className={isFirstClient ? "bg-telegram hover:bg-telegram-dark" : ""}
                >
                  {isFirstClient ? "Активно" : "Активировать"}
                </Button>
              </div>

              {/* Commission Slider */}
              {!isFirstClient && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      Комиссия за нового клиента
                    </label>
                    <Badge variant="secondary" className="bg-telegram/10 text-telegram">
                      {newClientCommission[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={newClientCommission}
                    onValueChange={setNewClientCommission}
                    max={50}
                    min={20}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>20%</span>
                    <span>35%</span>
                    <span>50%</span>
                  </div>
                </div>
              )}

              {/* Monthly Referrals */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Рефералов в месяц
                  </label>
                  <Badge variant="secondary">
                    {monthlyReferrals[0]} клиент{monthlyReferrals[0] > 1 ? 'ов' : ''}
                  </Badge>
                </div>
                <Slider
                  value={monthlyReferrals}
                  onValueChange={setMonthlyReferrals}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Earnings Display */}
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-green-700">Разовая выплата</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${oneTimeEarning.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600">
                    {currentCommission}% от $300 за каждого клиента
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-700">Ежемесячный доход</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${monthlyEarnings.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600">
                    10% от абонентских плат ({monthlyReferrals[0]} × $1.5)
                  </p>
                </div>

                <div className="bg-telegram/5 p-4 rounded-lg border border-telegram/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-telegram">Годовой доход</span>
                    <span className="text-3xl font-bold text-telegram">
                      ${(oneTimeEarning + monthlyEarnings * 12).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Benefits */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-6 h-6 text-telegram" />
                <span>Преимущества программы</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Первый клиент — 50%</h3>
                    <p className="text-sm text-gray-600">
                      Гарантированная максимальная комиссия за первого приведенного клиента
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Растущие проценты</h3>
                    <p className="text-sm text-gray-600">
                      От 20% до 50% в зависимости от количества приведенных клиентов
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Percent className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Пассивный доход</h3>
                    <p className="text-sm text-gray-600">
                      10% от всех абонентских платежей ваших рефералов навсегда
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Network className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">MLM-структура</h3>
                    <p className="text-sm text-gray-600">
                      5 уровней партнерской сети с дополнительными бонусами
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Мгновенные выплаты</h3>
                    <p className="text-sm text-gray-600">
                      Автоматические выплаты в течение 24 часов после оплаты клиентом
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Referral Link */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Ваша реферальная ссылка</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-3 bg-gray-50 rounded-lg border text-sm text-gray-600 truncate">
                    https://telegram-miniapps.directory/ref/YOUR_ID
                  </div>
                  <Button
                    size="sm"
                    onClick={copyReferralLink}
                    className="bg-telegram hover:bg-telegram-dark"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MLM Structure */}
        <Card className="bg-white shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="w-6 h-6 text-telegram" />
              <span>MLM-структура партнерской сети</span>
            </CardTitle>
            <p className="text-gray-600">
              Многоуровневая система вознаграждений с комиссиями до 5 уровня глубины
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mlmLevels.map((level, index) => (
                <div key={level.level} className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedLevel(expandedLevel === level.level ? null : level.level)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${level.color} rounded-full flex items-center justify-center text-white font-bold`}>
                          {level.level}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Уровень {level.level}
                          </h3>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-green-100 text-green-800">
                          {level.commission}% комиссия
                        </Badge>
                        {expandedLevel === level.level ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedLevel === level.level && (
                    <div className="px-4 pb-4 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Как это работает</h4>
                          <p className="text-sm text-gray-600">
                            {level.level === 1 && "Вы получаете комиссию с каждого клиента, которого привели лично. Максимальный процент с прямых продаж."}
                            {level.level === 2 && "Комиссия с клиентов, приведенных вашими прямыми рефералами. Создавайте команду активных партнеров."}
                            {level.level === 3 && "Доход с третьего уровня вашей партнерской сети. Развивайте глубокие структуры для стабильного дохода."}
                            {level.level === 4 && "Четвертый уровень MLM-структуры. Пассивный доход от расширения вашей сети."}
                            {level.level === 5 && "Максимальная глубина партнерской программы. Дополнительный доход от больших структур."}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Пример расчета</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Клиент оплачивает:</span>
                              <span className="font-medium">$300</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ваша комиссия ({level.commission}%):</span>
                              <span className="font-medium text-green-600">
                                ${(300 * level.commission / 100).toFixed(0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ежемесячно (10%):</span>
                              <span className="font-medium text-blue-600">$1.5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-telegram/5 to-telegram-dark/5 rounded-lg border border-telegram/20">
              <div className="text-center">
                <Crown className="w-12 h-12 text-telegram mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Потенциальный месячный доход
                </h3>
                <p className="text-gray-600 mb-4">
                  При активной сети из 100 партнеров на всех уровнях
                </p>
                <div className="text-4xl font-bold text-telegram mb-2">
                  $2,450
                </div>
                <p className="text-sm text-gray-500">
                  Включает разовые комиссии и ежемесячные выплаты
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Start */}
        <Card className="bg-gradient-to-r from-telegram to-telegram-dark text-white">
          <CardContent className="py-12">
            <div className="text-center max-w-3xl mx-auto">
              <Trophy className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                Начните зарабатывать уже сегодня
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Присоединяйтесь к партнерской программе и получите первые комиссии в течение недели
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Регистрация</h3>
                  <p className="text-sm opacity-90">
                    Заполните партнерскую заявку и получите персональную ссылку
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Привлечение</h3>
                  <p className="text-sm opacity-90">
                    Делитесь ссылкой в соцсетях, чатах и среди знакомых
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Получение</h3>
                  <p className="text-sm opacity-90">
                    Автоматические выплаты на ваш счет в течение 24 часов
                  </p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-telegram hover:bg-gray-100 font-semibold px-8 py-3"
              >
                Стать партнером
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}