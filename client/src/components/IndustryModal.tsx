import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

// Required modules for each industry
const requiredModules: Record<string, string[]> = {
  "Розничная торговля и e-commerce": [
    "Витрина товаров с AI-описаниями и умными фильтрами",
    "Корзина с сохранением между сессиями", 
    "Автоматический прием платежей",
    "Управление складом и остатками"
  ],
  "Рестораны и доставка еды": [
    "Система приема заказов",
    "Интеграция с курьерскими службами",
    "Автоматический прием платежей",
    "Управление меню и остатками"
  ],
  "Гостиничный бизнес и туризм": [
    "Система бронирования номеров",
    "Календарь доступности",
    "Автоматический прием платежей",
    "CRM для гостей"
  ]
};

export function IndustryModal({ industry, isOpen, onClose }: IndustryModalProps) {
  const metrics = industryMetrics[industry.name] || {
    uspTitle: "Цифровые решения для вашей отрасли",
    usps: [
      "Повышение эффективности бизнес-процессов",
      "Увеличение клиентской базы и лояльности",
      "Автоматизация рутинных операций",
      "Улучшение качества обслуживания"
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
          <DialogDescription className="text-gray-600 mt-2">
            {industry.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="problems">Проблемы</TabsTrigger>
            <TabsTrigger value="solutions">Решения</TabsTrigger>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-telegram" />
                  Обязательные модули
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {(requiredModules[industry.name] || []).map((module: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-telegram/5 rounded-lg border border-telegram/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-telegram" />
                        <span className="text-sm font-medium">{module}</span>
                      </div>
                      <Badge variant="default" className="text-xs bg-telegram">
                        Обязательно
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


        </Tabs>

        <div className="flex gap-4 mt-6">
          <Button className="flex-1 bg-telegram hover:bg-telegram/90 text-white">
            Получить персональное предложение
          </Button>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}