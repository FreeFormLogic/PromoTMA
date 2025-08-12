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
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { type Module, type Industry, type USP } from "@shared/schema";
import { PainPointsSection } from "@/components/PainPointsSection";
import { AIChat } from "@/components/AIChat";
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
                <h2 className="text-4xl font-bold mb-4">Telegram Mini Apps за 1 день</h2>
                <p className="text-xl mb-6 text-blue-100">
                  Полноценные веб-приложения внутри Telegram без установки. Запуск за 1-5 дней вместо месяцев разработки.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">$300</div>
                    <div className="text-sm text-blue-100">вместо $10,000</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">1 день</div>
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
                    <Check className="w-4 h-4 text-success mr-2" />
                    210+ готовых модулей
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-success mr-2" />
                    Интеграция популярных платежей: Международные, Российские, Крипта, GoPay
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-success mr-2" />
                    900+ млн пользователей Telegram
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>



        {/* AI Chat Section - Compact */}
        {!chatMinimized && (
          <section className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                AI подбор модулей для вашего бизнеса
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-sm">
                Расскажите о вашем бизнесе, и AI подберет идеальные модули из 210+ решений
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <div className="h-96">
                <AIChat 
                  onAnalysisUpdate={setBusinessAnalysis}
                  onModulesUpdate={setAiRecommendedModules}
                  isMinimized={chatMinimized}
                  onToggleMinimize={() => setChatMinimized(!chatMinimized)}
                />
              </div>
            </div>
          </section>
        )}

        {/* Floating Chat Button */}
        {chatMinimized && (
          <AIChat 
            onAnalysisUpdate={setBusinessAnalysis}
            onModulesUpdate={setAiRecommendedModules}
            isMinimized={chatMinimized}
            onToggleMinimize={() => setChatMinimized(!chatMinimized)}
          />
        )}

        {/* Recommended Modules Section */}
        {aiRecommendedModules.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Рекомендованные модули ({aiRecommendedModules.length})
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Специально подобраны для вашего бизнеса на основе AI-анализа
                </p>
                <div className="space-y-3">
                  {aiRecommendedModules.slice(0, 6).map((module) => (
                    <Card 
                      key={module.id} 
                      className="p-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all border-l-4 border-l-primary/20 hover:border-l-primary"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary">
                              Модуль {module.number}
                            </span>
                            <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                              {module.category}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{module.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {module.description}
                          </p>
                          {/* AI Explanation - More specific and actionable */}
                          <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 border-l-2 border-blue-200">
                            <span className="font-medium">Почему важно:</span> {getPersonalizedExplanation(module, businessAnalysis)}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="shrink-0 ml-2 hover:bg-primary/10"
                          onClick={() => {/* TODO: Open module modal */}}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
{/* Removed "show more modules" section - AI now shows only relevant modules gradually */}
                </div>
              </Card>
            </motion.div>
          </section>
        )}

        {/* Quick Stats - Compact */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Готовые решения для бизнеса</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold mb-1">От $300</div>
                <div className="text-xs opacity-90">Стартовая цена</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold mb-1">210+</div>
                <div className="text-xs opacity-90">Модулей</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold mb-1">1-5</div>
                <div className="text-xs opacity-90">Дней до запуска</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg text-center">
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-xs opacity-90">Поддержка</div>
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
                <div className="text-lg font-bold text-white">210+</div>
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

        {/* Compact Comparison */}
        <section className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Зачем переплачивать?</h2>
            <p className="text-gray-600">Сравните традиционную разработку с Telegram Mini Apps</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <X className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="font-semibold text-red-800">Традиционная разработка</h3>
                </div>
                <div className="space-y-2 text-sm text-red-700">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">$</span>
                    $7,000 - $25,000
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">⏱</span>
                    6-12 месяцев разработки
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">📱</span>
                    Нужно устанавливать приложение
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">👥</span>
                    Сложно привлекать пользователей
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800">Telegram Mini Apps</h3>
                </div>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2">$</span>
                    От $300 + от $15/месяц
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2">⚡</span>
                    1-5 дней запуск
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2">📲</span>
                    Работает внутри Telegram
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2">🌍</span>
                    900+ млн готовых пользователей
                  </div>
                </div>
              </div>
            </div>
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
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Telegram Mini Apps
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Только через Telegram
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Преимущества</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>✓ 210+ готовых модулей</li>
                <li>✓ 25+ отраслевых ниш</li>
                <li>✓ Запуск за 1-5 дней</li>
                <li>✓ $300 вместо $25,000</li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-400 text-sm">
            © 2025 Telegram Mini Apps Directory
          </div>
        </div>
      </footer>

      {/* AI Chat Minimize Button - Floating */}
      {chatMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setChatMinimized(false)}
            className="rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90"
            title="Открыть AI чат"
          >
            <Bot className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
