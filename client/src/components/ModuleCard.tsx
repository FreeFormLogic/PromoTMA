import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Module } from "@shared/schema";

// Import module images
import ecommerceImage from "@assets/generated_images/E-commerce_product_catalog_interface_bf1d7b3b.png";
import shoppingCartImage from "@assets/generated_images/Shopping_cart_mobile_interface_60e8b905.png";
import paymentImage from "@assets/generated_images/Automated_payment_processing_380a86a6.png";
import crmImage from "@assets/generated_images/CRM_customer_management_1b22c7f6.png";
import inventoryImage from "@assets/generated_images/Inventory_management_system_71cf0ab5.png";
import reviewsImage from "@assets/generated_images/Review_and_rating_system_29779a06.png";
import marketingImage from "@assets/generated_images/Marketing_analytics_dashboard_db9f02b6.png";
import loyaltyImage from "@assets/generated_images/Loyalty_gamification_interface_1cba6de5.png";
import educationImage from "@assets/generated_images/Online_learning_platform_b4311535.png";
import bookingImage from "@assets/generated_images/Appointment_booking_calendar_ea7eefd6.png";
import fintechImage from "@assets/generated_images/Digital_payment_processing_226f7e9b.png";
import contentImage from "@assets/generated_images/Content_management_system_46fe7fd7.png";

interface ModuleCardProps {
  module: Module;
}

// Module images mapping
const moduleImages: Record<string, string> = {
  "Витрина товаров с AI-описаниями и умными фильтрами": ecommerceImage,
  "Корзина с сохранением между сессиями": shoppingCartImage,
  "Автоматический прием платежей": paymentImage,
  "CRM для управления клиентами": crmImage,
  "Управление складом и остатками": inventoryImage,
  "Система отзывов и рейтингов товаров": reviewsImage,
  "Система лидов и воронки продаж": marketingImage,
  "Персонализированные рекомендации": marketingImage,
  "A/B тестирование интерфейса": marketingImage,
  "Программа лояльности с начислением баллов": loyaltyImage,
  "Ежедневные задания и streak-система": loyaltyImage,
  "LMS платформа с прогрессом и сертификатами": educationImage,
  "Платформа курсов с видео и интерактивными тестами": educationImage,
  "Календарь записи с автоматическим подтверждением": bookingImage,
  "Онлайн-запись с календарем в реальном времени": bookingImage,
  "Прием Telegram Stars (0% комиссия)": fintechImage,
  "Мультивалютный кошелек с конвертацией": fintechImage,
  "Лента новостей с алгоритмической подачей": contentImage,
  "Встроенный блог с редактором и SEO": contentImage,
  "Стриминг видео с адаптивным качеством": contentImage
};

export function ModuleCard({ module }: ModuleCardProps) {
  const moduleImage = moduleImages[module.name] || ecommerceImage;

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-b from-telegram/10 to-transparent rounded-lg overflow-hidden">
              <img 
                src={moduleImage} 
                alt={module.name}
                className="w-full h-full object-cover"
              />
            </div>
            {module.isPopular && (
              <Badge variant="secondary" className="text-xs">
                Популярный
              </Badge>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {module.name}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {module.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700">Возможности:</h4>
          <ul className="space-y-1">
            {(module.features as string[]).slice(0, 3).map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <div className="w-1 h-1 bg-success rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
            {(module.features as string[]).length > 3 && (
              <li className="text-xs text-gray-400">
                +{(module.features as string[]).length - 3} возможностей...
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
