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
  Briefcase, Database, Webhook, Car, Wallet, Shield, X
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
  Edit, Video, Headphones, Briefcase, Database, Webhook, Car, Wallet, Shield
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
  "КОНТЕНТ И МЕДИА",
  "ИНТЕГРАЦИИ",
  "ИНДОНЕЗИЙСКИЕ ИНТЕГРАЦИИ",
  "ИГРЫ",
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"
];

// Цвета для категорий
const categoryColors: { [key: string]: string } = {
  "E-COMMERCE": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "МАРКЕТИНГ": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "ВОВЛЕЧЕНИЕ": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "ОБРАЗОВАНИЕ": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "ФИНТЕХ": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "CRM": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  "B2B": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "КОНТЕНТ И МЕДИА": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "ИНТЕГРАЦИИ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "ИНДОНЕЗИЙСКИЕ ИНТЕГРАЦИИ": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "ИГРЫ": "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
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
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                  {module.name}
                </h3>
                <Badge className={`text-xs mt-1 ${categoryColors[module.category] || categoryColors["ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]}`}>
                  #{module.number}
                </Badge>
              </div>
            </div>
            
            {/* Описание */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {module.description}
            </p>
            
            {/* Бенефит и стрелка */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium line-clamp-1 flex-1">
                {module.benefits}
              </p>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
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
            <Badge className={`${categoryColors[module.category] || categoryColors["ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]}`}>
              #{module.number} {module.category}
            </Badge>
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
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
    const matchesSearch = (module.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (module.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ВСЕ МОДУЛИ" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Статистика
  const totalModules = modules?.length || 0;
  const categoriesCount = Array.from(new Set(modules?.map(m => m.category) || [])).length;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки модулей</h1>
          <p className="text-gray-600">Попробуйте обновить страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Заголовок */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Каталог бизнес-модулей
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Более {totalModules} готовых решений для вашего Telegram Mini App в {categoriesCount} категориях
            </p>
          </div>

          {/* Поиск и фильтры */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск модулей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {category === "ВСЕ МОДУЛИ" ? `Все (${totalModules})` : category}
                </Button>
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