import { useQuery } from "@tanstack/react-query";
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
  Puzzle
} from "lucide-react";
import { Link } from "wouter";
import { type Module, type Industry, type USP } from "@shared/schema";
import { PainPointsSection } from "@/components/PainPointsSection";

export default function Home() {
  const { data: modules = [], isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const { data: industries = [], isLoading: industriesLoading } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });

  const { data: usps = [], isLoading: uspsLoading } = useQuery<USP[]>({
    queryKey: ["/api/usps"],
  });

  const moduleCategories = modules.reduce((acc, module) => {
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
                    25+ отраслевых ниш
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

        {/* Comparison Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Сравнение подходов</h2>
            <p className="text-gray-600">Традиционная разработка vs наше решение</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle className="text-red-800">Традиционная разработка</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-red-500" />
                    <span>$7,000 - $25,000</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-red-500" />
                    <span>6-12 месяцев разработки</span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-red-500" />
                    <span>Нужно устанавливать приложение</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-red-500" />
                    <span>Сложно привлекать пользователей</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-green-800">Наше решение</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-success" />
                    <span>От $300 + от $15/месяц</span>
                  </li>
                  <li className="flex items-center">
                    <Rocket className="w-5 h-5 mr-3 text-success" />
                    <span>1-5 дней запуск</span>
                  </li>
                  <li className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-3 text-success" />
                    <span>Работает внутри Telegram</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-success" />
                    <span>900+ млн готовых пользователей</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pain Points Interactive Section */}
        <PainPointsSection />

        {/* Quick Stats */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Готовые решения для бизнеса</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-3xl font-bold text-telegram mb-1">60+</div>
              <div className="text-sm text-gray-700 font-medium">Готовых модулей</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-3xl font-bold text-success mb-1">30+</div>
              <div className="text-sm text-gray-700 font-medium">Отраслевых ниш</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-1">25+</div>
              <div className="text-sm text-gray-700 font-medium">Ключевых УТП</div>
            </Card>
            <Card className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="text-3xl font-bold text-orange-600 mb-1">$300</div>
              <div className="text-sm text-gray-700 font-medium">Стартовая цена</div>
            </Card>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Навигация по разделам</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/modules">
              <Card className="cursor-pointer hover:shadow-md hover:scale-105 transition-all p-4 text-center group">
                <Puzzle className="w-6 h-6 text-telegram mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Модули</h3>
                <p className="text-xs text-gray-600">60+ готовых функций</p>
              </Card>
            </Link>

            <Link href="/industries">
              <Card className="cursor-pointer hover:shadow-md hover:scale-105 transition-all p-4 text-center group">
                <Building2 className="w-6 h-6 text-telegram mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Отрасли</h3>
                <p className="text-xs text-gray-600">30+ бизнес-ниш</p>
              </Card>
            </Link>

            <Link href="/pricing">
              <Card className="cursor-pointer hover:shadow-md hover:scale-105 transition-all p-4 text-center group">
                <DollarSign className="w-6 h-6 text-telegram mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Цены</h3>
                <p className="text-xs text-gray-600">$300 vs $10,000</p>
              </Card>
            </Link>

            <Link href="/process">
              <Card className="cursor-pointer hover:shadow-md hover:scale-105 transition-all p-4 text-center group">
                <Rocket className="w-6 h-6 text-telegram mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Процесс</h3>
                <p className="text-xs text-gray-600">1-5 дней запуск</p>
              </Card>
            </Link>
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
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xl font-bold">1 день</div>
                <div className="text-xs text-blue-100">До прототипа</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xl font-bold">1-5 дней</div>
                <div className="text-xs text-blue-100">До запуска</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-xl font-bold">24/7</div>
                <div className="text-xs text-blue-100">Поддержка</div>
              </div>
            </div>
          </Card>
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
    </div>
  );
}
