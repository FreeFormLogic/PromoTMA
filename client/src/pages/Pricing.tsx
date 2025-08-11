import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  X, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  Users,
  Star,
  Zap
} from "lucide-react";
import { type USP, type Objection } from "@shared/schema";

export default function Pricing() {
  const { data: usps = [] } = useQuery<USP[]>({
    queryKey: ["/api/usps"],
  });

  const { data: objections = [] } = useQuery<Objection[]>({
    queryKey: ["/api/objections"],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Прозрачное ценообразование
          </h1>
          <p className="text-gray-600">
            $300 вместо $25,000-$75,000 традиционной разработки
          </p>
        </div>

        {/* Price Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Traditional Development */}
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardHeader className="text-center bg-red-100 rounded-t-lg">
              <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-red-800">Традиционная разработка</CardTitle>
              <div className="text-3xl font-bold text-red-600 mt-2">
                $25,000 - $75,000
              </div>
              <p className="text-red-600 text-sm">+ 6-12 месяцев времени</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-center text-red-700">
                  <X className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">6-12 месяцев разработки</span>
                </li>
                <li className="flex items-center text-red-700">
                  <X className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">Нужна команда разработчиков</span>
                </li>
                <li className="flex items-center text-red-700">
                  <X className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">Высокие риски проекта</span>
                </li>
                <li className="flex items-center text-red-700">
                  <X className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">Сложная модерация в App Store</span>
                </li>
                <li className="flex items-center text-red-700">
                  <X className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">Дополнительные затраты на маркетинг</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Our Solution */}
          <Card className="border-2 border-green-200 bg-green-50/50 relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-success text-white">
              Рекомендуемый
            </Badge>
            <CardHeader className="text-center bg-green-100 rounded-t-lg">
              <div className="mx-auto w-12 h-12 bg-success rounded-full flex items-center justify-center mb-2">
                <Check className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-green-800">Наше решение</CardTitle>
              <div className="text-3xl font-bold text-success mt-2">
                $300
              </div>
              <p className="text-success text-sm">+ $15/месяц поддержка</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-3 text-success" />
                  <span className="text-sm">1-5 дней до запуска</span>
                </li>
                <li className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-3 text-success" />
                  <span className="text-sm">60+ готовых модулей</span>
                </li>
                <li className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-3 text-success" />
                  <span className="text-sm">Гарантированный результат</span>
                </li>
                <li className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-3 text-success" />
                  <span className="text-sm">Telegram экосистема (900M+ пользователей)</span>
                </li>
                <li className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-3 text-success" />
                  <span className="text-sm">0% комиссии Telegram Stars</span>
                </li>
              </ul>
              
              <Button className="w-full mt-6 bg-success hover:bg-success/90 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Начать проект
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ROI Calculator */}
        <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-900">
              💰 Калькулятор экономии
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">99%</div>
                <div className="text-sm text-blue-700">экономия на разработке</div>
                <div className="text-xs text-blue-600 mt-1">
                  $300 vs $25,000+
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                <div className="text-sm text-blue-700">экономия времени</div>
                <div className="text-xs text-blue-600 mt-1">
                  5 дней vs 6+ месяцев
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">0%</div>
                <div className="text-sm text-blue-700">комиссия платежей</div>
                <div className="text-xs text-blue-600 mt-1">
                  Telegram Stars
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key USPs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            25+ ключевых преимуществ
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {usps.slice(0, 4).map((usp) => (
              <Card key={usp.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-telegram/10 rounded-lg flex-shrink-0">
                    <Star className="w-5 h-5 text-telegram" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {usp.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {usp.description}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {usp.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Objections */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Ответы на возражения
          </h2>
          
          <div className="space-y-4">
            {objections.map((objection) => (
              <Card key={objection.id} className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  "{objection.question}"
                </h3>
                <p className="text-sm text-gray-600">
                  {objection.answer}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {objection.category}
                </Badge>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-telegram to-telegram-dark text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы сэкономить 99% бюджета?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            $300 вместо $25,000+ • 5 дней вместо 6+ месяцев • 0% комиссии
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button className="bg-success hover:bg-success/90 text-white px-8 py-3 font-semibold">
              <MessageSquare className="w-4 h-4 mr-2" />
              Обсудить проект
            </Button>
            <div className="text-blue-100 text-sm">
              Консультация бесплатна • Прототип за 1 день
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">$300</div>
              <div className="text-sm text-blue-100">Единовременно</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$15</div>
              <div className="text-sm text-blue-100">В месяц</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1-5</div>
              <div className="text-sm text-blue-100">Дней запуск</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm text-blue-100">Комиссии</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
