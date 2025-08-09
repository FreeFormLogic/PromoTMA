import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Shield
} from "lucide-react";

interface IndustryModalProps {
  industry: any;
  isOpen: boolean;
  onClose: () => void;
}

// Industry-specific USPs and impact metrics
const industryMetrics: Record<string, any> = {
  "Розничная торговля и e-commerce": {
    uspTitle: "Ваш магазин в кармане у 900 млн пользователей",
    usps: [
      "Снижение комиссий с 30% до 0% при прямых продажах",
      "Увеличение конверсии на 40% за счет удобства Telegram",
      "Сокращение времени на заказ до 30 секунд",
      "Автоматизация 80% рутинных операций"
    ],
    metrics: {
      revenue: { value: 35, label: "Рост выручки" },
      costs: { value: 60, label: "Снижение затрат" },
      efficiency: { value: 80, label: "Автоматизация" },
      satisfaction: { value: 45, label: "Лояльность клиентов" }
    },
    roi: "Окупаемость за 2-3 недели",
    painKillers: [
      { pain: "Высокие комиссии маркетплейсов", solution: "Прямые продажи без комиссий" },
      { pain: "Сложность привлечения клиентов", solution: "900 млн активных пользователей Telegram" },
      { pain: "Дорогая разработка сайта", solution: "Готовое решение за $300" }
    ]
  },
  "Рестораны и доставка еды": {
    uspTitle: "Прямые заказы без комиссий агрегаторов",
    usps: [
      "Экономия до $5,000/месяц на комиссиях",
      "Увеличение среднего чека на 25%",
      "Повторные заказы растут на 50%",
      "Полный контроль над клиентской базой"
    ],
    metrics: {
      revenue: { value: 40, label: "Рост прибыли" },
      costs: { value: 70, label: "Экономия на комиссиях" },
      efficiency: { value: 65, label: "Скорость обработки" },
      satisfaction: { value: 55, label: "Довольные клиенты" }
    },
    roi: "Окупаемость за 1-2 недели",
    painKillers: [
      { pain: "30% комиссия агрегаторов", solution: "0% комиссия при прямых заказах" },
      { pain: "Нет доступа к клиентам", solution: "Полная клиентская база с контактами" },
      { pain: "Зависимость от платформ", solution: "Независимый канал продаж" }
    ]
  }
};

export function IndustryModal({ industry, isOpen, onClose }: IndustryModalProps) {
  const metrics = industryMetrics[industry.name] || {
    uspTitle: "Готовое решение для вашего бизнеса",
    usps: [
      "Снижение операционных затрат на 40%",
      "Увеличение конверсии в 2 раза",
      "Автоматизация 70% процессов",
      "Рост лояльности клиентов на 35%"
    ],
    metrics: {
      revenue: { value: 30, label: "Рост выручки" },
      costs: { value: 50, label: "Снижение затрат" },
      efficiency: { value: 70, label: "Автоматизация" },
      satisfaction: { value: 40, label: "Лояльность" }
    },
    roi: "Окупаемость за 3-4 недели",
    painKillers: []
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{industry.name}</DialogTitle>
          <p className="text-gray-600 mt-2">{industry.description}</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="problems">Проблемы</TabsTrigger>
            <TabsTrigger value="solutions">Решения</TabsTrigger>
            <TabsTrigger value="impact">Влияние</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-telegram" />
                  {metrics.uspTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {metrics.usps.map((usp: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <span>{usp}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-4 bg-telegram/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-telegram">ROI:</span>
                    <span className="text-lg font-bold">{metrics.roi}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Рекомендуемые модули</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {industry.solutions.slice(0, 6).map((solution: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{solution}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Включено
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Главные проблемы отрасли
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics.painKillers.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.painKillers.map((item: any, index: number) => (
                      <div key={index} className="border-l-4 border-destructive pl-4">
                        <p className="font-semibold text-destructive mb-1">{item.pain}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-success" />
                          <span className="text-success font-medium">{item.solution}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {industry.painPoints.map((pain: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="solutions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Наши решения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {industry.solutions.map((solution: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-success/5 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">{solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-telegram" />
                  Влияние на бизнес-метрики
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(metrics.metrics).map(([key, metric]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{metric.label}</span>
                      <span className="text-lg font-bold text-telegram">+{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
                
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-2xl font-bold">$300</p>
                    <p className="text-xs text-gray-600">Стартовая цена</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-telegram mx-auto mb-2" />
                    <p className="text-2xl font-bold">1-5</p>
                    <p className="text-xs text-gray-600">Дней до запуска</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-xs text-gray-600">Поддержка</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1 bg-success hover:bg-success/90">
                Получить персональное предложение
              </Button>
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}