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

// Import individual module images
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
import socialImage from "@assets/generated_images/Social_media_feed_bb392294.png";
import videoImage from "@assets/generated_images/Video_streaming_platform_b2344ddf.png";
import chatImage from "@assets/generated_images/Live_chat_support_3a049e0e.png";
import notificationImage from "@assets/generated_images/Push_notification_center_fc8679f4.png";
import referralImage from "@assets/generated_images/Referral_program_dashboard_67a246f6.png";
import webinarImage from "@assets/generated_images/Webinar_platform_interface_08798c44.png";
import qrPaymentImage from "@assets/generated_images/QR_code_payment_bb3e760b.png";
import walletImage from "@assets/generated_images/Multi-currency_wallet_3d2e930e.png";
import galleryImage from "@assets/generated_images/Photo_gallery_interface_6bd7c076.png";
import podcastImage from "@assets/generated_images/Podcast_platform_interface_9dd5dba9.png";
import apiImage from "@assets/generated_images/API_integration_dashboard_093d07e8.png";
import trackingImage from "@assets/generated_images/Order_tracking_interface_3f251983.png";
import discountImage from "@assets/generated_images/Discount_system_interface_f78c73cf.png";
import surveyImage from "@assets/generated_images/Survey_feedback_interface_3627f690.png";
import gamificationImage from "@assets/generated_images/Gamification_achievement_system_98016851.png";
import subscriptionImage from "@assets/generated_images/Subscription_management_interface_fa28e3e6.png";
import calendarImage from "@assets/generated_images/Event_calendar_interface_d83b440e.png";
import exportImage from "@assets/generated_images/Data_export_interface_b4896729.png";
import invoiceImage from "@assets/generated_images/Invoice_generation_system_095a3194.png";
import supportImage from "@assets/generated_images/Support_ticket_system_9757c018.png";
import analyticsImage from "@assets/generated_images/User_behavior_analytics_84bd440f.png";
import deliveryImage from "@assets/generated_images/Delivery_tracking_map_778e4633.png";
import certificateImage from "@assets/generated_images/Digital_certificate_system_f7dc8e8b.png";
import aiContentImage from "@assets/generated_images/AI_content_generation_ec932f54.png";
import leadImage from "@assets/generated_images/Lead_management_system_28d5ec63.png";
import homeworkImage from "@assets/generated_images/Homework_assignment_platform_4253b9e8.png";
import emailMarketingImage from "@assets/generated_images/Email_marketing_campaign_420ae8af.png";
import liveStreamImage from "@assets/generated_images/Live_streaming_interface_acbc10aa.png";
import formBuilderImage from "@assets/generated_images/Form_builder_interface_373046a0.png";
import queueImage from "@assets/generated_images/Queue_management_system_64d9ab31.png";
import socialSharingImage from "@assets/generated_images/Social_sharing_interface_e0a57791.png";
import videoCallImage from "@assets/generated_images/Video_call_interface_345c3934.png";
import libraryImage from "@assets/generated_images/Digital_library_interface_588c6eee.png";
import cryptoWalletImage from "@assets/generated_images/Cryptocurrency_wallet_interface_4ff3d809.png";
import progressImage from "@assets/generated_images/Progress_tracking_dashboard_2d5a65bd.png";
import specialistImage from "@assets/generated_images/Specialist_scheduling_interface_066105d1.png";

interface ModuleModalProps {
  module: any;
  isOpen: boolean;
  onClose: () => void;
}

// Individual module images for specific modules
const moduleImages: Record<string, string> = {
  // E-COMMERCE И ПРОДАЖИ
  "Витрина товаров с AI-описаниями и умными фильтрами": ecommerceImage,
  "Корзина с сохранением между сессиями": shoppingCartImage,
  "Автоматический прием платежей": paymentImage,
  "CRM для управления клиентами": crmImage,
  "Управление складом и остатками": inventoryImage,
  "Система отзывов и рейтингов товаров": reviewsImage,
  
  // МАРКЕТИНГ И АНАЛИТИКА
  "Система лидов и воронки продаж": marketingImage,
  "Персонализированные рекомендации": marketingImage,
  "A/B тестирование интерфейса": marketingImage,
  
  // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ
  "Программа лояльности с начислением баллов": loyaltyImage,
  "Ежедневные задания и streak-система": loyaltyImage,
  
  // ОБРАЗОВАНИЕ И ОБУЧЕНИЕ
  "LMS платформа с прогрессом и сертификатами": educationImage,
  "Платформа курсов с видео и интерактивными тестами": educationImage,
  
  // СЕРВИСЫ И БРОНИРОВАНИЕ
  "Календарь записи с автоматическим подтверждением": bookingImage,
  "Онлайн-запись с календарем в реальном времени": bookingImage,
  
  // ФИНТЕХ И ПЛАТЕЖИ
  "Прием Telegram Stars (0% комиссия)": fintechImage,
  "Мультивалютный кошелек с конвертацией": walletImage,
  "QR-коды для быстрых покупок в офлайне": qrPaymentImage,
  
  // КОНТЕНТ И МЕДИА
  "Лента новостей с алгоритмической подачей": socialImage,
  "Встроенный блог с редактором и SEO": contentImage,
  "Стриминг видео с адаптивным качеством": videoImage,
  
  // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ
  "Push-уведомления с персонализацией по поведению": notificationImage,
  "Реферальная система с вознаграждениями": referralImage,
  
  // ОБРАЗОВАНИЕ И ОБУЧЕНИЕ
  "Вебинары и live-стримы с чатом": webinarImage,
  
  // ИНТЕГРАЦИИ И API
  "Чат-боты с AI для автоматизации поддержки": chatImage,
  "Синхронизация с внешними сервисами": apiImage,
  "Экспорт данных в популярные форматы": exportImage,
  
  // More E-COMMERCE modules
  "Система скидок и промокодов": discountImage,
  "Система статусов заказов с real-time трекингом": trackingImage,
  "Интеграция с СДЭК, Boxberry, Почтой России": deliveryImage,
  
  // More MARKETING modules  
  "Дашборд бизнес-аналитики с real-time метриками": leadImage,
  "Аналитика поведения пользователей": analyticsImage,
  "Опросы и сбор обратной связи": surveyImage,
  
  // More EDUCATION modules
  "Система сертификатов и дипломов с верификацией": certificateImage,
  "Домашние задания с проверкой и обратной связью": homeworkImage,
  "Трекинг прогресса обучения и статистика": trackingImage,
  
  // More FINTECH modules
  "Система подписок и рекуррентных платежей": subscriptionImage,
  "Выставление счетов и актов для юрлиц": invoiceImage,
  
  // More CONTENT modules
  "Галерея фото/видео с категориями": galleryImage,
  "Подкасты и аудиоконтент с плейлистами": podcastImage,
  "Генерация контента через AI (тексты, изображения)": aiContentImage,
  
  // More ENGAGEMENT modules
  "Система достижений и бейджей за активность": gamificationImage,
  
  // More SERVICES modules
  "Расписание занятий с напоминаниями": calendarImage,
  "Управление расписанием специалистов": calendarImage,
  
  // More INTEGRATION modules
  "Техподдержка через тикет-систему": supportImage,
  "Конструктор форм с логикой и валидацией": formBuilderImage,
  
  // Additional E-COMMERCE modules
  "Карточка товара с 360° галереей и видео-обзорами": galleryImage,
  "AI-персонализация с умными рекомендациями": aiContentImage,
  
  // Additional MARKETING modules
  "Email и SMS рассылки с сегментацией": emailMarketingImage,
  "Интеграция с соцсетями для вирального роста": socialSharingImage,
  
  // Additional LOYALTY modules
  "Social Proof с живыми уведомлениями о покупках": socialSharingImage,
  
  // Additional EDUCATION modules
  "Интерактивные тесты и квизы с мгновенными результатами": formBuilderImage,
  "Видео-уроки с таймкодами и заметками": videoImage,
  
  // Additional SERVICES modules
  "Система управления очередями": queueImage,
  "Бронирование номеров и столиков в реальном времени": bookingImage,
  "Система напоминаний о записи": notificationImage,
  
  // Additional FINTECH modules
  "P2P переводы между пользователями": walletImage,
  "Система кредитования и рассрочек": subscriptionImage,
  "Интеграция с банковскими API": apiImage,
  "Криптовалютные платежи и токены": cryptoWalletImage,
  
  // Additional CONTENT modules
  "Система комментариев с модерацией": socialImage,
  "Фото и видеогалереи с тегированием": galleryImage,
  "Документооборот и файлообменник": libraryImage,
  
  // Additional INTEGRATION modules
  "Интеграция с 1С и другими учетными системами": apiImage,
  "Веб-хуки для уведомлений": notificationImage
};

const categoryImages: Record<string, string> = {
  "E-COMMERCE И ПРОДАЖИ": ecommerceImage,
  "МАРКЕТИНГ И АНАЛИТИКА": marketingImage,
  "ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ": loyaltyImage,
  "ОБРАЗОВАНИЕ И ОБУЧЕНИЕ": educationImage,
  "СЕРВИСЫ И БРОНИРОВАНИЕ": bookingImage,
  "ФИНТЕХ И ПЛАТЕЖИ": fintechImage,
  "КОНТЕНТ И МЕДИА": contentImage,
  "ИНТЕГРАЦИИ И API": contentImage
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
  const moduleImage = moduleImages[module?.name] || categoryImages[module?.category] || ecommerceImage;
  const details = moduleFeatures[module?.name] || {
    features: [
      "Готовое решение под ключ",
      "Быстрое внедрение за 1-5 дней", 
      "Интеграция с Telegram API",
      "Адаптивный дизайн под все устройства",
      "Круглосуточная техническая поддержка"
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