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

// Import all module images
import showcaseSystemImage from "@assets/generated_images/Product_showcase_system_6e15e772.png";
import cartSyncImage from "@assets/generated_images/Cart_synchronization_system_e2ad4fc7.png";
import paymentAutomationImage from "@assets/generated_images/Payment_automation_system_0e82adde.png";
import customerCrmImage from "@assets/generated_images/Customer_CRM_system_6b6b44be.png";
import inventoryControlImage from "@assets/generated_images/Inventory_control_system_e1c53b74.png";
import reviewSystemImage from "@assets/generated_images/Review_system_interface_e77f1e40.png";
import salesFunnelImage from "@assets/generated_images/Sales_funnel_analytics_35a72059.png";
import recommendationEngineImage from "@assets/generated_images/Recommendation_engine_interface_6fdb2bb8.png";
import abTestingImage from "@assets/generated_images/AB_testing_interface_6d8bd52a.png";
import loyaltyProgramImage from "@assets/generated_images/Loyalty_program_interface_4e67f31f.png";
import gamificationImage from "@assets/generated_images/Gamification_streak_system_a66cb6f3.png";
import lmsEducationImage from "@assets/generated_images/LMS_education_platform_af5ad5b0.png";
import videoCourseImage from "@assets/generated_images/Video_course_platform_b56e9407.png";
import bookingCalendarImage from "@assets/generated_images/Booking_calendar_system_efd0e54a.png";
import realtimeBookingImage from "@assets/generated_images/Realtime_booking_system_8c2c4c26.png";
import telegramStarsImage from "@assets/generated_images/Telegram_Stars_payment_dc27b5b6.png";
import multiCurrencyWalletImage from "@assets/generated_images/Multi_currency_wallet_cd1b9e1e.png";
import newsFeedImage from "@assets/generated_images/News_feed_algorithm_31d894b5.png";
import blogEditorImage from "@assets/generated_images/Blog_editor_SEO_b8e12f86.png";
import videoStreamingImage from "@assets/generated_images/Video_streaming_platform_87a4c0f5.png";

// Module images mapping
const moduleImages: Record<string, string> = {
  "Витрина товаров с AI-описаниями и умными фильтрами": showcaseSystemImage,
  "Корзина с сохранением между сессиями": cartSyncImage,
  "Автоматический прием платежей": paymentAutomationImage,
  "CRM для управления клиентами": customerCrmImage,
  "Управление складом и остатками": inventoryControlImage,
  "Система отзывов и рейтингов товаров": reviewSystemImage,
  "Система лидов и воронки продаж": salesFunnelImage,
  "Персонализированные рекомендации": recommendationEngineImage,
  "A/B тестирование интерфейса": abTestingImage,
  "Программа лояльности с начислением баллов": loyaltyProgramImage,
  "Ежедневные задания и streak-система": gamificationImage,
  "LMS платформа с прогрессом и сертификатами": lmsEducationImage,
  "Платформа курсов с видео и интерактивными тестами": videoCourseImage,
  "Календарь записи с автоматическим подтверждением": bookingCalendarImage,
  "Онлайн-запись с календарем в реальном времени": realtimeBookingImage,
  "Прием Telegram Stars (0% комиссия)": telegramStarsImage,
  "Мультивалютный кошелек с конвертацией": multiCurrencyWalletImage,
  "Лента новостей с алгоритмической подачей": newsFeedImage,
  "Встроенный блог с редактором и SEO": blogEditorImage,
  "Стриминг видео с адаптивным качеством": videoStreamingImage,
  "Push-уведомления с персонализацией по поведению": notificationImage,
  "Система скидок и промокодов": discountImage,
  "Система статусов заказов с real-time трекингом": trackingImage,
  "Интеграция с СДЭК, Boxberry, Почтой России": deliveryImage
};

export function ModuleCard({ module }: ModuleCardProps) {
  const moduleImage = moduleImages[module.name] || showcaseSystemImage;

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
