import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, ArrowRight, Star, Users, Building2, Target, TrendingUp } from "lucide-react";
import { Industry } from "@shared/schema";

// Маппинг иконок
const iconMap: Record<string, any> = {
  "🍕": Building2,
  "🛍️": Building2,
  "📱": Users,
  "🎓": Building2,
  "🧠": Target,
  "🛵": Building2,
  "🚚": Building2,
  "💼": Users,
  "💇‍♀️": Building2,
  "🏥": Building2,
  "📦": Building2,
};

// Цвета для категорий важности
const categoryColors: Record<string, string> = {
  "КРИТИЧЕСКИ ВАЖНО": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800",
  "ОЧЕНЬ ПОЛЕЗНО": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "ПОЛЕЗНО": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800"
};

const categories = ["ВСЕ ОТРАСЛИ", "КРИТИЧЕСКИ ВАЖНО", "ОЧЕНЬ ПОЛЕЗНО", "ПОЛЕЗНО"];

// Компонент для форматирования текста с выделением жирным
function formatText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-semibold text-gray-900 dark:text-gray-100">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

// Компактная карточка отрасли
function IndustryCard({ industry }: { industry: Industry }) {
  const IconComponent = iconMap[industry.icon] || Building2;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Парсинг массивов из JSON
  const painPoints = Array.isArray(industry.painPoints) ? industry.painPoints : [];
  const requiredModules = Array.isArray(industry.requiredModules) ? industry.requiredModules : [];
  const recommendedModules = Array.isArray(industry.recommendedModules) ? industry.recommendedModules : [];
  const keyMetrics = Array.isArray(industry.keyMetrics) ? industry.keyMetrics : [];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1">
          <CardContent className="p-6">
            {/* Иконка, название и категория */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-2">
                  {industry.name}
                </h3>
                <Badge className={`text-xs ${categoryColors[industry.category] || categoryColors["ПОЛЕЗНО"]}`}>
                  {industry.category}
                </Badge>
              </div>
            </div>
            
            {/* Описание */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
              {industry.description}
            </p>
            
            {/* Показатели */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">ROI 200-500%</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      {/* Модальное окно с детальной информацией */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {industry.name}
            </DialogTitle>
            <Badge className={`${categoryColors[industry.category] || categoryColors["ПОЛЕЗНО"]}`}>
              {industry.category}
            </Badge>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="space-y-8">
            {/* Иконка и описание */}
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {industry.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Почему критически важен */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Почему Telegram Mini App важен для этой отрасли
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                  {formatText(industry.importance)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Болевые точки и решения */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Основные болевые точки и их решение
              </h3>
              <div className="grid gap-3">
                {painPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formatText(point)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Обязательные модули */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Обязательные модули
              </h3>
              <div className="grid gap-4">
                {requiredModules.map((module: any, index) => (
                  <div key={index} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
                    <div className="flex items-start gap-3 mb-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        №{module.number}
                      </Badge>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{module.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                      {formatText(module.reason)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Рекомендуемые модули */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Рекомендуемые модули
              </h3>
              <div className="grid gap-4">
                {recommendedModules.map((module: any, index) => (
                  <div key={index} className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
                    <div className="flex items-start gap-3 mb-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        №{module.number}
                      </Badge>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{module.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">
                      {formatText(module.reason)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ключевые метрики */}
            {keyMetrics.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Ключевые метрики эффективности
                  </h3>
                  <div className="grid gap-3">
                    {keyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-800 dark:text-green-300 font-medium leading-relaxed">
                          {formatText(metric)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Кнопки действий */}
            <div className="flex gap-4 pt-6">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Начать создание
              </Button>
              <Button variant="outline" className="flex-1">
                Получить консультацию
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Скелетон для загрузки
function IndustryCardSkeleton() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Industries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ВСЕ ОТРАСЛИ");

  const { data: industries, isLoading, error } = useQuery<Industry[]>({
    queryKey: ['/api/industries'],
  });

  const filteredIndustries = industries?.filter(industry => {
    const matchesSearch = !searchTerm.trim() || 
      industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.importance.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "ВСЕ ОТРАСЛИ" || industry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Статистика
  const totalIndustries = industries?.length || 0;
  const categoriesStats = {
    "КРИТИЧЕСКИ ВАЖНО": industries?.filter(i => i.category === "КРИТИЧЕСКИ ВАЖНО").length || 0,
    "ОЧЕНЬ ПОЛЕЗНО": industries?.filter(i => i.category === "ОЧЕНЬ ПОЛЕЗНО").length || 0,
    "ПОЛЕЗНО": industries?.filter(i => i.category === "ПОЛЕЗНО").length || 0,
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки отраслей</h1>
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
              Отрасли и ниши бизнеса
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {totalIndustries} перспективных отраслей для запуска Telegram Mini Apps с подробным анализом эффективности и рекомендациями по модулям
            </p>
          </div>

          {/* Статистика по категориям */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{categoriesStats["КРИТИЧЕСКИ ВАЖНО"]}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Критически важно</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{categoriesStats["ОЧЕНЬ ПОЛЕЗНО"]}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Очень полезно</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{categoriesStats["ПОЛЕЗНО"]}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Полезно</div>
            </div>
          </div>

          {/* Поиск и фильтры */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по названию отрасли..."
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
                  {category === "ВСЕ ОТРАСЛИ" ? `Все (${totalIndustries})` : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Отрасли */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <IndustryCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredIndustries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Отрасли не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Попробуйте изменить критерии поиска или выбрать другую категорию
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Найдено {filteredIndustries.length} отраслей
                {selectedCategory !== "ВСЕ ОТРАСЛИ" && ` в категории "${selectedCategory}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIndustries.map((industry) => (
                <IndustryCard key={industry.id} industry={industry} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}