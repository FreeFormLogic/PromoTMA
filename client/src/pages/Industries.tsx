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
import { 
  Search, ArrowRight, Star, Users, Building2, Target, TrendingUp,
  ShoppingCart, Utensils, Smartphone, GraduationCap, Brain,
  Truck, Package, Briefcase, Scissors, Stethoscope,
  Home, Car, Plane, Gamepad2, Music,
  Dumbbell, Camera, Baby, DollarSign, Wrench,
  AlertTriangle, CheckCircle, Component, Store, CreditCard,
  Aperture, Gift, Repeat, Heart, BarChart3, TestTube2, Mail,
  Users2, MousePointerClick, Link, Crown, Award, Calendar, Coins,
  Trophy, Eye, Bot, Globe, Settings, UserPlus, Wifi, Zap,
  Clock, Puzzle, Sword, CheckSquare, FileText, MessageSquare, UserCheck,
  Edit, Video, Headphones, Database, Webhook, Wallet, Shield,
  Bell, CalendarCheck, Paintbrush, Phone, Monitor, Flag
} from "lucide-react";
import { Industry, Module } from "@shared/schema";

// Маппинг иконок для отраслей
const industryIconMap: Record<string, any> = {
  "🍕": Utensils,
  "🛍️": ShoppingCart,
  "📱": Smartphone,
  "🎓": GraduationCap,
  "🧠": Brain,
  "🛵": Car,
  "🚚": Truck,
  "💼": Briefcase,
  "💇‍♀️": Scissors,
  "🏥": Stethoscope,
  "📦": Package,
  "🏠": Home,
  "✈️": Plane,
  "🎮": Gamepad2,
  "🎵": Music,
  "💪": Dumbbell,
  "📷": Camera,
  "👶": Baby,
  "💰": DollarSign,
  "🔧": Wrench,
};

// Маппинг иконок для модулей (как в Modules.tsx)
const moduleIconMap: { [key: string]: any } = {
  Store, Camera, ShoppingCart, CreditCard, Package, Truck, Aperture, Gift, 
  Repeat, Users, Star, Heart, BarChart3, TestTube2, TrendingUp, Target, Mail,
  Users2, MousePointerClick, Link, Crown, Award, Calendar, Gamepad2, Coins,
  Trophy, Eye, GraduationCap, Brain, Bot, Globe, Settings, Building2,
  Component, Search, ArrowRight, DollarSign, UserPlus, Wifi, Zap,
  Clock, Puzzle, Sword, CheckSquare, FileText, MessageSquare, UserCheck,
  Edit, Video, Headphones, Briefcase, Database, Webhook, Car, Wallet, Shield,
  Bell, CalendarCheck, Smartphone
};

// Цвета для категорий модулей (как в Modules.tsx)
const moduleCategoryColors: { [key: string]: string } = {
  "E-COMMERCE": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "МАРКЕТИНГ": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "ВОВЛЕЧЕНИЕ": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "ОБРАЗОВАНИЕ": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "ФИНТЕХ": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "CRM": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  "B2B": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "КОНТЕНТ И МЕДИА": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "ИНТЕГРАЦИИ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  "ИНДОНЕЗИЯ": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "ИГРЫ": "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
};

// Функции для парсинга данных модулей (как в Modules.tsx)
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
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-semibold text-gray-900 dark:text-gray-100">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

// Модульное модальное окно (идентичное Modules.tsx)
function ModuleInlineModal({ module, variant }: { module: Module; variant: 'required' | 'recommended' }) {
  const IconComponent = moduleIconMap[module.icon] || Component;
  const keyFeatures = parseKeyFeatures(module.keyFeatures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const borderColor = variant === 'required' ? 'border-green-200 dark:border-green-800' : 'border-blue-200 dark:border-blue-800';
  const bgColor = variant === 'required' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-blue-50 dark:bg-blue-900/10';
  const hoverBgColor = variant === 'required' ? 'hover:bg-green-100 dark:hover:bg-green-900/20' : 'hover:bg-blue-100 dark:hover:bg-blue-900/20';
  const badgeColor = variant === 'required' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className={`border ${borderColor} rounded-lg p-4 ${bgColor} cursor-pointer hover:shadow-md ${hoverBgColor} transition-all`}>
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="outline" className={badgeColor}>
              №{module.number}
            </Badge>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {module.name}
                <ArrowRight className="w-4 h-4 opacity-60" />
              </h4>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {module.description}
          </p>
        </div>
      </DialogTrigger>
      
      {/* Модальное окно - точная копия из Modules.tsx */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {module.name}
            </DialogTitle>
            <Badge className={`${moduleCategoryColors[module.category] || moduleCategoryColors["ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]}`}>
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

// Цвета для категорий важности
const categoryColors: Record<string, string> = {
  "КРИТИЧЕСКИ ВАЖНО": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "ОЧЕНЬ ПОЛЕЗНО": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  "ПОЛЕЗНО": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800"
};



const categories = ["ВСЕ НИШИ", "КРИТИЧЕСКИ ВАЖНО", "ОЧЕНЬ ПОЛЕЗНО", "ПОЛЕЗНО"];

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
function IndustryCard({ industry, modules }: { industry: Industry; modules: Module[] }) {
  const IconComponent = industryIconMap[industry.icon] || Building2;
  
  // Функция для получения преимуществ для конкретной отрасли
  const getIndustryBenefits = (industryName: string) => {
    // Специфичные преимущества для разных отраслей
    if (industryName.includes("Рестораны") || industryName.includes("доставка")) {
      return [
        {
          problem: "Высокие комиссии агрегаторов (25-35%)",
          solution: "Собственный канал продаж без комиссий",
          impact: "Все платежи идут напрямую вам, без посредников"
        },
        {
          problem: "Отсутствие данных о клиентах",
          solution: "Полная информация о клиентах и их предпочтениях",
          impact: "Персонализируете предложения на основе истории заказов"
        },
        {
          problem: "Зависимость от внешних платформ",
          solution: "Независимый канал коммуникации и продаж",
          impact: "Клиенты заказывают напрямую у вас, а не ищут в агрегаторе"
        },
        {
          problem: "Сложность повторных продаж",
          solution: "Прямые уведомления и программа лояльности",
          impact: "Клиенты видят ваши акции в Telegram, который открывают 10+ раз в день"
        }
      ];
    }

    if (industryName.includes("e-commerce") || industryName.includes("магазин")) {
      return [
        {
          problem: "Высокая стоимость CAC (Customer Acquisition Cost)",
          solution: "Использование существующей аудитории Telegram",
          impact: "Клиенты уже в мессенджере - не нужно платить за привлечение"
        },
        {
          problem: "Зависимость от маркетплейсов",
          solution: "Создание собственного канала продаж",
          impact: "Вы сами устанавливаете цены и правила, без диктата площадки"
        },
        {
          problem: "Низкая конверсия мобильного трафика",
          solution: "Нативный опыт без необходимости установки приложения",
          impact: "Покупка в два клика без регистрации и скачивания"
        },
        {
          problem: "Сложность возврата клиентов",
          solution: "Прямая коммуникация через знакомый интерфейс Telegram",
          impact: "Уведомления о новинках приходят туда, где клиент общается ежедневно"
        }
      ];
    }

    if (industryName.includes("Образование") || industryName.includes("курсы")) {
      return [
        {
          problem: "Низкое вовлечение учеников",
          solution: "Интерактивные задания и геймификация",
          impact: "Ученики проходят уроки как игру с баллами и достижениями"
        },
        {
          problem: "Высокая стоимость платформ для обучения",
          solution: "Встроенная LMS система в Telegram",
          impact: "Все инструменты обучения уже встроены в мессенджер"
        },
        {
          problem: "Сложность организации вебинаров",
          solution: "Прямые трансляции и записи в приложении",
          impact: "Студенты смотрят вебинары там же, где получают домашку"
        }
      ];
    }

    if (industryName.includes("Медицина") || industryName.includes("клиника")) {
      return [
        {
          problem: "Пропущенные приемы из-за забывчивости",
          solution: "Автоматические напоминания о визитах",
          impact: "Пациент получает уведомление за день и за час до приема"
        },
        {
          problem: "Долгое ожидание по телефону",
          solution: "Онлайн-запись на удобное время",
          impact: "Выбор врача и времени за 30 секунд без звонков"
        },
        {
          problem: "Потеря медицинской истории",
          solution: "Цифровая карта пациента всегда под рукой",
          impact: "Вся история болезни доступна врачу в один клик"
        }
      ];
    }

    // Общие преимущества для остальных отраслей
    return [
      {
        problem: "Комиссии магазинов приложений 15-30%",
        solution: "Прямые платежи через Telegram",
        impact: "Каждая транзакция проходит без посредников"
      },
      {
        problem: "40% пользователей не устанавливают приложения",
        solution: "Моментальный доступ без скачивания",
        impact: "Клиент начинает пользоваться сразу после клика"
      },
      {
        problem: "Высокая стоимость разработки нативных приложений",
        solution: "Готовые модули для быстрого запуска",
        impact: "Запуск за недели вместо месяцев разработки"
      }
    ];
  };
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
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight mb-2 min-h-[3.5rem] flex items-center">
                  {industry.name}
                </h3>

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
                <span className="font-medium">Подробнее</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      {/* Модальное окно с детальной информацией */}
      <DialogContent 
        className="max-w-5xl max-h-[90vh] overflow-hidden p-0" 
        aria-describedby={`industry-description-${industry.id}`}
      >
        <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {industry.name}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh]">
          <div className="p-6 space-y-6">
            {/* Иконка и описание */}
            <div className="flex items-start gap-4" id={`industry-description-${industry.id}`}>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                  {industry.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Ключевая информация */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-base">
                {formatText(industry.importance)}
              </p>
            </div>

            <Separator />

            {/* Ключевые преимущества */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Ключевые преимущества Telegram Mini App
              </h3>
              <div className="grid gap-2">
                {getIndustryBenefits(industry.name).map((benefit, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800/50 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-tight">
                          {benefit.solution}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-through">
                          {benefit.problem}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                          → {benefit.impact}
                        </p>
                      </div>
                    </div>
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
                {requiredModules.map((module: any, index) => {
                  const fullModule = modules?.find(m => m.number === module.number);
                  return fullModule ? (
                    <ModuleInlineModal key={index} module={fullModule} variant="required" />
                  ) : (
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
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Рекомендуемые модули */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Рекомендуемые модули
              </h3>
              <div className="grid gap-4">
                {recommendedModules.map((module: any, index) => {
                  const fullModule = modules?.find(m => m.number === module.number);
                  return fullModule ? (
                    <ModuleInlineModal key={index} module={fullModule} variant="recommended" />
                  ) : (
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
                  );
                })}
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
            <div className="flex flex-col sm:flex-row gap-3 pt-6 pb-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12">
                Получить прототип
              </Button>
              <Button variant="outline" className="flex-1 h-12">
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
  const [selectedCategory, setSelectedCategory] = useState("ВСЕ НИШИ");

  const { data: industries, isLoading, error } = useQuery<Industry[]>({
    queryKey: ['/api/industries'],
  });

  const { data: modules } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const filteredIndustries = industries?.filter(industry => {
    const matchesSearch = !searchTerm.trim() || 
      industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.importance.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "ВСЕ НИШИ" || industry.category === selectedCategory;
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
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки ниш</h1>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
              Бизнес-ниши для Telegram Mini Apps
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Проверенные решения для {totalIndustries} перспективных ниш с готовыми модулями и рекомендациями по внедрению
            </p>
          </div>

          {/* Поиск и фильтры */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl border border-blue-200 dark:border-blue-700 p-6 max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
                <Input
                  placeholder="Поиск по названию ниши..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-blue-800 border-blue-300 dark:border-blue-600 placeholder:text-blue-500 dark:placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        : "bg-white dark:bg-blue-700 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-600 border-blue-200 dark:border-blue-600"
                    }`}
                  >
                    {category === "ВСЕ НИШИ" ? `Все (${totalIndustries})` : category}
                  </Button>
                ))}
              </div>
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
              Ниши не найдены
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Попробуйте изменить критерии поиска или выбрать другую категорию
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Найдено {filteredIndustries.length} ниш
                {selectedCategory !== "ВСЕ НИШИ" && ` в категории "${selectedCategory}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIndustries.map((industry) => (
                <IndustryCard key={industry.id} industry={industry} modules={modules || []} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}