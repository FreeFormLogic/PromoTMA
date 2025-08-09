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
      { pain: "Высокие комиссии маркетплейсов", solution: "Прямые продажи через мини-приложение с комиссией 0%" },
      { pain: "Сложность привлечения клиентов", solution: "Доступ к 900 млн пользователей через удобный интерфейс Telegram" },
      { pain: "Дорогая разработка интернет-магазина", solution: "Готовое решение интернет-магазина за $300 с полным функционалом" }
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
      { pain: "30% комиссия агрегаторов", solution: "Система прямых заказов через Telegram с комиссией 0%" },
      { pain: "Нет доступа к клиентам", solution: "Собственная база клиентов с полными контактами и историей заказов" },
      { pain: "Зависимость от Яндекс.Еды и Деливери", solution: "Независимый канал приема заказов в собственности ресторана" }
    ]
  }
};

// Required modules for each industry
const requiredModules: Record<string, string[]> = {
  "Розничная торговля и e-commerce": [
    "Витрина товаров с AI-описаниями и умными фильтрами",
    "Корзина с сохранением между сессиями", 
    "Автоматический прием платежей",
    "Система отзывов и рейтингов товаров"
  ],
  "Рестораны и доставка еды": [
    "Витрина товаров с AI-описаниями и умными фильтрами",
    "Автоматический прием платежей",
    "Система статусов заказов с real-time трекингом",
    "Интеграция с СДЭК, Boxberry, Почтой России"
  ],
  "Гостиничный бизнес и туризм": [
    "Система бронирования номеров",
    "Календарь доступности",
    "Автоматический прием платежей", 
    "CRM для гостей",
    "Управление тарифами по сезонам",
    "Интеграция с booking.com"
  ],
  "Медицина и здоровье": [
    "Запись на прием к врачам",
    "Электронная медкарта",
    "Телемедицинские консультации",
    "Система напоминаний о приеме лекарств",
    "Интеграция с медоборудованием",
    "HIPAA-совместимое хранение данных"
  ],
  "Образование и онлайн-курсы": [
    "LMS платформа с прогрессом и сертификатами",
    "Платформа курсов с видео и интерактивными тестами",
    "Автоматический прием платежей"
  ],
  "Красота и wellness": [
    "Календарь записи с автоматическим подтверждением",
    "Онлайн-запись с календарем в реальном времени",
    "Автоматический прием платежей"
  ],
  "Фитнес и спорт": [
    "Расписание тренировок и занятий",
    "Система абонементов и заморозок",
    "Трекер физической активности",
    "Планы питания и калории",
    "Онлайн-тренировки и видео",
    "Социальная сеть спортсменов"
  ],
  "Недвижимость": [
    "Каталог объектов с фильтрами",
    "Виртуальные туры 360°",
    "Калькулятор ипотеки",
    "CRM для риелторов",
    "Планировщик просмотров",
    "Юридическое сопровождение сделок"
  ],
  "Автомобильный бизнес": [
    "Каталог автомобилей с характеристиками",
    "Система trade-in оценки",
    "Запись на тест-драйв",
    "Калькулятор кредита и лизинга",
    "CRM для автосалонов",
    "Сервисная книжка и ТО"
  ]
};

// Recommended modules for each industry  
const recommendedModules: Record<string, string[]> = {
  "Розничная торговля и e-commerce": [
    "Управление складом и остатками",
    "Система скидок и промокодов",
    "Персонализированные рекомендации",
    "Программа лояльности с начислением баллов", 
    "CRM для управления клиентами",
    "Система лидов и воронки продаж"
  ],
  "Рестораны и доставка еды": [
    "Система отзывов и рейтингов товаров",
    "Программа лояльности с начислением баллов",
    "Push-уведомления с персонализацией по поведению",
    "CRM для управления клиентами"
  ],
  "Образование и онлайн-курсы": [
    "Система сертификатов и дипломов с верификацией",
    "Домашние задания с проверкой и обратной связью",
    "Вебинары и live-стримы с чатом",
    "Система отзывов и рейтингов товаров"
  ],
  "Красота и wellness": [
    "Программа лояльности с начислением баллов",
    "Система отзывов и рейтингов товаров", 
    "CRM для управления клиентами",
    "Push-уведомления с персонализацией по поведению"
  ]
};

export function IndustryModal({ industry, isOpen, onClose }: IndustryModalProps) {
  const metrics = industryMetrics[industry.name] || {
    uspTitle: "Индивидуальные решения для вашей отрасли",
    usps: [
      "Модули адаптированы под специфику бизнеса",
      "Соответствие отраслевым требованиям и стандартам", 
      "Проверенные решения с измеримым результатом",
      "Поддержка интеграции с существующими системами"
    ],
    metrics: {
      revenue: { value: 25, label: "Рост выручки" },
      costs: { value: 35, label: "Снижение затрат" },
      efficiency: { value: 45, label: "Автоматизация" },
      satisfaction: { value: 30, label: "Лояльность" }
    },
    roi: "Окупаемость индивидуально",
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="solutions">Проблемы и решения</TabsTrigger>
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
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Рекомендуемые модули
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {(recommendedModules[industry.name] || []).map((module: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{module}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        Рекомендуется
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

          <TabsContent value="solutions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Проблемы и решения
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics.painKillers.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.painKillers.map((item: any, index: number) => (
                      <div key={index} className="border-l-4 border-destructive/20 pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <p className="font-semibold text-destructive mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {item.pain}
                        </p>
                        <p className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                          <span className="text-success font-medium">{item.solution}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {industry.painPoints.slice(0, 3).map((pain: string, index: number) => (
                      <div key={index} className="border-l-4 border-destructive/20 pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <p className="font-semibold text-destructive mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {pain}
                        </p>
                        <p className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                          <span className="text-success font-medium">Решение разрабатывается индивидуально под ваши задачи</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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