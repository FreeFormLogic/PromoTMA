import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Rocket, 
  DollarSign, 
  Users, 
  Star,
  Check,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  X,
  Phone,
  Mail,
  Building2,
  Puzzle,
  Bot,
  Sparkles,
  TrendingUp,
  Target,
  Eye,
  Smartphone
} from "lucide-react";
import { Link } from "wouter";
import { type Module, type Industry, type USP } from "@shared/schema";
import { PainPointsSection } from "@/components/PainPointsSection";
import AIChat from "@/components/AIChat";
import { motion, AnimatePresence } from "framer-motion";

interface BusinessAnalysis {
  industry: string;
  size: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
  persona: string;
}

// Personalized AI explanation generator for modules
function getPersonalizedExplanation(module: Module, analysis: BusinessAnalysis | null): string {
  if (!analysis) {
    return `Решает ключевые задачи категории ${module.category}`;
  }

  // Create personalized explanations based on business analysis
  const businessType = analysis.industry.toLowerCase();
  const moduleCategory = module.category;
  const moduleName = module.name.toLowerCase();
  
  // Specific explanations for different business types and modules
  if (businessType.includes('курс') || businessType.includes('обучен') || businessType.includes('образован')) {
    if (moduleCategory === 'ОБРАЗОВАНИЕ') {
      if (moduleName.includes('платформа курсов')) return 'Создаст структурированную систему обучения с отслеживанием прогресса ваших учеников';
      if (moduleName.includes('социальное обучение')) return 'Построит активное сообщество учеников для взаимной поддержки и мотивации';
      if (moduleName.includes('тест')) return 'Поможет оценивать знания и повысить вовлеченность учеников';
    }
    if (moduleCategory === 'ВОВЛЕЧЕНИЕ') {
      return 'Повысит мотивацию учеников завершать курсы до конца через игровые механики';
    }
    if (moduleCategory === 'E-COMMERCE') {
      return 'Позволит продавать курсы и дополнительные материалы прямо в Telegram';
    }
  }
  
  if (businessType.includes('магазин') || businessType.includes('товар') || businessType.includes('продаж')) {
    if (moduleCategory === 'E-COMMERCE') {
      if (moduleName.includes('корзин')) return 'Создаст удобный процесс покупки с высокой конверсией';
      if (moduleName.includes('предзаказ')) return 'Поможет управлять дефицитными товарами и планировать закупки';
      if (moduleName.includes('сравнение')) return 'Поможет покупателям быстрее выбрать нужный товар из ассортимента';
    }
  }
  
  if (businessType.includes('услуг') || businessType.includes('запись') || businessType.includes('консультац')) {
    if (moduleCategory === 'БРОНИРОВАНИЕ') {
      return 'Автоматизирует записи клиентов и сократит количество пропусков на 70%';
    }
  }

  // Default personalized explanation
  const categoryExplanations: Record<string, string> = {
    'E-COMMERCE': 'Увеличит продажи и упростит процесс покупки для ваших клиентов',
    'МАРКЕТИНГ': 'Привлечет больше клиентов в вашу нишу и повысит конверсию',
    'ОБРАЗОВАНИЕ': 'Создаст эффективную систему обучения для вашей аудитории',
    'ВОВЛЕЧЕНИЕ': 'Повысит активность и лояльность ваших пользователей',
    'CRM': 'Автоматизирует работу с клиентами и увеличит повторные продажи',
    'БРОНИРОВАНИЕ': 'Упростит процесс записи и снизит административную нагрузку',
    'ФИНТЕХ': 'Обеспечит безопасные и удобные платежи для ваших клиентов'
  };
  
  return categoryExplanations[moduleCategory] || `Решит ключевые задачи для ${businessType} бизнеса`;
}

export default function Home() {
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis | null>(null);
  const [aiRecommendedModules, setAiRecommendedModules] = useState<Module[]>([]);
  const [showAIChat, setShowAIChat] = useState(true);
  const [chatMinimized, setChatMinimized] = useState(false);

  const { data: modules = [], isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const { data: industries = [], isLoading: industriesLoading } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });

  const { data: usps = [], isLoading: uspsLoading } = useQuery<USP[]>({
    queryKey: ["/api/usps"],
  });

  // Use AI-recommended modules if available, otherwise use all modules
  const displayModules = aiRecommendedModules.length > 0 ? aiRecommendedModules : modules;

  const moduleCategories = displayModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const uspCategories = usps.reduce((acc, usp) => {
    if (!acc[usp.category]) {
      acc[usp.category] = [];
    }
    acc[usp.category].push(usp);
    return acc;
  }, {} as Record<string, USP[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Убрали строку авторизации */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-telegram to-telegram-dark text-white rounded-2xl p-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-4">Telegram Mini Apps за&nbsp;1&nbsp;день</h2>
                <p className="text-xl mb-6 text-blue-100">
                  Полноценные веб-приложения внутри Telegram без установки. Запуск за&nbsp;1-5&nbsp;дней вместо месяцев разработки.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">$300</div>
                    <div className="text-sm text-blue-100">вместо $10,000</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">1&nbsp;день</div>
                    <div className="text-sm text-blue-100">вместо месяцев</div>
                  </div>
                </div>
                
                <Button className="bg-success hover:bg-success/90 text-white px-8 py-3 rounded-lg font-semibold">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Узнать подробнее
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-lg">Ключевые преимущества:</h3>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-blue-300 mr-2" />
                    260+ готовых модулей
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-blue-300 mr-2" />
                    Интеграция популярных платежей: Международные, Российские, Крипта, GoPay
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-blue-300 mr-2" />
                    900+ млн пользователей Telegram
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>





        {/* Hero Section with AI Chat Button */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Создайте Telegram Mini App за 1-5 дней
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                260+ готовых модулей для быстрого запуска вашего бизнеса в Telegram. 
                От $300 вместо $10,000 за традиционную разработку.
              </p>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-8">
                <h3 className="font-semibold mb-4 text-lg">Ключевые преимущества:</h3>
                <ul className="space-y-2 text-blue-100 max-w-xl mx-auto">
                  <li className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-300 mr-2" />
                    260+ готовых модулей
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-300 mr-2" />
                    Интеграция популярных платежей
                  </li>
                  <li className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-300 mr-2" />
                    900+ млн пользователей Telegram
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setChatMinimized(false)}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Bot className="w-6 h-6 mr-3" />
                AI-конструктор APP
              </Button>
            </div>
          </div>
        </section>

        {/* Full-screen AI Chat */}
        {!chatMinimized && (
          <div className="fixed inset-0 z-50 bg-white">
            <AIChat 
              onAnalysisUpdate={setBusinessAnalysis}
              onModulesUpdate={setAiRecommendedModules}
              isMinimized={false}
              onToggleMinimize={() => setChatMinimized(true)}
              currentlyDisplayedModules={aiRecommendedModules}
              isFullScreen={true}
            />
          </div>
        )}



{/* Recommended Modules section removed - modules now displayed directly in AI chat */}

        {/* Quick Stats - Compact */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Готовые решения для бизнеса</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 p-4 rounded-lg text-center border border-blue-300">
                <div className="text-2xl font-bold mb-1">От $300</div>
                <div className="text-xs opacity-70">Стартовая цена</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 p-4 rounded-lg text-center border border-blue-300">
                <div className="text-2xl font-bold mb-1">260+</div>
                <div className="text-xs opacity-70">Модулей</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 p-4 rounded-lg text-center border border-blue-300">
                <div className="text-2xl font-bold mb-1">1-5</div>
                <div className="text-xs opacity-70">Дней до запуска</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 p-4 rounded-lg text-center border border-blue-300">
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-xs opacity-70">Поддержка</div>
              </div>
            </div>
          </div>
        </section>





        {/* CTA Section */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-telegram to-telegram-dark text-white p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Готовы получить прототип завтра?</h2>
            <p className="text-blue-100 mb-4">
              Запустим ваш проект в рекордные сроки
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button className="bg-success hover:bg-success/90 text-white px-6 py-2 font-semibold">
                <MessageSquare className="w-4 h-4 mr-2" />
                Начать проект прямо сейчас
              </Button>
              <div className="text-blue-100 text-sm">
                Консультация бесплатна • Прототип за 1 день
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white/15 rounded-lg p-4">
                <div className="text-lg font-bold text-white">От $300</div>
                <div className="text-xs text-blue-100">Стартовая<br/>цена</div>
              </div>
              <div className="bg-white/15 rounded-lg p-4">
                <div className="text-lg font-bold text-white">260+</div>
                <div className="text-xs text-blue-100">Готовых<br/>модулей</div>
              </div>
              <div className="bg-white/15 rounded-lg p-4">
                <div className="text-lg font-bold text-white">1-5</div>
                <div className="text-xs text-blue-100">Дней до<br/>запуска</div>
              </div>
              <div className="bg-white/15 rounded-lg p-4">
                <div className="text-lg font-bold text-white">24/7</div>
                <div className="text-xs text-blue-100">Техническая<br/>поддержка</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Traditional vs Telegram Mini Apps Comparison */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Зачем переплачивать?</h2>
            <p className="text-gray-600 mb-8">Сравните традиционную разработку с Telegram Mini Apps</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Traditional Development */}
            <Card className="p-6 border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-red-700 text-center mb-4">Традиционная разработка</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-700">$7,000 - $10,000</div>
                    <div className="text-sm text-red-600">Высокие затраты на разработку</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-700">6-12 месяцев разработки</div>
                    <div className="text-sm text-red-600">Долгие сроки до запуска</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-700">Нужно устанавливать приложение</div>
                    <div className="text-sm text-red-600">Барьер для пользователей</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-700">Сложно привлекать пользователей</div>
                    <div className="text-sm text-red-600">Большие затраты на маркетинг</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Telegram Mini Apps */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-700 text-center mb-4">Telegram Mini Apps</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-700">От $300 + от $15/месяц</div>
                    <div className="text-sm text-blue-600">Доступные цены для любого бизнеса</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-700">1-5 дней запуск</div>
                    <div className="text-sm text-blue-600">Мгновенный результат</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-700">Работает внутри Telegram</div>
                    <div className="text-sm text-blue-600">Без установки приложений</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-700">900+ млн готовых пользователей</div>
                    <div className="text-sm text-blue-600">Огромная аудитория в Telegram</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => {
                const message = encodeURIComponent(
                  "Привет! Интересует разработка Telegram Mini App. Рассмотрел каталог модулей на вашей платформе. Можете рассказать подробнее о возможностях и стоимости?"
                );
                window.open(`https://t.me/balilegend?text=${message}`, '_blank');
              }}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Написать нам
            </Button>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="text-telegram text-2xl" />
                <h3 className="text-lg font-semibold">Mini Apps Directory</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Полноценные веб-приложения внутри Telegram за 1-5 дней.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Telegram Mini Apps
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Преимущества</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>✓ 260+ готовых модулей</li>

                <li>✓ Запуск за 1-5 дней</li>
                <li>✓ От $300 вместо $10,000</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-400 text-sm">
            © 2025 Telegram Mini Apps Directory
          </div>
        </div>
      </footer>


    </div>
  );
}
