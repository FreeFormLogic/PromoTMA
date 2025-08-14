import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calculator,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Smartphone,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Globe,
  MessageCircle,
  ArrowRight,
  Download,
  Share,
  Heart,
  BarChart3,
  Target,
  Rocket,
  CreditCard
} from 'lucide-react';

interface AdvantageCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  advantages: Advantage[];
}

interface Advantage {
  id: string;
  title: string;
  description: string;
  impact: string;
  roi?: string;
  category: string;
  isPopular?: boolean;
}

export default function Development() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(100000);
  const [currentCAC, setCurrentCAC] = useState(500);
  const [searchTerm, setSearchTerm] = useState('');

  // Преимущества для разных категорий
  const advantages: Advantage[] = [
    // Финансовые преимущества
    {
      id: '1',
      title: '0% комиссия через Telegram Stars',
      description: 'Полностью бесплатные платежи в экосистеме Telegram',
      impact: 'Экономия до 2.16 млн ₽/год',
      roi: '300-500%',
      category: 'financial',
      isPopular: true
    },
    {
      id: '2',
      title: 'Снижение CAC на 70%',
      description: 'Стоимость привлечения клиента падает с 500₽ до 150₽',
      impact: 'Экономия 350₽ с каждого клиента',
      category: 'financial',
      isPopular: true
    },
    {
      id: '3',
      title: 'Рост среднего чека в 3-5 раз',
      description: 'Персонализация и удобство увеличивают покупки',
      impact: 'До 5x увеличение прибыли',
      category: 'financial'
    },
    
    // Технические преимущества
    {
      id: '4',
      title: 'MVP за 2 недели',
      description: 'Быстрый запуск с готовыми модулями',
      impact: 'Быстрее конкурентов в 10 раз',
      category: 'technical',
      isPopular: true
    },
    {
      id: '5',
      title: 'Автоматические обновления',
      description: 'Всегда актуальная версия без действий пользователя',
      impact: 'Нет затрат на поддержку версий',
      category: 'technical'
    },
    {
      id: '6',
      title: 'Кроссплатформенность',
      description: 'Работает на всех устройствах одинаково',
      impact: 'Экономия на разработке под iOS/Android',
      category: 'technical'
    },

    // Маркетинговые преимущества
    {
      id: '7',
      title: '900+ млн готовых пользователей',
      description: 'Огромная аудитория уже в Telegram',
      impact: 'Мгновенный доступ к аудитории',
      category: 'marketing',
      isPopular: true
    },
    {
      id: '8',
      title: 'Вирусное распространение',
      description: 'Легкий шеринг в чаты и каналы',
      impact: 'Органический рост пользователей',
      category: 'marketing'
    },
    {
      id: '9',
      title: 'Push-уведомления 95% доставка',
      description: 'Против 60% у обычных приложений',
      impact: 'Лучшее удержание пользователей',
      category: 'marketing'
    },

    // Пользовательский опыт
    {
      id: '10',
      title: 'Без установки приложения',
      description: 'Мгновенный доступ без скачивания',
      impact: 'Конверсия выше в 3 раза',
      category: 'ux',
      isPopular: true
    },
    {
      id: '11',
      title: 'Офлайн-режим работы',
      description: 'Основные функции доступны без интернета',
      impact: 'Работает всегда и везде',
      category: 'ux'
    },
    {
      id: '12',
      title: 'Нативная интеграция',
      description: 'Использует все возможности Telegram',
      impact: 'Привычный интерфейс для пользователей',
      category: 'ux'
    }
  ];

  const categories: AdvantageCategory[] = [
    {
      id: 'all',
      name: 'Все преимущества',
      icon: <Star className="w-5 h-5" />,
      count: advantages.length,
      advantages: advantages
    },
    {
      id: 'financial',
      name: 'Финансы',
      icon: <DollarSign className="w-5 h-5" />,
      count: advantages.filter(a => a.category === 'financial').length,
      advantages: advantages.filter(a => a.category === 'financial')
    },
    {
      id: 'technical',
      name: 'Технические',
      icon: <Zap className="w-5 h-5" />,
      count: advantages.filter(a => a.category === 'technical').length,
      advantages: advantages.filter(a => a.category === 'technical')
    },
    {
      id: 'marketing',
      name: 'Маркетинг',
      icon: <Target className="w-5 h-5" />,
      count: advantages.filter(a => a.category === 'marketing').length,
      advantages: advantages.filter(a => a.category === 'marketing')
    },
    {
      id: 'ux',
      name: 'UX/UI',
      icon: <Smartphone className="w-5 h-5" />,
      count: advantages.filter(a => a.category === 'ux').length,
      advantages: advantages.filter(a => a.category === 'ux')
    }
  ];

  const calculateSavings = () => {
    const telegramCAC = currentCAC * 0.3; // 70% снижение
    const savingsPerCustomer = currentCAC - telegramCAC;
    const customersPerMonth = monthlyRevenue / 1000; // примерная оценка
    const monthlySavings = savingsPerCustomer * customersPerMonth;
    const yearlySavings = monthlySavings * 12;

    return {
      savingsPerCustomer: Math.round(savingsPerCustomer),
      monthlySavings: Math.round(monthlySavings),
      yearlySavings: Math.round(yearlySavings),
      newCAC: Math.round(telegramCAC),
      roi: Math.round((yearlySavings / 50000) * 100) // ROI на основе инвестиций в 50k
    };
  };

  const savings = calculateSavings();

  const filteredAdvantages = selectedCategory === 'all' 
    ? advantages.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories.find(c => c.id === selectedCategory)?.advantages.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const generatePDF = () => {
    // Здесь будет логика генерации PDF
    console.log('Generating PDF with selected advantages');
  };

  const shareAdvantages = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Преимущества Telegram Mini Apps',
        text: 'Посмотрите, почему Telegram Mini Apps - лучшее решение для бизнеса',
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-yellow-400 text-yellow-900 text-lg px-6 py-2">
              🚀 110+ преимуществ для вашего бизнеса
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Почему Telegram Mini Apps - 
              <span className="block text-yellow-300">лучшее решение для бизнеса</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Увеличьте продажи на 40% и сэкономьте до 2.16 млн ₽/год с готовыми решениями
            </p>

            {/* Статистика */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">900+ млн</div>
                <div className="text-blue-200">пользователей в Telegram</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">70%</div>
                <div className="text-blue-200">экономия на разработке</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold mb-2">1-5 дней</div>
                <div className="text-blue-200">до запуска MVP</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 text-lg px-8 py-4 shadow-xl"
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calculator className="w-6 h-6 mr-3" />
              Рассчитать вашу выгоду
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Калькулятор экономии */}
      <section id="calculator" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Калькулятор экономии
            </h2>
            <p className="text-xl text-gray-600">
              Узнайте, сколько сэкономите на внедрении Telegram Mini Apps
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Форма калькулятора */}
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  Введите ваши данные
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="revenue">Месячная выручка (₽)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cac">Текущий CAC (стоимость привлечения клиента, ₽)</Label>
                  <Input
                    id="cac"
                    type="number"
                    value={currentCAC}
                    onChange={(e) => setCurrentCAC(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Результаты */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <TrendingUp className="w-6 h-6" />
                  Ваша экономия с Telegram Mini Apps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Новый CAC</div>
                    <div className="text-2xl font-bold text-green-600">₽{savings.newCAC}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Экономия с клиента</div>
                    <div className="text-2xl font-bold text-green-600">₽{savings.savingsPerCustomer}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Экономия в месяц</div>
                    <div className="text-2xl font-bold text-green-600">₽{savings.monthlySavings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Экономия в год</div>
                    <div className="text-3xl font-bold text-green-600">₽{savings.yearlySavings.toLocaleString()}</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">ROI в первый год</div>
                    <div className="text-4xl font-bold text-purple-600">{savings.roi}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Навигация по категориям */}
      <section className="py-8 bg-gray-50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Все преимущества</h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={generatePDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareAdvantages}
                className="flex items-center gap-2"
              >
                <Share className="w-4 h-4" />
                Поделиться
              </Button>
            </div>
          </div>

          {/* Поиск */}
          <div className="mb-6">
            <Input
              placeholder="Поиск преимуществ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Категории */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Список преимуществ */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvantages.map((advantage, index) => (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all hover:shadow-xl ${
                  advantage.isPopular 
                    ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' 
                    : 'hover:shadow-lg'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {advantage.isPopular && (
                          <Badge className="mb-2 bg-yellow-400 text-yellow-900">
                            ⭐ Популярное
                          </Badge>
                        )}
                        <CardTitle className="text-lg leading-tight">
                          {advantage.title}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(advantage.id)}
                        className="p-1"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(advantage.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{advantage.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-700">
                          {advantage.impact}
                        </span>
                      </div>
                      {advantage.roi && (
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-blue-700">
                            ROI: {advantage.roi}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAdvantages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Преимущества не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы получить все эти преимущества?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Начните экономить уже сегодня с Telegram Mini Apps от $300
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4"
                onClick={() => {
                  const message = encodeURIComponent(
                    `Привет! Рассчитал экономию на вашем калькуляторе: ₽${savings.yearlySavings.toLocaleString()}/год. Интересует разработка Telegram Mini App. Можете рассказать подробнее?`
                  );
                  window.open(`https://t.me/balilegend?text=${message}`, '_blank');
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Получить консультацию
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                onClick={() => window.location.href = '/modules'}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Посмотреть модули
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}