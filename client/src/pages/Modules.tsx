import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, Filter, ArrowRight, ShoppingCart, BarChart3, Gift,
  GraduationCap, Calendar, DollarSign, Users, Star, Trophy,
  CreditCard, Package, Bot, Globe, Settings, Building2,
  Component, Store, Camera, Target, Heart, Crown, Award,
  Gamepad2, BookOpen, Coins, TrendingUp, UserPlus, Aperture,
  Truck, Repeat, TestTube2, Mail, Users2, MousePointerClick,
  Link, Eye, Wifi, Zap
} from "lucide-react";
import type { Module } from "@shared/schema";

// Маппинг иконок
const iconMap: { [key: string]: any } = {
  Store, Camera, ShoppingCart, CreditCard, Package, Truck, Aperture, Gift, 
  Repeat, Users, Star, Heart, BarChart3, TestTube2, TrendingUp, Target, Mail,
  Users2, MousePointerClick, Link, Crown, Award, Calendar, Gamepad2, Coins,
  Trophy, Eye, GraduationCap, BookOpen, Bot, Globe, Settings, Building2,
  Component, Search, Filter, ArrowRight, DollarSign, UserPlus, Wifi, Zap
};

// Список всех доступных категорий
const categories = [
  "ВСЕ МОДУЛИ",
  "E-COMMERCE",
  "МАРКЕТИНГ", 
  "ВОВЛЕЧЕНИЕ",
  "ОБРАЗОВАНИЕ",
  "ФИНТЕХ",
  "CRM",
  "B2B",
  "ИГРЫ",
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"
];

// Цвета для категорий
const categoryColors: { [key: string]: string } = {
  "E-COMMERCE": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  "МАРКЕТИНГ": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "ВОВЛЕЧЕНИЕ": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  "ОБРАЗОВАНИЕ": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "ФИНТЕХ": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "CRM": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  "B2B": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "ИГРЫ": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
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

function ModuleCard({ module }: { module: Module }) {
  const IconComponent = iconMap[module.icon] || Component;
  const keyFeatures = parseKeyFeatures(module.keyFeatures);
  
  return (
    <Card className="group h-full hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <Badge className={`text-xs font-medium px-2 py-1 ${categoryColors[module.category] || categoryColors["ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]}`}>
                  #{module.number} {module.category}
                </Badge>
                {module.isPopular && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs px-2 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Популярный
                  </Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {module.name}
            </CardTitle>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
          {module.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {keyFeatures.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Ключевые возможности
              </h4>
              <div className="space-y-2">
                {keyFeatures.slice(0, 3).map((feature, index) => {
                  const [title, ...description] = feature.split(':');
                  return (
                    <div key={index} className="text-sm leading-relaxed">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div className="text-gray-700 dark:text-gray-300">
                          {description.length > 0 ? (
                            <>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{formatFeatureText(title)}:</span>
                              <span className="ml-1">{formatFeatureText(description.join(':'))}</span>
                            </>
                          ) : (
                            formatFeatureText(feature)
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {keyFeatures.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    +{keyFeatures.length - 3} дополнительных возможностей
                  </p>
                )}
              </div>
            </div>
          )}
          
          {module.benefits && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Результат
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                {module.benefits}
              </p>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Подробнее
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Modules() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ВСЕ МОДУЛИ");

  // Загрузка модулей из API
  const { data: modules, isLoading, error } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const filteredModules = modules?.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ВСЕ МОДУЛИ" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const moduleStats = modules ? {
    total: modules.length,
    categories: [...new Set(modules.map(m => m.category))].length,
    popular: modules.filter(m => m.isPopular).length
  } : { total: 0, categories: 0, popular: 0 };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 dark:text-gray-400">Не удалось загрузить модули. Попробуйте обновить страницу.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок страницы */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Каталог бизнес-модулей
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Готовые решения для создания мощных Telegram Mini Apps. 
            Выберите нужные модули и запустите свой бизнес за считанные дни.
          </p>
          
          {/* Статистика */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {isLoading ? "..." : moduleStats.total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Модулей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {isLoading ? "..." : moduleStats.categories}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Категорий</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {isLoading ? "..." : moduleStats.popular}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Популярных</div>
            </div>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Поиск */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Поиск модулей по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-lg"
              />
            </div>
            
            {/* Фильтр по категориям */}
            <div className="flex gap-2 overflow-x-auto lg:overflow-visible">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Результаты поиска */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              "Загрузка модулей..."
            ) : (
              `Найдено ${filteredModules.length} из ${modules?.length || 0} модулей${searchTerm ? ` по запросу "${searchTerm}"` : ''}${selectedCategory !== "ВСЕ МОДУЛИ" ? ` в категории "${selectedCategory}"` : ''}`
            )}
          </div>
        </div>

        {/* Сетка модулей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Скелетоны загрузки
            Array.from({ length: 12 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : filteredModules.length > 0 ? (
            // Реальные модули
            filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))
          ) : (
            // Пустое состояние
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Модули не найдены
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Попробуйте изменить поисковый запрос или выбрать другую категорию
              </p>
            </div>
          )}
        </div>

        {/* Призыв к действию */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <h2 className="text-3xl font-bold mb-4">
              Готовы создать свой Telegram Mini App?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Выберите нужные модули и получите готовое решение за 24 часа
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Начать сейчас
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}