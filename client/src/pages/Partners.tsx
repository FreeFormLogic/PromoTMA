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
  TreePine,
  Settings,
  HelpCircle,
  X,
  User,
  Flame,
  Rocket,
  Heart,
  MessageCircle,
  Download,
  Play,
  GamepadIcon as Gamepad,
  Coins,
  Timer,
  Zap,
  Calendar,
  Clock
} from "lucide-react";

// Generate mock partner data with Telegram-style usernames
const generatePartnerName = (level: number, index: number): string => {
  const firstNames = ['Alex', 'Maria', 'Ivan', 'Anna', 'Pavel', 'Kate', 'Dmitry', 'Lisa', 'Max', 'Sofia'];
  const lastNames = ['Kozlov', 'Petrov', 'Ivanov', 'Sidorov', 'Fedorov', 'Morozov', 'Volkov', 'Alexeev'];
  const first = firstNames[index % firstNames.length];
  const last = lastNames[(index + level) % lastNames.length];
  return `${first} ${last}`;
};

const generateTelegramUsername = (name: string): string => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  const numbers = Math.floor(Math.random() * 999) + 1;
  return `@${cleanName}${numbers}`;
};

// Detailed Network View Component
const DetailedNetworkView = ({ levels, personalRecruits, currentUser }: {
  levels: any[];
  personalRecruits: number;
  currentUser: string;
}) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const partnersAtLevel = Math.max(0, Math.floor(personalRecruits * Math.pow(0.6, selectedLevel - 1)));
  
  const partners = Array.from({ length: Math.min(partnersAtLevel, 20) }, (_, index) => {
    const name = generatePartnerName(selectedLevel, index);
    return {
      id: `${selectedLevel}-${index}`,
      name,
      username: generateTelegramUsername(name),
      level: selectedLevel,
      commission: levels[selectedLevel - 1]?.commission || 0,
      earnings: Math.floor(Math.random() * 500) + 100,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
      isOnline: Math.random() > 0.3,
      avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0088cc&color=fff&size=64`
    };
  });

  return (
    <div className="space-y-6">
      {/* Level Navigation */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
        {levels.map((level, index) => {
          const count = Math.max(0, Math.floor(personalRecruits * Math.pow(0.6, index)));
          return (
            <button
              key={level.level}
              onClick={() => setSelectedLevel(level.level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLevel === level.level
                  ? 'bg-telegram text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Уровень {level.level}
              <span className="ml-2 px-2 py-1 bg-white/20 rounded text-xs">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Level Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Уровень {selectedLevel} - Комиссия {levels[selectedLevel - 1]?.commission}%
        </h3>
        <p className="text-gray-600">
          Партнеров на уровне: {partnersAtLevel} • 
          Потенциальный доход: ${(partnersAtLevel * 100).toFixed(0)}/мес
        </p>
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => setSelectedPartner(partner)}
            className="bg-white border rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-12 h-12 rounded-full"
                />
                {partner.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {partner.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {partner.username}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Доход:</span>
                <span className="font-medium text-green-600">${partner.earnings}/мес</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Присоединился:</span>
                <span className="text-gray-700">{partner.joinDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {partnersAtLevel === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>На этом уровне пока нет партнеров</p>
          <p className="text-sm">Привлекайте больше людей для открытия новых уровней</p>
        </div>
      )}

      {/* Enhanced Partner Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedPartner.avatar}
                  alt={selectedPartner.name}
                  className="w-16 h-16 rounded-full border-2 border-telegram"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    {selectedPartner.name}
                    {selectedPartner.earnings > 1000 && <Crown className="w-5 h-5 ml-2 text-yellow-500" />}
                  </h3>
                  <p className="text-blue-600 font-medium">{selectedPartner.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-telegram text-white text-xs">
                      Уровень {selectedPartner.level}
                    </Badge>
                    {selectedPartner.isOnline && (
                      <Badge className="bg-green-500 text-white text-xs animate-pulse">
                        Онлайн
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Statistics Grid */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-600">${selectedPartner.earnings}</div>
                  <div className="text-sm text-gray-600">Месячный доход</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(selectedPartner.earnings / 50)}</div>
                  <div className="text-sm text-gray-600">Команда</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <Trophy className="w-8 h-8 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{selectedPartner.commission}%</div>
                  <div className="text-sm text-gray-600">Комиссия</div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                  <Star className="w-8 h-8 text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{Math.floor(selectedPartner.earnings / 100)}</div>
                  <div className="text-sm text-gray-600">Рейтинг</div>
                </div>
              </div>
              
              {/* Partner's Network Structure */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-bold mb-4 flex items-center">
                  <TreePine className="w-5 h-5 mr-2 text-telegram" />
                  Структура партнера {selectedPartner.name}
                </h4>
                
                {/* Mini Network Visualization */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-telegram text-white p-3 rounded-lg text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium">{selectedPartner.name}</div>
                      <div className="text-xs opacity-90">${selectedPartner.earnings}/мес</div>
                    </div>
                  </div>
                  
                  {/* Level 1 partners */}
                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                    {Array.from({ length: 3 }, (_, i) => {
                      const partnerName = generatePartnerName(1, i + 10);
                      const earnings = Math.floor(Math.random() * 300) + 100;
                      return (
                        <div key={i} className="bg-white border p-2 rounded text-center">
                          <img
                            src={`https://ui-avatars.com/api/?name=${partnerName.replace(' ', '+')}&background=0088cc&color=fff&size=32`}
                            alt={partnerName}
                            className="w-8 h-8 rounded-full mx-auto mb-1"
                          />
                          <div className="text-xs font-medium">{partnerName.split(' ')[0]}</div>
                          <div className="text-xs text-green-600">${earnings}</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    И еще {Math.floor(selectedPartner.earnings / 50) - 3} партнеров в структуре
                  </div>
                </div>
              </div>
              
              {/* Achievements & Badges */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                <h4 className="text-lg font-bold mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  Достижения
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPartner.earnings > 500 && (
                    <Badge className="bg-yellow-500 text-black">🥇 Топ-исполнитель</Badge>
                  )}
                  {selectedPartner.earnings > 1000 && (
                    <Badge className="bg-purple-500 text-white">👑 Элитный партнер</Badge>
                  )}
                  {selectedPartner.isOnline && (
                    <Badge className="bg-green-500 text-white">⚡ Активный</Badge>
                  )}
                  <Badge className="bg-blue-500 text-white">📈 Растущий</Badge>
                  <Badge className="bg-orange-500 text-white">🎯 Целеустремленный</Badge>
                </div>
              </div>
              
              {/* Contact & Actions */}
              <div className="flex space-x-3">
                <Button className="flex-1 bg-telegram hover:bg-telegram-dark">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Написать в Telegram
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Посмотреть команду
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
    maxEarnings: 1500,
    description: "Доступ к 3 уровням партнерской сети"
  },
  { 
    name: "Расширенный", 
    levels: 5, 
    price: 299, 
    maxEarnings: 5000,
    description: "Доступ к 5 уровням + бонусы"
  },
  { 
    name: "Премиум", 
    levels: 6, 
    price: 999, 
    maxEarnings: 15000,
    description: "Доступ к 6 уровням + VIP поддержка"
  },
  { 
    name: "Ультра", 
    levels: 7, 
    price: 2999, 
    maxEarnings: 50000,
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

// Simplified commission calculation for personal sales
const getFinalCommissionRate = (dealSize: number, tariff: typeof builderTariffs[number]): number => {
  return getBaseCommissionRate(dealSize, tariff);
};

export default function Partners() {
  const [dealSize, setDealSize] = useState([1600]);
  const [monthlySubscription, setMonthlySubscription] = useState([49]);
  const [totalClients, setTotalClients] = useState([5]);
  const [personalRecruits, setPersonalRecruits] = useState([3]); // For network calculations
  
  // Network characteristics
  const [networkPartners, setNetworkPartners] = useState([15]);
  const [networkTurnover, setNetworkTurnover] = useState([25000]);
  const [avgDealSize, setAvgDealSize] = useState([800]);
  const [totalDeals, setTotalDeals] = useState([30]);
  const [openLevels, setOpenLevels] = useState([3]);

  // Partner data with realistic profiles
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const partnerData = {
    level1: [
      {
        id: 1,
        name: 'Александра Иванова',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a1f4ba?w=150&h=150&fit=crop&crop=face',
        role: 'Менеджер по развитию',
        joinDate: '2024-01-15',
        personalSales: 12000,
        teamSales: 45000,
        commission: 3200,
        recruits: 5,
        level: 1,
        status: 'active',
        city: 'Москва',
        phone: '+7 (XXX) XXX-XX-XX',
        telegram: '@alex_ivanova',
        achievements: ['Лидер месяца', 'Топ-рекрутер'],
        lastActivity: '2 часа назад'
      },
      {
        id: 2,
        name: 'Дмитрий Петров',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'Региональный партнер',
        joinDate: '2023-11-20',
        personalSales: 18500,
        teamSales: 67000,
        commission: 4800,
        recruits: 8,
        level: 1,
        status: 'active',
        city: 'СПб',
        phone: '+7 (XXX) XXX-XX-XX',
        telegram: '@dmitry_p',
        achievements: ['Миллионер', 'Наставник'],
        lastActivity: '1 день назад'
      },
      {
        id: 3,
        name: 'Елена Сидорова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'Специалист по продажам',
        joinDate: '2024-02-08',
        personalSales: 9800,
        teamSales: 28000,
        commission: 2150,
        recruits: 3,
        level: 1,
        status: 'active',
        city: 'Екатеринбург',
        phone: '+7 (XXX) XXX-XX-XX',
        telegram: '@elena_side',
        achievements: ['Быстрый старт'],
        lastActivity: '4 часа назад'
      }
    ],
    level2: [
      {
        id: 4,
        name: 'Михаил Козлов',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Консультант',
        joinDate: '2024-03-12',
        personalSales: 5600,
        teamSales: 15000,
        commission: 980,
        recruits: 2,
        level: 2,
        status: 'active',
        city: 'Казань',
        phone: '+7 (XXX) XXX-XX-XX',
        telegram: '@mikh_kozlov',
        achievements: ['Новичок месяца'],
        lastActivity: '1 день назад'
      },
      {
        id: 5,
        name: 'Анна Федорова',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        role: 'Junior партнер',
        joinDate: '2024-03-25',
        personalSales: 7200,
        teamSales: 18500,
        commission: 1290,
        recruits: 1,
        level: 2,
        status: 'active',
        city: 'Новосибирск',
        phone: '+7 (XXX) XXX-XX-XX',
        telegram: '@anna_fedorova',
        achievements: ['Активный участник'],
        lastActivity: '6 часов назад'
      }
    ],
    level3: [
      {
        id: 6,
        name: 'Игорь Волков',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: 'Стартап-консультант',
        joinDate: '2024-04-02',
        personalSales: 3100,
        teamSales: 8900,
        commission: 580,
        recruits: 0,
        level: 3,
        status: 'learning',
        city: 'Краснодар',
        phone: '+7 (XXX) XXX-XX-XX',
        telegram: '@igor_volkov',
        achievements: ['Перспективный'],
        lastActivity: '2 дня назад'
      }
    ]
  };
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedTariff, setSelectedTariff] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [showMlmFeatures, setShowMlmFeatures] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showHelpFor, setShowHelpFor] = useState<string | null>(null);
  const [showDetailedNetwork, setShowDetailedNetwork] = useState(false);

  const currentTariff = builderTariffs[selectedTariff];
  const currentPackage = levelPackages[selectedPackage];
  const baseCommission = getBaseCommissionRate(dealSize[0], currentTariff);
  const currentCommission = Math.min(50, Math.round(baseCommission));
  const monthlyEarnings = totalClients[0] * monthlySubscription[0];
  const oneTimeEarning = (dealSize[0] * currentCommission) / 100;
  
  // Network earnings calculation moved to network structure section
  const networkEarnings = 0;
  
  // Additional network bonus from tariff
  const networkBonus = showMlmFeatures ? networkEarnings * (currentTariff.networkBonus / 100) : 0;
  
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

        {showMlmFeatures && (
          <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-telegram" />
              <span>Выберите ваш тариф</span>
              <button
                onClick={() => setShowHelpFor(showHelpFor === 'tariff' ? null : 'tariff')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </button>
            </CardTitle>
            {showHelpFor === 'tariff' && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <button
                  onClick={() => setShowHelpFor(null)}
                  className="float-right p-1 hover:bg-blue-100 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
                <p><strong>Тарифы партнерской программы:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Партнер (25%):</strong> Базовый тариф для начинающих</li>
                  <li><strong>Про (35%):</strong> Увеличенная комиссия + бонус от сети</li>
                  <li><strong>Премиум (50%):</strong> Максимальная комиссия + все бонусы</li>
                </ul>
              </div>
            )}
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
        )}

        {showMlmFeatures && (
          <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-telegram" />
              <span>Пакеты уровней</span>
              <button
                onClick={() => setShowHelpFor(showHelpFor === 'levels' ? null : 'levels')}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </button>
            </CardTitle>
            {showHelpFor === 'levels' && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <button
                  onClick={() => setShowHelpFor(null)}
                  className="float-right p-1 hover:bg-blue-100 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
                <p><strong>Пакеты расширения уровней:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Стартовый:</strong> 3 уровня вознаграждений</li>
                  <li><strong>Стандарт:</strong> 5 уровней для развития сети</li>
                  <li><strong>Премиум:</strong> 7 уровней максимальной глубины</li>
                </ul>
              </div>
            )}
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
                  
                  {pkg.maxEarnings > 1500 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white text-xs">
                        До ${pkg.maxEarnings}/мес
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
        )}

        <div className={`grid ${showMlmFeatures ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6 mb-8`}>
          {/* Personal Sales Calculator */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calculator className="w-5 h-5 text-telegram" />
                <span>Калькулятор доходов от личных продаж</span>
                <button
                  onClick={() => setShowHelpFor(showHelpFor === 'calculator' ? null : 'calculator')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </button>
              </CardTitle>
              {showHelpFor === 'calculator' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <button
                    onClick={() => setShowHelpFor(null)}
                    className="float-right p-1 hover:bg-blue-100 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <p><strong>Как работает калькулятор:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Комиссия зависит от размера сделки и вашего тарифа</li>
                    <li>Мультипликатор растет с количеством успешных заказов</li>
                    <li>Абонентская плата - это ежемесячные платежи клиентов</li>
                    <li>С каждой подписки вы получаете 10%</li>
                  </ul>
                </div>
              )}
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
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$300</span>
                    <span>$500</span>
                    <span>$1000</span>
                    <span>$1500</span>
                    <span>$2000</span>
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
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Абонентская плата</label>
                      <button
                        onClick={() => setShowHelpFor(showHelpFor === 'monthly-fee' ? null : 'monthly-fee')}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ${monthlySubscription[0]}
                    </Badge>
                  </div>
                  {showHelpFor === 'monthly-fee' && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      <button
                        onClick={() => setShowHelpFor(null)}
                        className="float-right p-1 hover:bg-blue-100 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p><strong>Абонентская плата клиента:</strong></p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Ежемесячный платеж клиента за подписку</li>
                        <li>Максимум $300 в месяц</li>
                        <li>Вы получаете 10% с каждого платежа</li>
                        <li>Стабильный пассивный доход</li>
                      </ul>
                    </div>
                  )}
                  <Slider
                    value={monthlySubscription}
                    onValueChange={setMonthlySubscription}
                    max={300}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$5</span>
                    <span>$50</span>
                    <span>$150</span>
                    <span>$300</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Доход: ${monthlyEarnings.toFixed(0)}/мес (10% от подписок)
                  </div>
                </div>

                {/* Total Clients */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Всего клиентов</label>
                      <button
                        onClick={() => setShowHelpFor(showHelpFor === 'total-clients' ? null : 'total-clients')}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {totalClients[0]}
                    </Badge>
                  </div>
                  {showHelpFor === 'total-clients' && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      <button
                        onClick={() => setShowHelpFor(null)}
                        className="float-right p-1 hover:bg-blue-100 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p><strong>Количество клиентов:</strong></p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Общее число привлеченных клиентов</li>
                        <li>Влияет на разблокировку уровней</li>
                        <li>Каждые 5 клиентов открывают новый уровень</li>
                        <li>Больше клиентов = выше общий доход</li>
                      </ul>
                    </div>
                  )}
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



                {showMlmFeatures && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">Лично привлеченные</label>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {personalRecruits[0]}
                      </Badge>
                    </div>
                    <Slider
                      value={personalRecruits}
                      onValueChange={setPersonalRecruits}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500">
                      Партнеров, привлеченных лично вами
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Commission Display */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-center">Ваша комиссия</h4>
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-bold text-indigo-600">{currentCommission}%</span> с каждой сделки
                  </div>
                  <div className="text-xs text-gray-500">
                    Базовая ставка зависит от размера сделки
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
                      <div className="text-sm text-green-700">Абонентская плата</div>
                      <div className="text-xl font-bold text-green-600">${monthlyEarnings.toFixed(0)}/мес</div>
                      <div className="text-xs text-green-600">{totalClients[0]} клиентов × ${monthlySubscription[0]}</div>
                    </div>
                  </div>
                </div>

                {showMlmFeatures && (
                  /* Network Earnings */
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🌐 Доход от сети</h4>
                  <div className="space-y-2">
                    {partnerLevels.slice(0, currentPackage.levels).map((level, index) => {
                      const partnersAtLevel = Math.max(0, Math.floor(personalRecruits[0] * Math.pow(0.6, index)));
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
                )}

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

          {/* Network Calculator - Only visible when MLM features are enabled */}
          {showMlmFeatures && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg border border-purple-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Network className="w-5 h-5 text-purple-600" />
                  <span>Калькулятор сетевых доходов</span>
                  <button
                    onClick={() => setShowHelpFor(showHelpFor === 'network' ? null : 'network')}
                    className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                  </button>
                </CardTitle>
                {showHelpFor === 'network' && (
                  <div className="mt-2 p-3 bg-purple-100 border border-purple-300 rounded-lg text-sm text-purple-800">
                    <button
                      onClick={() => setShowHelpFor(null)}
                      className="float-right p-1 hover:bg-purple-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p><strong>Как работает сетевой калькулятор:</strong></p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Доход от сети зависит от активности ваших партнеров</li>
                      <li>Комиссия распределяется по уровням (10%, 5%, 3%, 2%, 1%)</li>
                      <li>Больше открытых уровней = больше пассивный доход</li>
                      <li>Качество партнеров важнее количества</li>
                    </ul>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Network Partners */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-purple-700">Партнеров в сети</label>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {networkPartners[0]}
                      </Badge>
                    </div>
                    <Slider
                      value={networkPartners}
                      onValueChange={setNetworkPartners}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-500">
                      <span>1</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>

                  {/* Network Turnover */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-purple-700">Оборот сети</label>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        ${networkTurnover[0].toLocaleString()}
                      </Badge>
                    </div>
                    <Slider
                      value={networkTurnover}
                      onValueChange={setNetworkTurnover}
                      max={100000}
                      min={5000}
                      step={2500}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-500">
                      <span>$5k</span>
                      <span>$25k</span>
                      <span>$50k</span>
                      <span>$75k</span>
                      <span>$100k</span>
                    </div>
                  </div>

                  {/* Average Deal Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-purple-700">Средний чек</label>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        ${avgDealSize[0]}
                      </Badge>
                    </div>
                    <Slider
                      value={avgDealSize}
                      onValueChange={setAvgDealSize}
                      max={2000}
                      min={300}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-500">
                      <span>$300</span>
                      <span>$650</span>
                      <span>$1000</span>
                      <span>$1500</span>
                      <span>$2000</span>
                    </div>
                  </div>

                  {/* Total Deals */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-purple-700">Сделок в месяц</label>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {totalDeals[0]}
                      </Badge>
                    </div>
                    <Slider
                      value={totalDeals}
                      onValueChange={setTotalDeals}
                      max={100}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-purple-500">
                      <span>5</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                {/* Network Results */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-3">Доходы от сети</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        ${Math.floor(networkTurnover[0] * 0.1).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Комиссии с 1 уровня</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        ${Math.floor(networkTurnover[0] * 0.18).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Общий сетевой доход</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="flex justify-between text-sm text-purple-700">
                      <span>Открытых уровней:</span>
                      <span className="font-semibold">{openLevels[0]}/7</span>
                    </div>
                    <div className="flex justify-between text-sm text-purple-700">
                      <span>Эффективность сети:</span>
                      <span className="font-semibold">{Math.floor((totalDeals[0] / networkPartners[0]) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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

        {showMlmFeatures && (
          <Card className="bg-white shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TreePine className="w-6 h-6 text-telegram" />
                <span>Интерактивная структура партнерской сети</span>
                <button
                  onClick={() => setShowDetailedNetwork(!showDetailedNetwork)}
                  className="ml-auto px-3 py-1 bg-telegram text-white text-sm rounded-lg hover:bg-telegram/90 transition-colors"
                >
                  {showDetailedNetwork ? 'Схема' : 'Детали'}
                </button>
              </CardTitle>
            <p className="text-gray-600">
              {showDetailedNetwork ? 'Детальный просмотр партнеров с профилями' : `Многоуровневая система с расширением до ${currentPackage.levels} уровн${currentPackage.levels > 1 ? 'ей' : 'я'} глубины`}
            </p>
          </CardHeader>
          <CardContent>
            {!showDetailedNetwork ? (
              <>
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
                      {(partnerData[`level${levelIndex + 1}` as keyof typeof partnerData] || []).map((partner, partnerIndex) => {
                        const level = partnerLevels[levelIndex];
                        if (!level || partnerIndex >= 6) return null;
                        
                        return (
                          <div key={partner.id} className="relative group">
                            <button 
                              onClick={() => setSelectedPartner(partner)}
                              className="relative w-12 h-12 rounded-full overflow-hidden shadow-md transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-white hover:border-telegram"
                            >
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
                            
                            {/* Partner info tooltip */}
                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              <div className="text-center">
                                <div className="font-semibold">{partner.name.split(' ')[0]}</div>
                                <div>${partner.commission.toLocaleString()}/мес</div>
                              </div>
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
                      
                      {/* Show remaining slots if needed */}
                      {(partnerData[`level${levelIndex + 1}` as keyof typeof partnerData] || []).length === 0 && (
                        <div className="relative group">
                          <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs">
                            +
                          </div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            Свободное место
                          </div>
                        </div>
                      )}
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
            </>
            ) : (
              <DetailedNetworkView 
                levels={partnerLevels.slice(0, currentPackage.levels)}
                personalRecruits={personalRecruits[0]}
                currentUser="Вы"
              />
            )}
          </CardContent>
        </Card>
        )}

        {/* Partner Profile Modal */}
        {selectedPartner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={selectedPartner.avatar}
                        alt={selectedPartner.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        selectedPartner.status === 'active' ? 'bg-green-400' : 
                        selectedPartner.status === 'learning' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedPartner.name}</h2>
                      <p className="text-gray-600">{selectedPartner.role}</p>
                      <p className="text-sm text-gray-500">{selectedPartner.city}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPartner(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      ${selectedPartner.personalSales.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-700">Личные продажи</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      ${selectedPartner.teamSales.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-700">Команда</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      ${selectedPartner.commission.toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-700">Комиссия</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{selectedPartner.recruits}</div>
                    <div className="text-xs text-orange-700">Рефералов</div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Достижения</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.achievements.map((achievement: string, index: number) => (
                      <Badge key={index} className="bg-telegram/10 text-telegram border-telegram/20">
                        🏆 {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Контакты</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Telegram: {selectedPartner.telegram}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Присоединился: {new Date(selectedPartner.joinDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Последняя активность: {selectedPartner.lastActivity}</span>
                    </div>
                  </div>
                </div>

                {/* Partner's Network Structure */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Структура партнера</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img 
                          src={selectedPartner.avatar}
                          alt={selectedPartner.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-telegram"
                        />
                      </div>
                    </div>
                    
                    {selectedPartner.recruits > 0 ? (
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Прямые рефералы</div>
                          <div className="flex justify-center space-x-2 mt-2">
                            {[...Array(Math.min(selectedPartner.recruits, 5))].map((_, i) => (
                              <div key={i} className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                                {i + 1}
                              </div>
                            ))}
                            {selectedPartner.recruits > 5 && (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                                +{selectedPartner.recruits - 5}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-center text-xs">
                          <div>
                            <div className="font-semibold text-gray-700">Глубина сети</div>
                            <div className="text-gray-600">{selectedPartner.level + 1} уровня</div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-700">Активность</div>
                            <div className="text-gray-600">
                              {selectedPartner.status === 'active' ? '85%' : '60%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm">
                        Пока нет рефералов
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-telegram hover:bg-telegram-dark">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Связаться
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Users className="w-4 h-4 mr-2" />
                    Посмотреть команду
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

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