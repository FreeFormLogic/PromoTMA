import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
          <DialogDescription className="text-gray-600">
            {module.description}
          </DialogDescription>
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

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-telegram" />
                Основные возможности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {details.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1 bg-telegram hover:bg-telegram/90 text-white">
              Подключить модуль
            </Button>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}