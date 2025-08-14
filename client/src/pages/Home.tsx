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
// AIChat removed from Home page - only accessible via /ai-chat route
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
  console.log('Home component rendering');
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis | null>(null);
  const [aiRecommendedModules, setAiRecommendedModules] = useState<Module[]>([]);
  // AI Chat state removed - chat is now on dedicated page

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
                onClick={() => window.location.href = '/ai-chat'}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all animate-[pulse-scale_2s_ease-in-out_infinite]"
              >
                <Bot className="w-6 h-6 mr-3" />
                AI-конструктор APP
              </Button>
            </div>
          </div>
        </section>

        {/* AI Chat removed from Home page - only accessible via /ai-chat route */}



{/* Recommended Modules section removed - modules now displayed directly in AI chat */}

        {/* Quick Stats - Compact */}
        <section className="mb-12 mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Готовые решения для бизнеса</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold mb-1">От $300</div>
                <div className="text-xs opacity-70">Стартовая цена</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold mb-1">260+</div>
                <div className="text-xs opacity-70">Модулей</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold mb-1">1-5</div>
                <div className="text-xs opacity-70">Дней до запуска</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 p-4 rounded-lg text-center border border-blue-200">
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

        {/* Cost Comparison Section - Complete Redesign */}
        <section className="mb-12 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Зачем переплачивать?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Сравните традиционную разработку с готовыми модульными решениями Telegram Mini Apps
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Traditional Development */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Традиционная разработка</h3>
                    <div className="text-4xl font-bold text-gray-700 mb-1">$10,000</div>
                    <p className="text-gray-600">Высокие затраты на разработку</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">6-12 месяцев разработки</p>
                        <p className="text-gray-600 text-sm">Долгие сроки до запуска продукта</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Установка приложения</p>
                        <p className="text-gray-600 text-sm">Барьер для пользователей, потеря аудитории</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Привлечение пользователей</p>
                        <p className="text-gray-600 text-sm">Большие затраты на маркетинг и продвижение</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Команда разработчиков</p>
                        <p className="text-gray-600 text-sm">Поиск и содержание штатных специалистов</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Telegram Mini Apps */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200 relative overflow-hidden shadow-xl">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                      ЭКОНОМИЯ 60%
                    </Badge>
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-0">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">Telegram Mini Apps</h3>
                    <div className="text-4xl font-bold text-blue-700 mb-1">от $300</div>
                    <p className="text-blue-700">Готовые решения под ключ</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">2-5 дней до запуска</p>
                        <p className="text-blue-700 text-sm">Мгновенный результат с готовыми модулями</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">Работает внутри Telegram</p>
                        <p className="text-blue-700 text-sm">Без установки, сразу доступно пользователям</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">900+ млн готовых пользователей</p>
                        <p className="text-blue-700 text-sm">Огромная аудитория уже в Telegram</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-blue-900">260+ готовых модулей</p>
                        <p className="text-blue-700 text-sm">Проверенные решения для любого бизнеса</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Button
                onClick={() => {
                  const message = encodeURIComponent(
                    "Привет! Интересует разработка Telegram Mini App. Рассмотрел каталог модулей на вашей платформе. Можете рассказать подробнее о возможностях и стоимости?"
                  );
                  window.open(`https://t.me/balilegend?text=${message}`, '_blank');
                }}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              >Создать приложение</Button>
            </motion.div>
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
