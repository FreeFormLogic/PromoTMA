import { useState, useEffect } from "react";
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
  DollarSign,
  Users,
  ArrowRight,
  Rocket,
  Shield,
  BarChart3,
  TrendingUp,
  Play
} from "lucide-react";
import { BeforeAfterDemo } from "./BeforeAfterDemo";
import { ModulePainPoints } from "./ModulePainPoints";

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
import corporateImage from "@assets/generated_images/Corporate_portal_interface_513aeefc.png";
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
import storiesImage from "@assets/generated_images/Interactive_stories_mobile_interface_fce6f857.png";

import { type Module } from "@shared/schema";

interface ModuleModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
}

// Module images mapping
const moduleImages: Record<string, string> = {
  "Витрина товаров с AI-описаниями и умными фильтрами": ecommerceImage,
  "Корзина с сохранением между сессиями": shoppingCartImage,
  "Автоматический прием платежей": paymentImage,
  "CRM для управления клиентами": crmImage,
  "Управление складом и остатками": inventoryImage,
  "Система отзывов и рейтингов товаров": reviewsImage,
  "Система лидов и воронки продаж": leadImage,
  "Персонализированные рекомендации": marketingImage,
  "A/B тестирование интерфейса": analyticsImage,
  "Программа лояльности с начислением баллов": loyaltyImage,
  "Ежедневные задания и streak-система": gamificationImage,
  "LMS платформа с прогрессом и сертификатами": educationImage,
  "Платформа курсов с видео и интерактивными тестами": videoImage,
  "Календарь записи с автоматическим подтверждением": bookingImage,
  "Онлайн-запись с календарем в реальном времени": calendarImage,
  "Прием Telegram Stars (0% комиссия)": fintechImage,
  "Мультивалютный кошелек с конвертацией": walletImage,
  "Лента новостей с алгоритмической подачей": socialImage,
  "Встроенный блог с редактором и SEO": contentImage,
  "Стриминг видео с адаптивным качеством": videoImage,
  "Push-уведомления с персонализацией по поведению": notificationImage,
  "Система скидок и промокодов": discountImage,
  "Система статусов заказов с трекингом": trackingImage,
  "Интеграция с СДЭК, Boxberry, Почтой России": deliveryImage,
  "Реферальная программа": referralImage,
  "Виртуальная примерка AR": ecommerceImage,
  "Чат-бот с AI для поддержки клиентов": chatImage,
  "Конструктор форм и опросов": formBuilderImage,
  "QR-коды для быстрых покупок в офлайне": qrPaymentImage,
  "Интерактивные Stories": storiesImage,
  "Корпоративный портал 'в кармане'": corporateImage
};

const categoryImages: Record<string, string> = {
  "E-COMMERCE": ecommerceImage,
  "МАРКЕТИНГ": marketingImage,
  "ЛОЯЛЬНОСТЬ": loyaltyImage,
  "ОБРАЗОВАНИЕ": educationImage,
  "БРОНИРОВАНИЕ": bookingImage,
  "ФИНТЕХ": fintechImage,
  "КОНТЕНТ": contentImage,
  "ИНТЕГРАЦИИ": apiImage,
  "B2B": corporateImage,
  "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": contentImage,
  "CRM": crmImage,
  "ОТРАSLЕВЫЕ РЕШЕНИЯ": corporateImage,
  "ИНДОНЕЗИЯ": paymentImage,
  "АВТОМАТИЗАЦИЯ": aiContentImage,
  "АНАЛИТИКА": analyticsImage,
  "БЕЗОПАСНОСТЬ": supportImage,
  "КОММУНИКАЦИИ": chatImage,
  "ЛОКАЛЬНЫЕ УСЛУГИ": bookingImage
};

export function ModuleModal({ module, isOpen, onClose }: ModuleModalProps) {
  const [isSelected, setIsSelected] = useState(() => {
    const savedModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
    return savedModules.some((m: any) => m.id === module?.id);
  });

  // Обновляем состояние при открытии модального окна
  useEffect(() => {
    if (module && isOpen) {
      const savedModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
      setIsSelected(savedModules.some((m: any) => m.id === module.id));
    }
  }, [isOpen]);

  const handleConnectModule = () => {
    if (!module) return;
    
    const currentModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
    const currentlySelected = currentModules.some((m: any) => m.id === module.id);
    
    if (currentlySelected) {
      // Удаляем модуль если уже выбран
      const updatedModules = currentModules.filter((m: any) => m.id !== module.id);
      localStorage.setItem('selectedModules', JSON.stringify(updatedModules));
      setIsSelected(false);
    } else {
      // Добавляем модуль в выбранные
      const updatedModules = [...currentModules, module];
      localStorage.setItem('selectedModules', JSON.stringify(updatedModules));
      setIsSelected(true);
    }
    
    // Обновляем интерфейс
    window.dispatchEvent(new CustomEvent('moduleSelectionChanged'));
    
    // Закрыть модальное окно после выбора
    setTimeout(() => onClose(), 300);
  };
  // Используем реальные данные модуля из базы данных (как в AI чате)
  const details = {
    description: module?.description || "Описание модуля доступно в базе данных",
    features: (() => {
      if (Array.isArray(module?.keyFeatures)) {
        return module.keyFeatures;
      }
      if (typeof module?.keyFeatures === 'string') {
        try {
          // Пытаемся парсить JSON массив
          const parsed = JSON.parse(module.keyFeatures);
          if (Array.isArray(parsed)) {
            return parsed;
          }
          // Если не JSON массив, разбиваем по строкам
          return module.keyFeatures.split('\n').filter((f: string) => f.trim());
        } catch {
          // Если парсинг не удался, разбиваем по строкам
          return module.keyFeatures.split('\n').filter((f: string) => f.trim());
        }
      }
      // Fallback на основные возможности
      return [
        "Основные возможности модуля",
        "Быстрое внедрение в ваш проект", 
        "Техническая поддержка при настройке"
      ];
    })(),
    impact: module?.benefits || "Преимущества для вашего бизнеса"
  };

  if (!module) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{module.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Детальная информация о модуле {module.name}
          </DialogDescription>
          
          <div className="flex items-center gap-2 mt-2">
            {module.isPopular && (
              <Badge className="bg-orange-100 text-orange-800">Популярный</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Blue description box matching AI chat design */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200">
            <div className="text-gray-700 text-base leading-relaxed">
              {details.description}
            </div>
          </div>
          
          {/* Features section with proper formatting like AI chat */}
          <div>
            <h3 className="font-bold text-lg mb-3">Основные возможности:</h3>
            <div className="space-y-3">
              {details.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div 
                    className="text-gray-700 leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{
                      __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^:\s*/, '')
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Benefits section like AI chat */}
          {details.impact && (
            <div>
              <h3 className="font-bold text-lg mb-3">Преимущества:</h3>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: details.impact.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button 
              onClick={handleConnectModule}
              className={`flex-1 h-12 text-base font-medium rounded-lg ${
                isSelected 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSelected ? 'Отключить модуль' : 'Подключить модуль'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6 h-12 text-base rounded-lg"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}