import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Zap,
  Target,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Rocket,
  Shield,
  BarChart3
} from "lucide-react";

// Import module images
import ecommerceImage from "@assets/generated_images/E-commerce_module_interface_f0d6b6ed.png";
import marketingImage from "@assets/generated_images/Marketing_analytics_dashboard_c85e271e.png";
import loyaltyImage from "@assets/generated_images/Loyalty_gamification_system_19d9d6e8.png";
import educationImage from "@assets/generated_images/Education_platform_modules_2a5d8084.png";
import serviceImage from "@assets/generated_images/Service_booking_system_19637b63.png";
import fintechImage from "@assets/generated_images/Fintech_payment_system_d0f81847.png";
import contentImage from "@assets/generated_images/Content_management_system_c0388ba4.png";

interface ModuleModalProps {
  module: any;
  isOpen: boolean;
  onClose: () => void;
}

const categoryImages: Record<string, string> = {
  "E-COMMERCE И ПРОДАЖИ": ecommerceImage,
  "МАРКЕТИНГ И АНАЛИТИКА": marketingImage,
  "ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ": loyaltyImage,
  "ОБРАЗОВАНИЕ И ОБУЧЕНИЕ": educationImage,
  "СЕРВИСЫ И БРОНИРОВАНИЕ": serviceImage,
  "ФИНТЕХ И ПЛАТЕЖИ": fintechImage,
  "КОНТЕНТ И МЕДИА": contentImage,
  "ИНТЕГРАЦИИ И API": marketingImage
};

const moduleFeatures: Record<string, any> = {
  "Витрина товаров с AI-описаниями и умными фильтрами": {
    features: [
      "Автоматическая генерация SEO-описаний через GPT-4",
      "20+ типов фильтров с умной сортировкой",
      "Визуальный поиск по фото товара",
      "Персонализация под каждого пользователя",
      "Адаптивная сетка товаров под любой экран"
    ],
    benefits: {
      conversion: 45,
      time: 70,
      sales: 35,
      satisfaction: 60
    },
    implementation: "1-2 дня",
    price: "Включено в базовый пакет"
  },
  "Корзина с сохранением между сессиями": {
    features: [
      "Облачная синхронизация между устройствами",
      "Восстановление брошенных корзин",
      "Умные напоминания о забытых товарах",
      "Расчет доставки в реальном времени",
      "Применение промокодов и скидок"
    ],
    benefits: {
      conversion: 30,
      abandonment: -40,
      orderValue: 25,
      repeat: 35
    },
    implementation: "1 день",
    price: "Включено в базовый пакет"
  }
};

export function ModuleModal({ module, isOpen, onClose }: ModuleModalProps) {
  const moduleImage = categoryImages[module?.category] || ecommerceImage;
  const details = moduleFeatures[module?.name] || {
    features: [
      "Автоматизация ключевых процессов",
      "Интеграция с существующими системами",
      "Аналитика и отчетность в реальном времени",
      "Масштабируемость под любой объем",
      "Техническая поддержка 24/7"
    ],
    benefits: {
      efficiency: 40,
      costs: -30,
      quality: 50,
      speed: 60
    },
    implementation: "2-3 дня",
    price: "От $50/месяц"
  };

  if (!module) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{module.name}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{module.category}</Badge>
            {module.isPopular && (
              <Badge className="bg-orange-100 text-orange-800">Популярный</Badge>
            )}
          </div>
        </DialogHeader>

        {/* Module Image */}
        <div className="h-48 overflow-hidden rounded-lg bg-gradient-to-b from-telegram/10 to-transparent">
          <img 
            src={moduleImage} 
            alt={module.name}
            className="w-full h-full object-cover"
          />
        </div>

        <Tabs defaultValue="features" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Возможности</TabsTrigger>
            <TabsTrigger value="benefits">Преимущества</TabsTrigger>
            <TabsTrigger value="implementation">Внедрение</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-telegram" />
                  Основные функции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <ul className="space-y-3">
                  {details.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-telegram" />
                  Влияние на бизнес
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(details.benefits).map(([key, value]: [string, any]) => {
                  const labels: Record<string, string> = {
                    conversion: "Рост конверсии",
                    time: "Экономия времени",
                    sales: "Увеличение продаж",
                    satisfaction: "Лояльность клиентов",
                    efficiency: "Эффективность",
                    costs: "Снижение затрат",
                    quality: "Качество сервиса",
                    speed: "Скорость работы",
                    abandonment: "Снижение отказов",
                    orderValue: "Средний чек",
                    repeat: "Повторные покупки"
                  };
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{labels[key] || key}</span>
                        <span className={`text-lg font-bold ${value > 0 ? 'text-success' : 'text-destructive'}`}>
                          {value > 0 ? '+' : ''}{Math.abs(value)}%
                        </span>
                      </div>
                      <Progress value={Math.abs(value)} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-telegram" />
                  Быстрый старт
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-8 h-8 text-telegram mx-auto mb-2" />
                    <p className="text-xl font-bold">{details.implementation}</p>
                    <p className="text-xs text-gray-600">До запуска</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-xl font-bold">{details.price}</p>
                    <p className="text-xs text-gray-600">Стоимость</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-xl font-bold">24/7</p>
                    <p className="text-xs text-gray-600">Поддержка</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Процесс внедрения:</h4>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-telegram">1.</span>
                      <span>Настройка модуля под ваши требования</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-telegram">2.</span>
                      <span>Интеграция с существующими системами</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-telegram">3.</span>
                      <span>Тестирование и оптимизация</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-telegram">4.</span>
                      <span>Обучение вашей команды</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-telegram">5.</span>
                      <span>Запуск и мониторинг результатов</span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1 bg-success hover:bg-success/90">
                Подключить модуль
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