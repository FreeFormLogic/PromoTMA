import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Filter, ArrowRight, ShoppingCart, BarChart3, Gift,
  GraduationCap, Calendar, DollarSign, Users, Star, Trophy,
  CreditCard, Package, Bot, Globe, Settings, Building2,
  Component, Store, Camera, Target, Heart, Crown, Award,
  Gamepad2, BookOpen, Coins, TrendingUp, UserPlus, Aperture,
  Truck, Repeat, TestTube2, Mail, Users2, MousePointerClick,
  Link, Eye, Wifi, Zap, Clock, Puzzle, Sword, CheckSquare,
  FileText, MessageSquare, UserCheck, Edit, Video, Headphones,
  Briefcase, Database, Webhook, Car, Wallet, Shield, X, Bell,
  CalendarCheck, Smartphone, Paintbrush, Users as Users3, GraduationCap as Education,
  DollarSign as Banknote, Phone, Monitor, Video as Clapperboard, Flag,
  MessageCircle, Share2, MapPin
} from "lucide-react";
import type { Module } from "@shared/schema";

// Маппинг иконок
const iconMap: { [key: string]: any } = {
  Store, Camera, ShoppingCart, CreditCard, Package, Truck, Aperture, Gift, 
  Repeat, Users, Star, Heart, BarChart3, TestTube2, TrendingUp, Target, Mail,
  Users2, MousePointerClick, Link, Crown, Award, Calendar, Gamepad2, Coins,
  Trophy, Eye, GraduationCap, BookOpen, Bot, Globe, Settings, Building2,
  Component, Search, Filter, ArrowRight, DollarSign, UserPlus, Wifi, Zap,
  Clock, Puzzle, Sword, CheckSquare, FileText, MessageSquare, UserCheck,
  Edit, Video, Headphones, Briefcase, Database, Webhook, Car, Wallet, Shield,
  Bell, CalendarCheck, Smartphone
};

// Древовидная группировка категорий
const categoryTree = {
  "ВСЕ МОДУЛИ": [],
  "🛒 E-COMMERCE": [
    "E-COMMERCE",
    "СОЦИАЛЬНАЯ КОММЕРЦИЯ"
  ],
  "📈 МАРКЕТИНГ": [
    "МАРКЕТИНГ",
    "ВОВЛЕЧЕНИЕ"
  ],
  "💰 ФИНАНСЫ": [
    "ФИНТЕХ", 
    "WEB3 & DEFI"
  ],
  "🎓 ОБРАЗОВАНИЕ": [
    "ОБРАЗОВАНИЕ",
    "КОНТЕНТ И МЕДИА"
  ],
  "🎮 РАЗВЛЕЧЕНИЯ": [
    "ИГРЫ"
  ],
  "📅 БРОНИРОВАНИЕ": [
    "БРОНИРОВАНИЕ"
  ],
  "🏢 БИЗНЕС": [
    "B2B",
    "CRM",
    "ОТРАСЛЕВЫЕ РЕШЕНИЯ"
  ],
  "🤖 AI & АВТОМАТИЗАЦИЯ": [
    "AI И АВТОМАТИЗАЦИЯ",
    "AI-АВАТАРЫ", 
    "АВТОМАТИЗАЦИЯ"
  ],
  "🔗 ИНТЕГРАЦИИ": [
    "ИНТЕГРАЦИИ",
    "ПАРСИНГ TELEGRAM"
  ],
  "📞 КОММУНИКАЦИИ": [
    "КОММУНИКАЦИИ"
  ],
  "📊 АНАЛИТИКА": [
    "АНАЛИТИКА"
  ],
  "🔒 БЕЗОПАСНОСТЬ": [
    "БЕЗОПАСНОСТЬ"
  ],
  "🌏 ЛОКАЛЬНЫЕ": [
    "ЛОКАЛЬНЫЕ СЕРВИСЫ",
    "ИНДОНЕЗИЯ"
  ],
  "🛠️ ДОПОЛНИТЕЛЬНО": [
    "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"
  ]
};

// Плоский список всех категорий для совместимости
const categories = [
  "ВСЕ МОДУЛИ",
  ...Object.values(categoryTree).flat().filter(cat => cat !== "ВСЕ МОДУЛИ")
];

// Иконки для категорий
const categoryIcons: { [key: string]: any } = {
  "E-COMMERCE": ShoppingCart,
  "МАРКЕТИНГ": Target,
  "ВОВЛЕЧЕНИЕ": Users3,
  "ОБРАЗОВАНИЕ": Education,
  "ФИНТЕХ": Banknote,
  "CRM": Phone,
  "B2B": Briefcase,
  "БРОНИРОВАНИЕ": Calendar,
  "КОНТЕНТ И МЕДИА": Clapperboard,
  "ИНТЕГРАЦИИ": Webhook,
  "ИНДОНЕЗИЯ": Flag,
  "ИГРЫ": Gamepad2,
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": Settings,
  "АВТОМАТИЗАЦИЯ": Zap,
  "ОТРАСЛЕВЫЕ РЕШЕНИЯ": Building2,
  "АНАЛИТИКА": BarChart3,
  "БЕЗОПАСНОСТЬ": Shield,
  "КОММУНИКАЦИИ": MessageCircle,
  "СОЦИАЛЬНАЯ КОММЕРЦИЯ": Share2,
  "AI И АВТОМАТИЗАЦИЯ": Bot,
  "AI-АВАТАРЫ": Users,
  "ПАРСИНГ TELEGRAM": Search,
  "WEB3 & DEFI": Coins,
  "ЛОКАЛЬНЫЕ СЕРВИСЫ": MapPin
};

// Цвета для категорий
const categoryColors: { [key: string]: string } = {
  "E-COMMERCE": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "МАРКЕТИНГ": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "ВОВЛЕЧЕНИЕ": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "ОБРАЗОВАНИЕ": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "ФИНТЕХ": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "CRM": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  "B2B": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "БРОНИРОВАНИЕ": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  "КОНТЕНТ И МЕДИА": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "ИНТЕГРАЦИИ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "ИНДОНЕЗИЯ": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "ИГРЫ": "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  "АВТОМАТИЗАЦИЯ": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "ОТРАСЛЕВЫЕ РЕШЕНИЯ": "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  "АНАЛИТИКА": "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  "БЕЗОПАСНОСТЬ": "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  "КОММУНИКАЦИИ": "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
  "СОЦИАЛЬНАЯ КОММЕРЦИЯ": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300",
  "AI И АВТОМАТИЗАЦИЯ": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "AI-АВАТАРЫ": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "ПАРСИНГ TELEGRAM": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "WEB3 & DEFI": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "ЛОКАЛЬНЫЕ СЕРВИСЫ": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
};

function parseKeyFeatures(keyFeatures: unknown): string[] {
  if (Array.isArray(keyFeatures)) {
    return keyFeatures;
  }
  if (typeof keyFeatures === 'string') {
    try {
      const parsed = JSON.parse(keyFeatures);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [keyFeatures];
    }
  }
  return [];
}

function formatFeatureText(text: string): React.ReactNode {
  // Разбиваем текст на части, выделяя жирным текст между **
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-semibold text-gray-900 dark:text-gray-100">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

// Компактная карточка модуля
function CompactModuleCard({ module }: { module: Module }) {
  const IconComponent = iconMap[module.icon] || Component;
  const keyFeatures = parseKeyFeatures(module.keyFeatures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1">
          <div className="p-4">
            {/* Иконка и заголовок */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight break-words hyphens-auto overflow-visible whitespace-normal">
                  {module.name}
                </h3>
                <div className="text-[10px] mt-1 font-normal text-gray-500 uppercase">
                  {module.category}
                </div>
              </div>
            </div>
            
            {/* Описание */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {module.description}
            </p>
            
            {/* Бенефит */}
            <div className="flex items-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium line-clamp-1 flex-1">
                {module.benefits}
              </p>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      
      {/* Модальное окно с детальной информацией */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {module.name}
            </DialogTitle>
            <div className="text-[10px] font-normal text-gray-500 uppercase">
              {module.category}
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Иконка и описание */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Ключевые возможности */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Ключевые возможности
              </h3>
              <div className="space-y-3">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words hyphens-auto">
                      {formatFeatureText(feature)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Бизнес-преимущества */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Бизнес-преимущества
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  {module.benefits}
                </p>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Добавить в проект
              </Button>
              <Button variant="outline" className="flex-1">
                Подробнее
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Скелетон для загрузки
function ModuleCardSkeleton() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-full mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}

export default function Modules() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ВСЕ МОДУЛИ");

  const { data: modules, isLoading, error } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const filteredModules = modules?.filter(module => {
    if (!searchTerm.trim()) {
      // Проверяем категорию или группу категорий
      if (selectedCategory === "ВСЕ МОДУЛИ") {
        return true;
      }
      
      // Проверяем, является ли выбранная категория группой
      const selectedGroup = Object.entries(categoryTree).find(([groupName]) => groupName === selectedCategory);
      if (selectedGroup) {
        const [, groupCategories] = selectedGroup as [string, string[]];
        return groupCategories.includes(module.category);
      }
      
      // Иначе проверяем точное совпадение категории
      return module.category === selectedCategory;
    }

    const searchLower = searchTerm.toLowerCase();
    
    // Поиск в названии и описании
    const matchesNameOrDescription = 
      (module.name?.toLowerCase() || '').includes(searchLower) ||
      (module.description?.toLowerCase() || '').includes(searchLower);
    
    // Поиск в бизнес-преимуществах
    const matchesBenefits = (module.benefits?.toLowerCase() || '').includes(searchLower);
    
    // Поиск в ключевых возможностях
    let matchesFeatures = false;
    try {
      const keyFeatures = parseKeyFeatures(module.keyFeatures);
      matchesFeatures = keyFeatures.some(feature => 
        typeof feature === 'string' && feature.toLowerCase().includes(searchLower)
      );
    } catch {
      // Если не удается распарсить, ищем в исходной строке
      matchesFeatures = (String(module.keyFeatures || '').toLowerCase()).includes(searchLower);
    }
    
    const matchesSearch = matchesNameOrDescription || matchesBenefits || matchesFeatures;
    
    // Применяем фильтр по категории для результатов поиска
    let matchesCategory = true;
    if (selectedCategory !== "ВСЕ МОДУЛИ") {
      const selectedGroup = Object.entries(categoryTree).find(([groupName]) => groupName === selectedCategory);
      if (selectedGroup) {
        const [, groupCategories] = selectedGroup as [string, string[]];
        matchesCategory = groupCategories.includes(module.category);
      } else {
        matchesCategory = module.category === selectedCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Статистика
  const totalModules = modules?.length || 0;
  const categoriesCount = Array.from(new Set(modules?.map(m => m.category) || [])).length;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Ошибка загрузки модулей</h1>
          <p className="text-gray-600">Попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Заголовок с синим фоном */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Каталог функционала
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Более {totalModules} готовых решений для вашего Telegram Mini App в {categoriesCount} категориях
            </p>
          </div>

          {/* Поиск */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <Input
                placeholder="Поиск по названию, описанию, возможностям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-white/40"
              />
            </div>
          </div>
          
          {/* Древовидная навигация по категориям */}
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              {Object.entries(categoryTree).map(([groupName, groupCategories]) => (
                <div key={groupName} className="space-y-2">
                  {/* Группа категорий */}
                  <div className="text-center">
                    <Button
                      variant={selectedCategory === groupName ? "secondary" : "outline"}
                      onClick={() => setSelectedCategory(groupName)}
                      className={`text-sm font-semibold px-4 py-2 ${
                        selectedCategory === groupName
                          ? "bg-white text-blue-700 hover:bg-blue-50 shadow-lg border-2 border-blue-200"
                          : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                      }`}
                      title={groupName === "ВСЕ МОДУЛИ" ? `Все модули (${totalModules})` : groupName}
                    >
                      {groupName === "ВСЕ МОДУЛИ" ? `Все модули (${totalModules})` : groupName}
                    </Button>
                  </div>
                  
                  {/* Подкategории */}
                  {groupCategories.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-w-4xl mx-auto">
                      {groupCategories.map((category) => {
                        const IconComponent = categoryIcons[category] || Settings;
                        const isActive = selectedCategory === category;
                        const categoryModulesCount = modules?.filter(m => m.category === category).length || 0;
                        
                        return (
                          <Button
                            key={category}
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all duration-200 px-2 py-2 h-16 ${
                              isActive
                                ? "bg-white text-blue-700 hover:bg-blue-50 shadow-lg border-2 border-blue-200"
                                : "bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50"
                            }`}
                            title={`${category} (${categoryModulesCount} модулей)`}
                          >
                            <IconComponent className="w-4 h-4 flex-shrink-0" />
                            <span className="text-center leading-tight line-clamp-2 text-[10px] hyphens-auto break-words">
                              {category}
                            </span>
                            <span className="text-[8px] opacity-70">
                              {categoryModulesCount}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Модули */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <ModuleCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Модули не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Попробуйте изменить критерии поиска или выбрать другую категорию
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Найдено {filteredModules.length} модулей
                {selectedCategory !== "ВСЕ МОДУЛИ" && ` в категории "${selectedCategory}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredModules.map((module) => (
                <CompactModuleCard key={module.id} module={module} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}