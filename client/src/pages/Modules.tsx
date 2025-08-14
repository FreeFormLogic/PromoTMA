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
import ModuleCatalog from "@/components/ModuleCatalog";
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
  CalendarCheck, Smartphone, Paintbrush, Users as Users3, 
  GraduationCap as Education, DollarSign as Banknote, Phone, 
  Monitor, Video as Clapperboard, Flag, MessageCircle, Share2, MapPin
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

// Древовидная группировка категорий с точным соответствием требованиям
const categoryTree = {
  "ВСЕ МОДУЛИ": [],
  "E-COMMERCE": ["E-COMMERCE"], // 30 модулей
  "МАРКЕТИНГ": ["МАРКЕТИНГ"], // 13 модулей
  "ВОВЛЕЧЕНИЕ": ["ВОВЛЕЧЕНИЕ"], // 12 модулей
  "ОБРАЗОВАНИЕ": ["ОБРАЗОВАНИЕ"], // 28 модулей
  "БЕЗОПАСНОСТЬ": ["БЕЗОПАСНОСТЬ"], // 10 модулей
  "ФИНТЕХ": ["ФИНТЕХ"], // 9 модулей
  "CRM": ["CRM"], // 8 модулей
  "B2B": ["B2B"], // 17 модулей
  "БРОНИРОВАНИЕ": ["БРОНИРОВАНИЕ"], // 3 модуля
  "КОНТЕНТ И МЕДИА": ["КОНТЕНТ И МЕДИА"], // 10 модулей
  "ИНТЕГРАЦИИ": ["ИНТЕГРАЦИИ"], // 10 модулей
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": ["ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"], // 20 модулей
  "ИГРЫ": ["ИГРЫ"], // 10 модулей
  "КОММУНИКАЦИИ": ["КОММУНИКАЦИИ"], // 6 модулей
  "ИНДОНЕЗИЯ": ["ИНДОНЕЗИЯ"], // 8 модулей
  "АВТОМАТИЗАЦИЯ": ["АВТОМАТИЗАЦИЯ"], // 10 модулей
  "ОТРАСЛЕВЫЕ РЕШЕНИЯ": ["ОТРАСЛЕВЫЕ РЕШЕНИЯ"], // 10 модулей
  "АНАЛИТИКА": ["АНАЛИТИКА"], // 10 модулей
  "СОЦИАЛЬНАЯ КОММЕРЦИЯ": ["СОЦИАЛЬНАЯ КОММЕРЦИЯ"], // 5 модулей
  "AI И АВТОМАТИЗАЦИЯ": ["AI И АВТОМАТИЗАЦИЯ"], // 5 модулей
  "AI-АВАТАРЫ": ["AI-АВАТАРЫ"], // 5 модулей
  "ПАРСИНГ TELEGRAM": ["ПАРСИНГ TELEGRAM"] // 5 модулей
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
  "ПАРСИНГ TELEGRAM": Link,
  "ЛОКАЛЬНЫЕ СЕРВИСЫ": MapPin
};

// Утилиты для парсинга ключевых особенностей
function parseKeyFeatures(keyFeatures: any): string[] {
  if (!keyFeatures) return [];
  
  try {
    if (typeof keyFeatures === 'string') {
      return keyFeatures.split('\n').filter(feature => feature.trim().length > 0);
    }
    if (Array.isArray(keyFeatures)) {
      return keyFeatures.map(String);
    }
    return [String(keyFeatures)];
  } catch {
    return [];
  }
}

// Форматирование текста функций
function formatFeatureText(feature: string): string {
  return feature.replace(/^\d+\.\s*/, '').trim();
}

// Компактная карточка модуля
interface ModuleCardProps {
  module: Module;
}

function ModuleCard({ module }: ModuleCardProps) {
  const keyFeatures = parseKeyFeatures(module.keyFeatures);
  const IconComponent = iconMap[module.icon] || Component;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group">
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight mb-1 line-clamp-2">
                  {module.name}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {module.category}
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
              {module.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-600 dark:text-blue-400 font-medium truncate">
                {module.benefits?.substring(0, 50)}...
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
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
  const [viewMode, setViewMode] = useState<"compact" | "catalog">("compact");

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
            
            {/* Переключатель вида */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex">
                <Button
                  variant={viewMode === "compact" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("compact")}
                  className={`px-4 py-2 text-sm ${
                    viewMode === "compact"
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Компактный вид
                </Button>
                <Button
                  variant={viewMode === "catalog" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("catalog")}
                  className={`px-4 py-2 text-sm ${
                    viewMode === "catalog"
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  Каталог
                </Button>
              </div>
            </div>
          </div>
          
          {/* Компактная навигация по категориям */}
          {viewMode === "compact" && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-4">
                <Button
                  variant={selectedCategory === "ВСЕ МОДУЛИ" ? "secondary" : "outline"}
                  onClick={() => setSelectedCategory("ВСЕ МОДУЛИ")}
                  className={`text-sm font-semibold px-6 py-2 mr-4 mb-2 ${
                    selectedCategory === "ВСЕ МОДУЛИ" 
                      ? "bg-white text-blue-700 hover:bg-blue-50" 
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                  }`}
                >
                  Все модули ({totalModules})
                </Button>
              </div>
              
              {/* Сетка категорий */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(categoryTree).filter(([name]) => name !== "ВСЕ МОДУЛИ").map(([categoryName, categoryGroups]) => {
                  const categoryCount = modules?.filter(m => (categoryGroups as string[]).includes(m.category)).length || 0;
                  const IconComponent = categoryIcons[categoryName] || Component;
                  
                  return (
                    <Button
                      key={categoryName}
                      variant={selectedCategory === categoryName ? "secondary" : "outline"}
                      onClick={() => setSelectedCategory(categoryName)}
                      className={`p-3 h-auto flex flex-col items-center justify-center gap-2 text-xs ${
                        selectedCategory === categoryName 
                          ? "bg-white text-blue-700 hover:bg-blue-50" 
                          : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div className="text-center">
                        <div className="font-semibold leading-tight">{categoryName}</div>
                        <div className="text-xs opacity-75">{categoryCount} модулей</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        {/* Отображение выбранной категории и количества модулей */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedCategory === "ВСЕ МОДУЛИ" ? "Все модули" : selectedCategory}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredModules.length} {searchTerm ? 'найдено' : 'модулей'}
            </p>
          </div>
          {searchTerm && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSearchTerm("")}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Очистить поиск
            </Button>
          )}
        </div>

        {/* Контент в зависимости от режима просмотра */}
        {viewMode === "catalog" ? (
          <div className="space-y-6">
            {/* Используем новый компонент ModuleCatalog */}
            <ModuleCatalog allModulesData={modules || []} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Загрузка */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <ModuleCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Результаты поиска или категории */}
            {!isLoading && filteredModules.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {searchTerm 
                    ? `По запросу "${searchTerm}" модули не найдены. Попробуйте изменить запрос.`
                    : `В категории "${selectedCategory}" пока нет модулей.`
                  }
                </p>
              </div>
            )}

            {/* Сетка модулей */}
            {!isLoading && filteredModules.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}