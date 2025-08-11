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
  Award,
  Package,
  Handshake,
  Calculator,
  Network,
  Percent,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Share2,
  ExternalLink,
  TreePine
} from "lucide-react";

// Optimized commission structure (50% of revenue allocated to partners)
const partnerLevels = [
  { level: 1, commission: 10, color: "bg-yellow-500", description: "Прямые партнеры", minClients: 1, minQuality: 300 },
  { level: 2, commission: 5, color: "bg-orange-500", description: "2-й уровень", minClients: 3, minQuality: 1000 },
  { level: 3, commission: 3, color: "bg-red-500", description: "3-й уровень", minClients: 5, minQuality: 2500 },
  { level: 4, commission: 2, color: "bg-purple-500", description: "4-й уровень", minClients: 10, minQuality: 5000 },
  { level: 5, commission: 1, color: "bg-blue-500", description: "5-й уровень", minClients: 20, minQuality: 10000 },
  { level: 6, commission: 0.5, color: "bg-indigo-500", description: "6-й уровень (премиум)", minClients: 50, minQuality: 25000, isPremium: true },
  { level: 7, commission: 0.5, color: "bg-gray-500", description: "7-й уровень (ультра)", minClients: 100, minQuality: 50000, isPremium: true }
];

// Network builder tariffs
const builderTariffs = [
  { 
    name: "Партнер", 
    personalBonus: 25, 
    networkBonus: 0,
    levelAccess: 3,
    price: 0,
    color: "from-blue-500 to-blue-600",
    requirements: "Привлечь 1+ клиента"
  },
  { 
    name: "Менеджер", 
    personalBonus: 30, 
    networkBonus: 2,
    levelAccess: 5,
    price: 500,
    color: "from-purple-500 to-purple-600",
    requirements: "5+ личных клиентов"
  },
  { 
    name: "Директор", 
    personalBonus: 35, 
    networkBonus: 3,
    levelAccess: 7,
    price: 2000,
    color: "from-amber-500 to-amber-600",
    requirements: "20+ личных клиентов, 100+ в структуре"
  },
  { 
    name: "Президент", 
    personalBonus: 40, 
    networkBonus: 5,
    levelAccess: 7,
    price: 5000,
    color: "from-rose-500 to-rose-600",
    requirements: "50+ личных клиентов, 500+ в структуре"
  }
];

// Level packages for purchase
const levelPackages = [
  { 
    name: "Базовый", 
    levels: 3, 
    price: 0, 
    savings: 0,
    description: "Доступ к 3 уровням партнерской сети"
  },
  { 
    name: "Расширенный", 
    levels: 5, 
    price: 299, 
    savings: 500,
    description: "Доступ к 5 уровням + бонусы"
  },
  { 
    name: "Премиум", 
    levels: 6, 
    price: 999, 
    savings: 2000,
    description: "Доступ к 6 уровням + VIP поддержка"
  },
  { 
    name: "Ультра", 
    levels: 7, 
    price: 2999, 
    savings: 5000,
    description: "Полный доступ + эксклюзивные возможности"
  }
];

// Calculate total quality score based on clients and their deal sizes
const calculateQualityScore = (totalClients: number, avgDealSize: number): number => {
  return totalClients * avgDealSize;
};

// Base commission rates by deal size (personal sales)
const getBaseCommissionRate = (dealSize: number, tariff: typeof builderTariffs[number]): number => {
  // Base rate adjusted by tariff
  let baseRate = tariff.personalBonus;
  
  // Deal size bonuses
  if (dealSize >= 2000) baseRate += 10;
  else if (dealSize >= 1500) baseRate += 7;
  else if (dealSize >= 1000) baseRate += 5;
  else if (dealSize >= 500) baseRate += 2;
  
  return Math.min(50, baseRate); // Cap at 50%
};

// Order count multiplier (1.0 to 1.25 based on order count)
const getOrderMultiplier = (orderCount: number): number => {
  if (orderCount >= 50) return 1.25; // 25% bonus
  if (orderCount >= 30) return 1.20; // 20% bonus
  if (orderCount >= 20) return 1.15; // 15% bonus
  if (orderCount >= 10) return 1.10; // 10% bonus
  if (orderCount >= 5) return 1.05;  // 5% bonus
  return 1.0; // No bonus
};

// Final commission rate with multiplier
const getFinalCommissionRate = (dealSize: number, orderCount: number, tariff: typeof builderTariffs[number]): number => {
  const baseRate = getBaseCommissionRate(dealSize, tariff);
  const multiplier = getOrderMultiplier(orderCount);
  return Math.min(50, Math.round(baseRate * multiplier)); // Cap at 50%
};

export default function Partners() {
  const [dealSize, setDealSize] = useState([300]);
  const [monthlySubscription, setMonthlySubscription] = useState([15]);
  const [totalClients, setTotalClients] = useState([5]);
  const [activeClients, setActiveClients] = useState([3]);
  const [orderCount, setOrderCount] = useState([1]);
  const [networkSize, setNetworkSize] = useState([10]);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedTariff, setSelectedTariff] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const currentTariff = builderTariffs[selectedTariff];
  const currentPackage = levelPackages[selectedPackage];
  const baseCommission = getBaseCommissionRate(dealSize[0], currentTariff);
  const orderMultiplier = getOrderMultiplier(orderCount[0]);
  const currentCommission = Math.min(50, Math.round(baseCommission * orderMultiplier));
  const monthlyEarnings = activeClients[0] * (monthlySubscription[0] * 0.1);
  const oneTimeEarning = (dealSize[0] * currentCommission) / 100;
  
  // Calculate network earnings
  const networkEarnings = partnerLevels.slice(0, currentPackage.levels).reduce((total, level, index) => {
    const partnersAtLevel = Math.max(0, Math.floor(networkSize[0] * Math.pow(0.5, index)));
    const earningsAtLevel = partnersAtLevel * dealSize[0] * (level.commission / 100);
    return total + earningsAtLevel;
  }, 0);
  
  // Additional network bonus from tariff
  const networkBonus = networkEarnings * (currentTariff.networkBonus / 100);
  
  // Calculate quality score and available levels
  const qualityScore = calculateQualityScore(totalClients[0], dealSize[0]);
  const unlockedLevels = Math.min(
    partnerLevels.filter(level => 
      totalClients[0] >= level.minClients && 
      qualityScore >= level.minQuality &&
      level.level <= currentPackage.levels
    ).length,
    currentPackage.levels
  );

  const referralLink = "https://telegram-miniapps.directory/ref/balilegend123";
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Telegram Mini Apps Directory - Партнерская программа',
        text: 'Присоединяйтесь к партнерской программе и зарабатывайте до 50% с каждого клиента!',
        url: referralLink
      });
    } else {
      copyReferralLink();
    }
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Получайте до 50% от личных продаж и до 22% от структуры партнеров. 
            Мы выделяем 50% выручки на партнерские вознаграждения!
          </p>
          
          {/* Interactive Commission Progression */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg border max-w-2xl w-full">
              <h3 className="text-center font-semibold text-gray-900 mb-4">Интерактивная шкала комиссий</h3>
              
              {/* Dynamic circles showing current values */}
              <div className="flex justify-between items-center text-sm mb-6">
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 300 && dealSize[0] < 500 ? 'bg-red-200 ring-2 ring-red-400 scale-110' : 'bg-red-100'
                  }`}>
                    <span className="text-red-700 font-bold">{Math.round(20 * orderMultiplier)}%</span>
                  </div>
                  <span className="text-gray-600">$300</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 500 && dealSize[0] < 1000 ? 'bg-orange-200 ring-2 ring-orange-400 scale-110' : 'bg-orange-100'
                  }`}>
                    <span className="text-orange-700 font-bold">{Math.round(25 * orderMultiplier)}%</span>
                  </div>
                  <span className="text-gray-600">$500</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 1000 && dealSize[0] < 1500 ? 'bg-yellow-200 ring-2 ring-yellow-400 scale-110' : 'bg-yellow-100'
                  }`}>
                    <span className="text-yellow-700 font-bold">{Math.round(30 * orderMultiplier)}%</span>
                  </div>
                  <span className="text-gray-600">$1K</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 1500 && dealSize[0] < 2000 ? 'bg-blue-200 ring-2 ring-blue-400 scale-110' : 'bg-blue-100'
                  }`}>
                    <span className="text-blue-700 font-bold">{Math.round(35 * orderMultiplier)}%</span>
                  </div>
                  <span className="text-gray-600">$1.5K</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 2000 ? 'bg-green-200 ring-2 ring-green-400 scale-110' : 'bg-green-100'
                  }`}>
                    <span className="text-green-700 font-bold">{Math.round(40 * orderMultiplier)}%</span>
                  </div>
                  <span className="text-gray-600">$2K+</span>
                </div>
              </div>

              {/* Maximum 50% achievement circle */}
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                  currentCommission >= 50 ? 'bg-gradient-to-r from-purple-400 to-pink-400 ring-4 ring-purple-300 shadow-lg animate-pulse' : 'bg-gray-100'
                }`}>
                  <span className={`font-bold text-lg ${currentCommission >= 50 ? 'text-white' : 'text-gray-400'}`}>50%</span>
                </div>
                <div className="text-sm text-gray-600">
                  Максимальная комиссия
                </div>
                {currentCommission >= 50 && (
                  <div className="text-xs text-purple-600 font-medium mt-1">
                    🎉 Достигнута максимальная ставка!
                  </div>
                )}
              </div>

              {/* Current selection indicator */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">Текущая ставка</div>
                <div className="text-xl font-bold text-telegram">
                  {baseCommission}% × {orderMultiplier.toFixed(2)} = {currentCommission}%
                </div>
                <div className="text-xs text-gray-500">
                  Влияние количества ({orderCount[0]} заказ{orderCount[0] > 1 ? 'ов' : ''}) и качества (${dealSize[0]})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tariff Selection */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-telegram" />
              <span>Выберите ваш тариф</span>
            </CardTitle>
            <p className="text-gray-600">
              Инвестируйте в развитие сети и получайте повышенные комиссии
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {builderTariffs.map((tariff, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedTariff(index)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedTariff === index 
                      ? 'border-telegram bg-telegram/5 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selectedTariff === index && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-telegram rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className={`h-2 rounded-full bg-gradient-to-r ${tariff.color} mb-3`}></div>
                  
                  <h3 className="font-bold text-lg mb-2">{tariff.name}</h3>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Личные:</span>
                      <Badge className="bg-green-100 text-green-800">{tariff.personalBonus}%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Сеть:</span>
                      <Badge className="bg-blue-100 text-blue-800">+{tariff.networkBonus}%</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Уровни:</span>
                      <span className="font-medium">{tariff.levelAccess}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    {tariff.price > 0 ? (
                      <div className="text-2xl font-bold text-telegram">${tariff.price}</div>
                    ) : (
                      <div className="text-lg font-bold text-green-600">Бесплатно</div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {tariff.requirements}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Level Packages */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-telegram" />
              <span>Пакеты уровней</span>
            </CardTitle>
            <p className="text-gray-600">
              Разблокируйте больше уровней для увеличения пассивного дохода
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {levelPackages.map((pkg, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedPackage(index)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedPackage === index 
                      ? 'border-telegram bg-telegram/5 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selectedPackage === index && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-telegram rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {pkg.savings > 0 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-red-500 text-white text-xs">
                        Экономия ${pkg.savings}
                      </Badge>
                    </div>
                  )}
                  
                  <h3 className="font-bold text-lg mb-2 mt-2">{pkg.name}</h3>
                  
                  <div className="text-3xl font-bold text-telegram text-center mb-2">
                    {pkg.levels}
                  </div>
                  <div className="text-sm text-gray-600 text-center mb-3">
                    уровн{pkg.levels > 1 ? 'ей' : 'ь'}
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    {pkg.description}
                  </div>
                  
                  <div className="text-center">
                    {pkg.price > 0 ? (
                      <div className="text-2xl font-bold">${pkg.price}</div>
                    ) : (
                      <div className="text-lg font-bold text-green-600">Включено</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Calculator Section */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calculator className="w-5 h-5 text-telegram" />
                <span>Калькулятор доходов</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Deal Size Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Размер сделки</label>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ${dealSize[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={dealSize}
                    onValueChange={setDealSize}
                    max={3000}
                    min={300}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$300</span>
                    <span>$500</span>
                    <span>$1000</span>
                    <span>$1500</span>
                    <span>$2000+</span>
                  </div>
                  <div className="flex justify-between text-xs text-telegram font-medium mt-1">
                    <span>20%</span>
                    <span>25%</span>
                    <span>30%</span>
                    <span>35%</span>
                    <span>40%</span>
                  </div>
                </div>

                {/* Monthly Subscription */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Месячная плата</label>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ${monthlySubscription[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={monthlySubscription}
                    onValueChange={setMonthlySubscription}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$5</span>
                    <span>$50</span>
                  </div>
                </div>

                {/* Total Clients */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Всего клиентов</label>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {totalClients[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={totalClients}
                    onValueChange={setTotalClients}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    Открыто уровней: {unlockedLevels}/5
                  </div>
                </div>

                {/* Active Clients */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Активных клиентов</label>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {activeClients[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={activeClients}
                    onValueChange={setActiveClients}
                    max={totalClients[0]}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    Платят абонентскую плату
                  </div>
                </div>

                {/* Order Count */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Количество заказов</label>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {orderCount[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={orderCount}
                    onValueChange={setOrderCount}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    Мультипликатор: ×{orderMultiplier.toFixed(2)}
                  </div>
                </div>

                {/* Network Size */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Размер сети</label>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {networkSize[0]}
                    </Badge>
                  </div>
                  <Slider
                    value={networkSize}
                    onValueChange={setNetworkSize}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500">
                    Партнеров в структуре
                  </div>
                </div>
              </div>

              <Separator />

              {/* Commission Formula Display */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-center">Формула расчета</h4>
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-700">
                    {baseCommission}% × {orderMultiplier.toFixed(2)} = <span className="font-bold text-indigo-600">{currentCommission}%</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Базовая ставка × Мультипликатор заказов = Итоговая комиссия
                  </div>
                </div>
              </div>

              {/* Comprehensive Earnings Display */}
              <div className="space-y-4">
                {/* Personal Sales */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">💰 Личные продажи</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-green-700">Комиссия ({currentTariff.name})</div>
                      <div className="text-xl font-bold text-green-600">{currentCommission}%</div>
                      <div className="text-xs text-green-600">${oneTimeEarning.toFixed(0)} за сделку</div>
                    </div>
                    <div>
                      <div className="text-sm text-green-700">Месячный доход</div>
                      <div className="text-xl font-bold text-green-600">${(oneTimeEarning * totalClients[0]).toFixed(0)}</div>
                      <div className="text-xs text-green-600">{totalClients[0]} клиентов × ${dealSize[0]}</div>
                    </div>
                  </div>
                </div>

                {/* Network Earnings */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🌐 Доход от сети</h4>
                  <div className="space-y-2">
                    {partnerLevels.slice(0, currentPackage.levels).map((level, index) => {
                      const partnersAtLevel = Math.max(0, Math.floor(networkSize[0] * Math.pow(0.5, index)));
                      const earningsAtLevel = partnersAtLevel * dealSize[0] * (level.commission / 100);
                      
                      return (
                        <div key={level.level} className="flex justify-between items-center text-sm">
                          <span className="text-blue-700">
                            Уровень {level.level} ({partnersAtLevel} партнеров)
                          </span>
                          <Badge className="bg-blue-100 text-blue-800">
                            ${earningsAtLevel.toFixed(0)} ({level.commission}%)
                          </Badge>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-semibold text-blue-900">Всего от сети:</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${(networkEarnings + networkBonus).toFixed(0)}
                      </span>
                    </div>
                    {networkBonus > 0 && (
                      <div className="text-xs text-blue-600">
                        Включая бонус {currentTariff.networkBonus}%: +${networkBonus.toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Earnings */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-purple-900">🎯 Общий потенциал</h4>
                      <div className="text-sm text-purple-700 mt-1">Месячный доход</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">
                        ${(oneTimeEarning * totalClients[0] + networkEarnings + networkBonus + monthlyEarnings).toFixed(0)}
                      </div>
                      <div className="text-sm text-purple-700">
                        в год: ${((oneTimeEarning * totalClients[0] + networkEarnings + networkBonus + monthlyEarnings) * 12).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Link & Benefits */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Share2 className="w-5 h-5 text-telegram" />
                <span>Реферальная ссылка</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Referral Link */}
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border text-sm text-gray-600 break-all">
                  {referralLink}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={copyReferralLink}
                    variant="outline"
                    className="flex-1"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? "Скопировано" : "Копировать"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={shareReferralLink}
                    className="flex-1 bg-telegram hover:bg-telegram-dark"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Поделиться
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Current Tariff Benefits */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Ваш тариф: {currentTariff.name}</h4>
                <div className="p-3 bg-gradient-to-r from-telegram/5 to-telegram/10 rounded-lg border border-telegram/20">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Личные продажи:</span>
                      <Badge className="bg-green-100 text-green-800">{currentTariff.personalBonus}%+</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Бонус от сети:</span>
                      <Badge className="bg-blue-100 text-blue-800">+{currentTariff.networkBonus}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Доступ к уровням:</span>
                      <Badge className="bg-purple-100 text-purple-800">{currentTariff.levelAccess}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Multipliers */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">Мультипликаторы:</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">1-4 заказа:</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">×1.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">5-9 заказов:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">×1.05</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">10-19 заказов:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">×1.10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">20-29 заказов:</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">×1.15</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">30-49 заказов:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">×1.20</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">50+ заказов:</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">×1.25</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Key Benefits */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">10% от подписок навсегда</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">5 уровней структуры</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Выплаты в течение 24ч</span>
                </div>
              </div>

              {/* Quick Start */}
              <div className="bg-telegram/5 p-3 rounded-lg border border-telegram/20">
                <div className="text-center">
                  <Target className="w-8 h-8 text-telegram mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Быстрый старт</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Поделитесь ссылкой и получите первую комиссию
                  </p>
                  <Button size="sm" className="w-full bg-telegram hover:bg-telegram-dark">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Начать зарабатывать
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Partner Structure Tree */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TreePine className="w-6 h-6 text-telegram" />
              <span>Интерактивная структура партнерской сети</span>
            </CardTitle>
            <p className="text-gray-600">
              Многоуровневая система с расширением до {currentPackage.levels} уровн{currentPackage.levels > 1 ? 'ей' : 'я'} глубины
            </p>
          </CardHeader>
          <CardContent>
            {/* Modern Tree Visualization */}
            <div className="mb-8">
              {/* Central hub with you */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-telegram to-telegram-dark rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-telegram/20">
                    ВЫ
                  </div>
                  
                  {/* Animated connection lines */}
                  {unlockedLevels > 0 && (
                    <div className="absolute top-1/2 left-full">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-telegram to-transparent animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic level visualization */}
              <div className="space-y-6">
                {[...Array(Math.min(unlockedLevels, 3))].map((_, levelIndex) => (
                  <div key={levelIndex} className="flex items-center justify-center space-x-4">
                    <div className="text-xs text-gray-500 w-16 text-right">
                      Уровень {levelIndex + 1}
                    </div>
                    
                    {/* Partners at this level */}
                    <div className="flex space-x-2">
                      {[...Array(Math.min(6, Math.max(1, totalClients[0] - levelIndex * 2)))].map((_, partnerIndex) => {
                        const level = partnerLevels[levelIndex];
                        if (!level) return null;
                        
                        return (
                          <div key={partnerIndex} className="relative group">
                            <div className={`w-10 h-10 ${level.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md transition-all duration-300 hover:scale-110 cursor-pointer`}>
                              {partnerIndex + 1}
                            </div>
                            
                            {/* Tooltip on hover */}
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              {level.commission}% комиссия
                            </div>
                            
                            {/* Connection to next level */}
                            {levelIndex < unlockedLevels - 1 && partnerIndex < 3 && (
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                <div className="w-0.5 h-6 bg-gray-300"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Level stats */}
                    <div className="text-xs text-gray-500 w-20">
                      {partnerLevels[levelIndex]?.commission}% бонус
                    </div>
                  </div>
                ))}
                
                {/* Premium levels indicator */}
                {unlockedLevels > 5 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
                        <Crown className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">
                          Премиум уровни {unlockedLevels > 5 ? `6-${unlockedLevels}` : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4 space-x-2">
                      {partnerLevels.slice(5, unlockedLevels).map((level, index) => (
                        <div key={level.level} className="text-center">
                          <div className={`w-8 h-8 ${level.color} rounded-full flex items-center justify-center text-white text-xs font-bold opacity-80`}>
                            {level.level}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{level.commission}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Progress indicator */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Прогресс открытия уровней</span>
                  <span className="text-sm text-gray-500">{unlockedLevels}/{currentPackage.levels}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-telegram to-telegram-dark h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(unlockedLevels / currentPackage.levels) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Следующий уровень: {unlockedLevels < currentPackage.levels ? 
                    `${partnerLevels[unlockedLevels]?.minClients} клиентов, качество ${partnerLevels[unlockedLevels]?.minQuality?.toLocaleString()}` : 
                    'Все уровни открыты!'
                  }
                </div>
              </div>
            </div>

            {/* Interactive Level Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerLevels.slice(0, currentPackage.levels).map((level, index) => {
                const isUnlocked = index < unlockedLevels;
                const isQualityMet = qualityScore >= level.minQuality;
                const isClientsMet = totalClients[0] >= level.minClients;
                const isPremiumLevel = level.isPremium;
                const isPackageAvailable = level.level <= currentPackage.levels;
                
                return (
                  <div key={level.level} className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isUnlocked 
                      ? isPremiumLevel 
                        ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
                        : 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-70'
                  }`}>
                    {/* Premium badge */}
                    {isPremiumLevel && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Премиум
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 ${isUnlocked ? level.color : 'bg-gray-400'} rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                        isUnlocked ? 'shadow-md' : ''
                      }`}>
                        {isUnlocked ? level.level : '🔒'}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          Уровень {level.level}
                        </h3>
                        <p className={`text-xs ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {level.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Комиссия:</span>
                        <Badge className={`text-xs ${isUnlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {level.commission}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Мин. клиентов:</span>
                        <span className={`font-medium ${isClientsMet ? 'text-green-600' : 'text-red-500'}`}>
                          {level.minClients}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Мин. качество:</span>
                        <span className={`font-medium text-xs ${isQualityMet ? 'text-green-600' : 'text-red-500'}`}>
                          {level.minQuality?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Пример дохода:</span>
                        <span className={`font-medium ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`}>
                          ${(dealSize[0] * level.commission / 100).toFixed(0)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress indicators */}
                    {!isUnlocked && (
                      <div className="mt-3 space-y-2">
                        {!isPackageAvailable && (
                          <div className="p-2 bg-purple-50 rounded border border-purple-200">
                            <p className="text-xs text-purple-700">
                              📦 Требуется {isPremiumLevel ? (level.level === 6 ? 'Премиум' : 'Ультра') : 'больший'} пакет
                            </p>
                          </div>
                        )}
                        {!isClientsMet && isPackageAvailable && (
                          <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-xs text-yellow-700">
                              👥 Нужно еще {level.minClients - totalClients[0]} клиент{level.minClients - totalClients[0] > 1 ? 'ов' : ''}
                            </p>
                          </div>
                        )}
                        {!isQualityMet && isPackageAvailable && (
                          <div className="p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs text-blue-700">
                              ⭐ Нужно качество: {(level.minQuality - qualityScore).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Success indicator */}
                    {isUnlocked && (
                      <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                        <p className="text-xs text-green-700 flex items-center">
                          ✅ Уровень активен
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-telegram/5 to-telegram-dark/5 rounded-lg border border-telegram/20">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-telegram">{unlockedLevels}</div>
                  <div className="text-sm text-gray-600">Открыто уровней</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${((unlockedLevels * dealSize[0] * 0.1) + monthlyEarnings).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Потенциал в месяц</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{totalClients[0]}</div>
                  <div className="text-sm text-gray-600">Всего в структуре</div>
                </div>
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