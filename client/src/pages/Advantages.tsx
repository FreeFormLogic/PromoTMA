import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Clock, 
  DollarSign, 
  Users,
  BarChart3,
  Star,
  CheckCircle,
  Target,
  Rocket,
  Award
} from "lucide-react";

export default function Advantages() {
  const [activeTab, setActiveTab] = useState("client");

  const clientAdvantages = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Быстрый запуск",
      description: "От идеи до готового приложения за 2-4 недели",
      roi: "Экономия 3-6 месяцев разработки",
      savings: "$50,000+"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      title: "Экономия бюджета",
      description: "Модульная система снижает стоимость на 60-80%",
      roi: "ROI уже через 3 месяца",
      savings: "$150,000+"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Готовые решения",
      description: "260+ готовых модулей для любой отрасли",
      roi: "Сокращение разработки на 70%",
      savings: "$80,000+"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-500" />,
      title: "Минимальные риски",
      description: "Проверенные решения с гарантией качества",
      roi: "Снижение рисков на 85%",
      savings: "$30,000+"
    }
  ];

  const salesArguments = [
    {
      title: "Конкурентное преимущество",
      points: [
        "260+ готовых модулей vs создание с нуля",
        "Интеграция с Telegram (2 млрд пользователей)",
        "AI-персонализация для каждого клиента",
        "Быстрый time-to-market (2-4 недели)"
      ],
      impact: "Опережение конкурентов на 6+ месяцев"
    },
    {
      title: "Финансовая эффективность",
      points: [
        "Экономия 60-80% бюджета разработки",
        "ROI через 3 месяца вместо 12-18",
        "Снижение рисков провала на 85%",
        "Масштабирование без дополнительных затрат"
      ],
      impact: "Экономия $200,000+ на первом проекте"
    },
    {
      title: "Техническое превосходство",
      points: [
        "Claude 4.0 для персонализации опыта",
        "Автоматические обновления и поддержка",
        "Интеграция с 50+ внешними сервисами",
        "Масштабирование до миллионов пользователей"
      ],
      impact: "Технологии уровня Google, Facebook"
    }
  ];

  const targetVerticals = [
    { name: "E-commerce", potential: "$2M+", growth: "+150%" },
    { name: "Финтех", potential: "$5M+", growth: "+200%" },
    { name: "Образование", potential: "$1.5M+", growth: "+120%" },
    { name: "Здравоохранение", potential: "$3M+", growth: "+180%" },
    { name: "Недвижимость", potential: "$1M+", growth: "+100%" },
    { name: "HoReCa", potential: "$800K+", growth: "+90%" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Заголовок */}
        <div className="text-center space-y-4 py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ваше преимущество
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Откройте для себя конкурентные преимущества и аргументы для успешного внедрения Telegram Mini Apps
          </p>
        </div>

        {/* Основные вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
            <TabsTrigger 
              value="client" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Преимущества для Клиента
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Аргументы для Продавца
            </TabsTrigger>
          </TabsList>

          {/* Вкладка преимуществ для клиента */}
          <TabsContent value="client" className="mt-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {clientAdvantages.map((advantage, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-700 rounded-lg">
                          {advantage.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">
                            {advantage.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {advantage.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                        {advantage.savings}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      {advantage.roi}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ROI калькулятор */}
            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  ROI калькулятор
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Средняя экономия при использовании нашей платформы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">$310,000+</div>
                    <div className="text-sm text-gray-400 mt-1">Общая экономия</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">75%</div>
                    <div className="text-sm text-gray-400 mt-1">Снижение расходов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">3 мес</div>
                    <div className="text-sm text-gray-400 mt-1">Окупаемость</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Вкладка аргументов для продажи */}
          <TabsContent value="sales" className="mt-8 space-y-8">
            <div className="space-y-6">
              {salesArguments.map((argument, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-purple-300 flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      {argument.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="space-y-3">
                          {argument.points.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                              <span className="text-gray-300">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-4 rounded-lg">
                        <div className="text-sm text-purple-300 font-medium">Ключевой результат:</div>
                        <div className="text-white font-bold mt-1">{argument.impact}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Целевые вертикали */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-300 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Целевые вертикали и потенциал роста
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Отрасли с наибольшим потенциалом для внедрения Telegram Mini Apps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {targetVerticals.map((vertical, index) => (
                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{vertical.name}</span>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {vertical.growth}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-yellow-400">{vertical.potential}</div>
                      <div className="text-xs text-gray-400">Потенциальная выручка</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Сравнительная таблица */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-300">Сравнение подходов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-3 px-4 text-gray-300">Критерий</th>
                        <th className="text-center py-3 px-4 text-red-300">Традиционная разработка</th>
                        <th className="text-center py-3 px-4 text-green-300">Наша платформа</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4 font-medium">Время разработки</td>
                        <td className="py-3 px-4 text-center text-red-300">6-12 месяцев</td>
                        <td className="py-3 px-4 text-center text-green-300">2-4 недели</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4 font-medium">Стоимость</td>
                        <td className="py-3 px-4 text-center text-red-300">$200,000-500,000</td>
                        <td className="py-3 px-4 text-center text-green-300">$40,000-100,000</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4 font-medium">Риск провала</td>
                        <td className="py-3 px-4 text-center text-red-300">60-70%</td>
                        <td className="py-3 px-4 text-center text-green-300">15%</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-3 px-4 font-medium">Поддержка</td>
                        <td className="py-3 px-4 text-center text-red-300">Дополнительные расходы</td>
                        <td className="py-3 px-4 text-center text-green-300">Включена</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы получить конкурентное преимущество?
            </h2>
            <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
              Начните с бесплатной консультации и узнайте, как наша платформа может трансформировать ваш бизнес
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Star className="w-4 h-4 mr-2" />
              Получить консультацию
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}