import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Handshake, 
  Calculator, 
  Settings, 
  HelpCircle, 
  X, 
  Award, 
  Users,
  TreePine,
  Clock,
  Calendar,
  Check,
  Copy,
  Share2,
  Star,
  TrendingUp,
  UserPlus,
  DollarSign
} from 'lucide-react';

export default function Partners() {
  // Core state
  const [dealSize, setDealSize] = useState([800]);
  const [monthlySubscription, setMonthlySubscription] = useState([50]);
  const [totalClients, setTotalClients] = useState([5]);
  const [personalRecruits, setPersonalRecruits] = useState([2]);
  const [packageSales, setPackageSales] = useState([3]);
  const [avgPackagePrice, setAvgPackagePrice] = useState([1000]);
  
  // Business logic arrays
  const builderTariffs = [
    { name: 'Партнер', personalBonus: 25, networkBonus: 0, levelAccess: 3, price: 0, color: 'from-gray-300 to-gray-400' },
    { name: 'Менеджер', personalBonus: 30, networkBonus: 2, levelAccess: 5, price: 500, color: 'from-blue-400 to-blue-500' },
    { name: 'Директор', personalBonus: 35, networkBonus: 3, levelAccess: 7, price: 2000, color: 'from-purple-400 to-purple-500' },
    { name: 'Президент', personalBonus: 40, networkBonus: 5, levelAccess: 7, price: 5000, color: 'from-yellow-400 to-yellow-500' },
  ];

  const partnerLevels = [
    { level: 1, commission: 10, minClients: 1, minQuality: 300, title: 'Прямые партнеры' },
    { level: 2, commission: 5, minClients: 3, minQuality: 1000, title: '2-й уровень' },
    { level: 3, commission: 3, minClients: 5, minQuality: 2500, title: '3-й уровень' },
    { level: 4, commission: 2, minClients: 10, minQuality: 5000, title: '4-й уровень' },
    { level: 5, commission: 1, minClients: 20, minQuality: 10000, title: '5-й уровень' },
  ];

  // Partner data for network visualization
  const partnerData = {
    level1: [
      {
        id: 1,
        name: 'Александра Иванова',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a5e089?w=150&h=150&fit=crop&crop=face',
        role: 'Менеджер по развитию',
        personalSales: 12000,
        teamSales: 45000,
        commission: 3200,
        recruits: 5,
        level: 1,
        status: 'active',
        city: 'Москва',
        achievements: ['Лидер месяца', 'Топ-рекрутер']
      },
      {
        id: 2,
        name: 'Михаил Петров',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'Специалист по продажам',
        personalSales: 8500,
        teamSales: 28000,
        commission: 2100,
        recruits: 3,
        level: 1,
        status: 'active',
        city: 'СПб',
        achievements: ['Новичок месяца']
      },
      {
        id: 3,
        name: 'Елена Козлова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'Консультант',
        personalSales: 5200,
        teamSales: 15000,
        commission: 1400,
        recruits: 2,
        level: 1,
        status: 'learning',
        city: 'Екатеринбург',
        achievements: ['Перспективный']
      }
    ],
    level2: [
      {
        id: 4,
        name: 'Дмитрий Сидоров',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        commission: 850,
        recruits: 1,
        status: 'active'
      },
      {
        id: 5,
        name: 'Анна Морозова',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        commission: 630,
        recruits: 0,
        status: 'learning'
      }
    ],
    level3: [
      {
        id: 6,
        name: 'Игорь Волков',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        commission: 420,
        recruits: 0,
        status: 'learning'
      }
    ]
  };

  // UI state
  const [selectedTariff, setSelectedTariff] = useState(0);
  const [showMlmFeatures, setShowMlmFeatures] = useState(false);
  const [showHelpFor, setShowHelpFor] = useState<string | null>(null);
  const [showDetailedNetwork, setShowDetailedNetwork] = useState(false);

  // Calculations
  const getBaseCommissionRate = (dealSize: number, tariff: any) => {
    let baseRate = 20;
    if (dealSize >= 500) baseRate = 25;
    if (dealSize >= 1000) baseRate = 30;
    if (dealSize >= 1500) baseRate = 35;
    if (dealSize >= 2000) baseRate = 40;
    return baseRate + tariff.personalBonus;
  };

  const calculateQualityScore = (clients: number, avgDeal: number) => {
    return clients * 50 + avgDeal;
  };

  const currentTariff = builderTariffs[selectedTariff];
  const baseCommission = getBaseCommissionRate(dealSize[0], currentTariff);
  const currentCommission = Math.min(50, Math.round(baseCommission));
  const oneTimeEarning = (dealSize[0] * currentCommission) / 100;
  const qualityScore = calculateQualityScore(totalClients[0], dealSize[0]);
  const unlockedLevels = Math.min(
    partnerLevels.filter(level => 
      totalClients[0] >= level.minClients && 
      qualityScore >= level.minQuality
    ).length,
    currentTariff.levelAccess
  );

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
          
          {/* MLM Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Показать сетевые функции</span>
              <button
                onClick={() => setShowMlmFeatures(!showMlmFeatures)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showMlmFeatures ? 'bg-telegram' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showMlmFeatures ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <button
                onClick={() => setShowHelpFor(showHelpFor === 'mlm-toggle' ? null : 'mlm-toggle')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          {showHelpFor === 'mlm-toggle' && (
            <div className="max-w-lg mx-auto mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <button
                onClick={() => setShowHelpFor(null)}
                className="float-right p-1 hover:bg-blue-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
              <p><strong>Режимы работы:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><strong>Только личные продажи:</strong> Классическая партнерская программа без MLM</li>
                <li><strong>С сетевыми функциями:</strong> Многоуровневый маркетинг с доходом от структуры</li>
              </ul>
            </div>
          )}
          
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
                    <span className="text-red-700 font-bold">20%</span>
                  </div>
                  <span className="text-gray-600">$300</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 500 && dealSize[0] < 1000 ? 'bg-orange-200 ring-2 ring-orange-400 scale-110' : 'bg-orange-100'
                  }`}>
                    <span className="text-orange-700 font-bold">25%</span>
                  </div>
                  <span className="text-gray-600">$500</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 1000 && dealSize[0] < 1500 ? 'bg-yellow-200 ring-2 ring-yellow-400 scale-110' : 'bg-yellow-100'
                  }`}>
                    <span className="text-yellow-700 font-bold">30%</span>
                  </div>
                  <span className="text-gray-600">$1K</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 1500 && dealSize[0] < 2000 ? 'bg-blue-200 ring-2 ring-blue-400 scale-110' : 'bg-blue-100'
                  }`}>
                    <span className="text-blue-700 font-bold">35%</span>
                  </div>
                  <span className="text-gray-600">$1.5K</span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-orange-300 via-yellow-300 via-blue-300 to-green-300 mx-2 rounded-full"></div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    dealSize[0] >= 2000 ? 'bg-green-200 ring-2 ring-green-400 scale-110' : 'bg-green-100'
                  }`}>
                    <span className="text-green-700 font-bold">40%</span>
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
                  {baseCommission}% = {currentCommission}%
                </div>
                <div className="text-xs text-gray-500">
                  Комиссия с размера сделки ${dealSize[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Sales Calculator */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calculator className="w-5 h-5 text-telegram" />
              <span>Калькулятор доходов от личных продаж</span>
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
                  max={2000}
                  min={300}
                  step={100}
                  className="w-full"
                />
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
              </div>
            </div>

            {/* Results Summary */}
            <div className="bg-gradient-to-r from-telegram/5 to-telegram/10 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-telegram">${oneTimeEarning.toFixed(0)}</div>
                  <div className="text-xs text-gray-600">Доход с продажи</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">${(totalClients[0] * monthlySubscription[0] * 0.1).toFixed(0)}</div>
                  <div className="text-xs text-gray-600">Доход в месяц</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{totalClients[0]}</div>
                  <div className="text-xs text-gray-600">Всего клиентов</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Functions Section */}
        {showMlmFeatures && (
          <div className="mb-16">
            <div className="text-center mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 mx-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <Users className="w-7 h-7 mr-3 text-purple-600" />
                Сетевые функции и партнерская структура
              </h2>
              <p className="text-lg text-gray-600">Многоуровневый доход от вашей партнерской команды</p>
            </div>

            {/* Tariffs and Packages */}
            <Card className="bg-white shadow-lg mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Award className="w-5 h-5 text-telegram" />
                  <span>Тарифы и пакеты ускорения</span>
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Выберите тариф для увеличения комиссий, затем пакет для ускоренного открытия уровней
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Тарифы</h3>
                  <div className="grid md:grid-cols-4 gap-3">
                    {builderTariffs.map((tariff, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedTariff(index)}
                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedTariff === index 
                            ? 'border-telegram bg-telegram/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {selectedTariff === index && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-4 h-4 bg-telegram rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className={`h-1 rounded-full bg-gradient-to-r ${tariff.color} mb-2`}></div>
                        <h4 className="font-bold text-sm mb-2">{tariff.name}</h4>
                        
                        <div className="space-y-1 mb-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Личные:</span>
                            <span className="font-semibold text-green-600">{tariff.personalBonus}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Сеть:</span>
                            <span className="font-semibold text-blue-600">+{tariff.networkBonus}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Уровни:</span>
                            <span className="font-medium">{tariff.levelAccess}</span>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                          {tariff.price > 0 ? (
                            <div className="text-lg font-bold text-telegram">${tariff.price}</div>
                          ) : (
                            <div className="text-sm font-bold text-green-600">Бесплатно</div>
                          )}
                          <button className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                            tariff.price > 0 
                              ? 'bg-telegram text-white hover:bg-telegram/90' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}>
                            {tariff.price > 0 ? 'Купить' : 'Активен'}
                          </button>
                        </div>

                        {/* Level details for selected tariff */}
                        {selectedTariff === index && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">Доступные уровни:</h5>
                            <div className="space-y-2">
                              {partnerLevels.slice(0, tariff.levelAccess).map((level, levelIndex) => (
                                <div key={levelIndex} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold">{level.level}</span>
                                    </div>
                                    <span className="text-gray-600">Уровень {level.level}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium text-telegram">{level.commission}%</div>
                                    <div className="text-gray-500">≥{level.minClients} клиент{level.minClients > 1 ? 'ов' : ''}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-50">
                              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div>
                                  <div className="font-bold text-gray-900">{unlockedLevels}</div>
                                  <div className="text-gray-500">Открыто уровней</div>
                                </div>
                                <div>
                                  <div className="font-bold text-green-600">$725</div>
                                  <div className="text-gray-500">Потенциал в месяц</div>
                                </div>
                                <div>
                                  <div className="font-bold text-purple-600">
                                    {partnerData.level1.length + partnerData.level2.length + partnerData.level3.length}
                                  </div>
                                  <div className="text-gray-500">Всего в структуре</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Structure Visualization */}
            <Card className="bg-white shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TreePine className="w-6 h-6 text-telegram" />
                  <span>Интерактивная структура партнерской сети</span>
                </CardTitle>
                <p className="text-gray-600">
                  Многоуровневая система с расширением до {currentTariff.levelAccess} уровней глубины
                </p>
              </CardHeader>
              <CardContent>
                {/* Central hub with you */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-telegram to-telegram-dark rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-telegram/20">
                      ВЫ
                    </div>
                    {unlockedLevels > 0 && (
                      <div className="absolute top-1/2 left-full">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-telegram to-transparent animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic level visualization - more branched */}
                <div className="space-y-8">
                  {[...Array(Math.min(unlockedLevels, 3))].map((_, levelIndex) => (
                    <div key={levelIndex} className="flex items-center justify-center">
                      <div className="text-xs text-gray-500 w-20 text-right mr-4">
                        Уровень {levelIndex + 1}
                      </div>
                      
                      {/* More partners per level for branched structure */}
                      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                        {(partnerData[`level${levelIndex + 1}` as keyof typeof partnerData] || []).map((partner, partnerIndex) => {
                          if (partnerIndex >= 8) return null; // Show up to 8 partners per level
                          
                          return (
                            <div key={partner.id} className="relative group">
                              <button className="relative w-14 h-14 rounded-full overflow-hidden shadow-md transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-white hover:border-telegram">
                                <img 
                                  src={partner.avatar} 
                                  alt={partner.name}
                                  className="w-full h-full object-cover"
                                />
                                {/* Status indicator */}
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                  partner.status === 'active' ? 'bg-green-400' : 
                                  partner.status === 'learning' ? 'bg-yellow-400' : 'bg-gray-400'
                                }`}></div>
                              </button>
                              
                              {/* Tooltip */}
                              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                <div className="text-center">
                                  <div className="font-semibold">{partner.name.split(' ')[0]}</div>
                                  <div>${partner.commission?.toLocaleString() || '0'}/мес</div>
                                </div>
                              </div>
                              
                              {/* Connection lines to next level */}
                              {levelIndex < unlockedLevels - 1 && partnerIndex < 4 && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                  <div className="w-0.5 h-8 bg-gray-300"></div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Empty slots */}
                        {Array.from({length: Math.max(0, Math.min(6, 8 - (partnerData[`level${levelIndex + 1}` as keyof typeof partnerData] || []).length))}, (_, i) => (
                          <div key={`empty-${i}`} className="relative group">
                            <div className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">
                              +
                            </div>
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              Свободное место
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Locked levels preview */}
                {unlockedLevels < partnerLevels.length && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-gray-500 text-sm mb-2">
                      Заблокированные уровни
                    </div>
                    <div className="flex justify-center space-x-2">
                      {partnerLevels.slice(unlockedLevels).map((level, index) => (
                        <div key={level.level} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                          {level.level}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Привлеките больше клиентов для разблокировки
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-telegram to-telegram-dark text-white mb-8">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Готовы начать зарабатывать?</h2>
            <p className="text-lg mb-8 opacity-90">
              Присоединяйтесь к нашей партнерской программе уже сегодня
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}