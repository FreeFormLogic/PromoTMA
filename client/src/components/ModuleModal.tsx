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

// Define image aliases for consistent mapping
const showcaseSystemImage = ecommerceImage;
const cartSyncImage = shoppingCartImage;
const paymentAutomationImage = paymentImage;
const customerCrmImage = crmImage;
const inventoryControlImage = inventoryImage;
const reviewSystemImage = reviewsImage;
const salesFunnelImage = marketingImage;
const recommendationEngineImage = marketingImage;
const abTestingImage = marketingImage;
const loyaltyProgramImage = loyaltyImage;
const gamificationSystemImage = gamificationImage;
const lmsEducationImage = educationImage;
const videoCourseImage = educationImage;
const bookingCalendarImage = bookingImage;
const realtimeBookingImage = bookingImage;
const telegramStarsImage = fintechImage;
const multiCurrencyWalletImage = walletImage;
const newsFeedImage = socialImage;
const blogEditorImage = contentImage;
const videoStreamingImage = videoImage;

interface ModuleModalProps {
  module: any;
  isOpen: boolean;
  onClose: () => void;
}

// Individual module images for specific modules
const moduleImages: Record<string, string> = {
  // E-COMMERCE И ПРОДАЖИ
  "Витрина товаров с AI-описаниями и умными фильтрами": showcaseSystemImage,
  "Корзина с сохранением между сессиями": cartSyncImage,
  "Автоматический прием платежей": paymentAutomationImage,
  "CRM для управления клиентами": customerCrmImage,
  "Управление складом и остатками": inventoryControlImage,
  "Система отзывов и рейтингов товаров": reviewSystemImage,
  
  // МАРКЕТИНГ И АНАЛИТИКА
  "Система лидов и воронки продаж": salesFunnelImage,
  "Персонализированные рекомендации": recommendationEngineImage,
  "A/B тестирование интерфейса": abTestingImage,
  
  // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ
  "Программа лояльности с начислением баллов": loyaltyProgramImage,
  "Ежедневные задания и streak-система": gamificationSystemImage,
  
  // ОБРАЗОВАНИЕ И ОБУЧЕНИЕ
  "LMS платформа с прогрессом и сертификатами": lmsEducationImage,
  "Платформа курсов с видео и интерактивными тестами": videoCourseImage,
  
  // СЕРВИСЫ И БРОНИРОВАНИЕ
  "Календарь записи с автоматическим подтверждением": bookingCalendarImage,
  "Онлайн-запись с календарем в реальном времени": realtimeBookingImage,
  
  // ФИНТЕХ И ПЛАТЕЖИ
  "Прием Telegram Stars (0% комиссия)": telegramStarsImage,
  "Мультивалютный кошелек с конвертацией": multiCurrencyWalletImage,
  "QR-коды для быстрых покупок в офлайне": qrPaymentImage,
  
  // КОНТЕНТ И МЕДИА
  "Лента новостей с алгоритмической подачей": newsFeedImage,
  "Встроенный блог с редактором и SEO": blogEditorImage,
  "Стриминг видео с адаптивным качеством": videoStreamingImage,
  
  // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ
  "Push-уведомления с персонализацией по поведению": notificationImage,
  "Система скидок и промокодов": discountImage,
  "Система статусов заказов с real-time трекингом": trackingImage,
  "Интеграция с СДЭК, Boxberry, Почтой России": deliveryImage,
  "Реферальная система с вознаграждениями": referralImage,
  
  // ОБРАЗОВАНИЕ И ОБУЧЕНИЕ
  "Вебинары и live-стримы с чатом": webinarImage,
  
  // ИНТЕГРАЦИИ И API
  "Чат-боты с AI для автоматизации поддержки": chatImage,
  "Синхронизация с внешними сервисами": apiImage,
  "Экспорт данных в популярные форматы": exportImage,
  
  // More E-COMMERCE modules
  
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
      "Нейросетевые описания товаров: автогенерация продающих текстов, сокращение времени наполнения каталога на 90%",
      "Интеллектуальная система фильтрации: 20+ типов фильтров, адаптированных под компактный интерфейс Telegram",
      "Визуальный поиск: загрузка фото товара для поиска аналогов с точностью 95%",
      "Динамический каталог: автоматическое ранжирование товаров на основе предпочтений пользователей",
      "Персонализация витрины: адаптация ассортимента под интересы каждого пользователя"
    ],
    implementation: "2-3 дня",
    price: "Включено в базовый пакет"
  },
  "Корзина с сохранением между сессиями": {
    features: [
      "Синхронизация с аккаунтом Telegram: мгновенное сохранение и восстановление состава корзины",
      "Облачное хранение данных: сохранение содержимого корзины до 30 дней для пользователей Telegram",
      "Восстановление прерванных сессий: автовосстановление после закрытия приложения",
      "Умные напоминания о забытых товарах через Telegram Bot",
      "Автоматический расчет доставки и применение промокодов"
    ],
    implementation: "1 день",
    price: "Включено в базовый пакет"
  },
  "Автоматический прием платежей": {
    features: [
      "Интеграция с Telegram Payments: быстрая оплата через встроенные платежные методы без перехода на сторонние сайты",
      "Мультиплатформенный прием: поддержка 15+ способов оплаты включая карты, e-кошельки, СБП и Telegram Stars",
      "Защита от мошенничества: многоуровневая система безопасности с ML-алгоритмами для выявления подозрительных операций",
      "Автоматические возвраты: мгновенная обработка возвратов и частичных возмещений с минимальным участием менеджера",
      "Умные платежные формы: адаптивный дизайн с минимизацией полей для быстрой оплаты прямо в Telegram"
    ],
    implementation: "2-3 дня",
    price: "2-3% с оборота"
  },
  "CRM для управления клиентами": {
    features: [
      "360° профиль клиента: полная история покупок, предпочтений и взаимодействий с Mini App",
      "Автоматическая сегментация: распределение клиентов по поведенческим группам для персональных кампаний",
      "Жизненный цикл клиента: отслеживание этапов воронки и автоматические действия для каждого этапа",
      "Интеграция с внешними CRM: синхронизация данных с AmoCRM, Битрикс24, HubSpot",
      "Прогнозирование оттока: ML-алгоритмы для предсказания риска потери клиента и превентивные меры"
    ],
    implementation: "3-4 дня",
    price: "Включено в расширенный пакет"
  },
  "Управление складом и остатками": {
    features: [
      "Синхронизация в реальном времени: автоматическое обновление остатков с 1С и складскими системами",
      "Умное резервирование: автоматическая блокировка товаров при добавлении в корзину Mini App на 30 минут",
      "Предиктивные уведомления: алерты о критически низких остатках с учетом скорости продаж",
      "Прогнозирование спроса: AI-анализ трендов для оптимизации закупок на основе данных из Telegram",
      "ABC-анализ товаров: автоматическая категоризация по прибыльности и оборачиваемости"
    ],
    implementation: "2-3 дня", 
    price: "$30/месяц"
  },
  "Система отзывов и рейтингов товаров": {
    features: [
      "AI-модерация контента: автоматическая проверка отзывов на соответствие политикам и выявление фейковых отзывов",
      "Мультимедийные отзывы: возможность прикрепления фото и видео товаров прямо через Telegram Mini App",
      "Система репутации: ранжирование покупателей по качеству и полезности их отзывов",
      "Умные уведомления: автоматические алерты менеджерам о негативных отзывах для быстрого реагирования",
      "Анализ тональности: AI-определение настроения клиентов для выявления проблемных товаров"
    ],
    implementation: "1-2 дня",
    price: "Включено в базовый пакет"  
  },
  "Система лидов и воронки продаж": {
    features: [
      "Многоступенчатый трекинг: полное отслеживание пути клиента от первого касания до конверсии в Telegram Mini App",
      "AI-скоринг лидов: автоматическая оценка качества и готовности к покупке на основе поведенческих факторов",
      "Интеллектуальные воронки: динамическая адаптация сценариев взаимодействия под каждый сегмент аудитории",
      "Мультиканальная атрибуция: точное определение источника конверсии с учетом всех точек контакта в Telegram",
      "Предиктивная аналитика: прогнозирование вероятности закрытия сделки и оптимального времени контакта"
    ],
    implementation: "4-5 дней",
    price: "$50/месяц"
  },
  "Персонализированные рекомендации": {
    features: [
      "Комплексный анализ поведения: обработка более 50 факторов взаимодействия для создания точного профиля",
      "Динамическая персонализация: автоматическая адаптация контента и предложений под каждого пользователя Telegram",
      "Предиктивные рекомендации: прогнозирование потенциального интереса к товарам с точностью до 85%",
      "Многоуровневая сегментация: распределение пользователей по микросегментам для таргетированных кампаний",
      "Самообучающиеся алгоритмы: постоянное улучшение качества рекомендаций на основе обратной связи"
    ],
    implementation: "5-7 дней",
    price: "$40/месяц"
  },
  "A/B тестирование интерфейса": {
    features: [
      "Многовариантное тестирование: одновременное сравнение до 10 версий элементов интерфейса в Mini App",
      "Статистическая достоверность: автоматический расчет необходимого размера выборки и определение победителя",
      "Таргетированные эксперименты: возможность тестирования на определенных сегментах аудитории Telegram",
      "Визуальный редактор: создание вариаций без необходимости привлечения программистов",
      "Комплексная аналитика: оценка влияния изменений на ключевые бизнес-показатели Mini App"
    ],
    implementation: "3-4 дня",
    price: "$25/месяц"
  },
  "Программа лояльности с начислением баллов": {
    features: [
      "Многоуровневая система лояльности: от стартового до VIP уровня с эксклюзивными привилегиями в Telegram Mini App",
      "Гибкая механика начислений: настраиваемые правила за покупки, активность, рефералов и социальные действия",
      "Геймификация процесса: достижения, челленджи и соревнования между пользователями Telegram",
      "Персонализированные награды: индивидуальные бонусы на основе предпочтений и истории покупок",
      "Кросс-платформенные баллы: единая система лояльности для Mini App и других каналов продаж"
    ],
    implementation: "2-3 дня",
    price: "$20/месяц"
  },
  "Ежедневные задания и streak-система": {
    features: [
      "Адаптивные задания: персонализированные квесты на основе интересов и активности пользователя в Telegram",
      "Streak-механика: мотивационная система ежедневных заходов с растущими наградами за постоянство",
      "Социальные челленджи: групповые задания для друзей в Telegram с командными наградами",
      "Умные напоминания: персонализированные уведомления о заданиях через Telegram Bot в оптимальное время",
      "Прогрессия сложности: динамическое усложнение заданий по мере роста навыков пользователя"
    ],
    implementation: "3-4 дня",  
    price: "$15/месяц"
  },
  "LMS платформа с прогрессом и сертификатами": {
    features: [
      "Модульная архитектура курсов: гибкая система уроков с адаптивными сценариями обучения в Telegram Mini App",
      "Интеллектуальный трекинг: детальная аналитика прогресса с выявлением проблемных тем и рекомендациями",
      "Блокчейн-сертификаты: верифицируемые цифровые дипломы с защитой от подделки",
      "Микрообучение: короткие уроки по 5-10 минут, оптимизированные для изучения в мобильном формате",
      "Социальное обучение: групповые проекты и обсуждения в Telegram чатах с наставниками"
    ],
    implementation: "7-10 дней",
    price: "$80/месяц"
  },
  "Платформа курсов с видео и интерактивными тестами": {
    features: [
      "HD видеоплеер с закладками и заметками",
      "Адаптивные тесты под уровень знаний",
      "Система домашних заданий с автопроверкой",
      "Видеозвонки для групповых занятий",
      "Аналитика успеваемости студентов"
    ],
    implementation: "10-12 дней",
    price: "$120/месяц"
  },
  "Календарь записи с автоматическим подтверждением": {
    features: [
      "Интеллектуальное планирование: автоматическое предложение оптимального времени на основе загрузки специалистов",
      "Telegram-интеграция: запись на услуги прямо через Mini App с мгновенным подтверждением в чате",
      "Умные напоминания: персонализированные уведомления клиентам за 24ч, 2ч и 15 мин до встречи",
      "Система отмен и переносов: гибкие правила изменения записей с автоматическим перераспределением времени",
      "Аналитика загруженности: оптимизация расписания специалистов на основе статистики записей"
    ],
    implementation: "2-3 дня",
    price: "$25/месяц"
  },
  "Онлайн-запись с календарем в реальном времени": {
    features: [
      "Real-time синхронизация: мгновенное отображение свободных слотов с учетом всех изменений в расписании",
      "Персональный выбор специалистов: фильтрация мастеров по рейтингу, специализации и доступности в Mini App",
      "Динамическое ценообразование: автоматический расчет стоимости с учетом услуг, времени и специалиста",
      "Гибкая система предоплат: возможность внесения гарантийного депозита через Telegram Payments",
      "Умные напоминания: персонализированные push-уведомления за 24ч, 2ч и 15 мин до записи"
    ],
    implementation: "3-4 дня",
    price: "$35/месяц"
  },
  "Прием Telegram Stars (0% комиссия)": {
    features: [
      "Нативная интеграция: полная интеграция с системой Telegram Stars без дополнительных платежных шлюзов",
      "Мгновенные транзакции: зачисление средств происходит мгновенно после оплаты в Mini App",
      "Глобальный охват: прием платежей от пользователей Telegram со всего мира без ограничений",
      "Упрощенная конверсия: автоматический перевод Stars в фиатную валюту по текущему курсу",
      "Максимальное доверие: использование встроенной экосистемы Telegram для повышения конверсии платежей"
    ],
    implementation: "1 день",
    price: "0% комиссии"
  },
  "Мультивалютный кошелек с конвертацией": {
    features: [
      "Глобальная поддержка валют: работа с 50+ фиатными валютами и ТОП-20 криптовалют в одном Telegram Mini App",
      "Умная конвертация: автоматический выбор оптимального курса из нескольких источников для минимизации комиссий",
      "P2P обмен: прямые сделки между пользователями Telegram с эскроу-гарантиями",
      "Мгновенные переводы: внутрисистемные транзакции за доли секунды без банковских задержек",
      "Crypto Bridge: интеграция с основными блокчейн-сетями для работы с DeFi прямо в Telegram"
    ],
    implementation: "5-6 дней",
    price: "0.5% с конвертации"
  },
  "QR-коды для быстрых покупок в офлайне": {
    features: [
      "Универсальная QR-система: генерация динамических кодов для товаров, акций и скидок с мгновенным обновлением",
      "Omnichannel-интеграция: связывание офлайн-покупок с профилем клиента в Telegram Mini App",
      "Быстрая оплата: сканирование кода и оплата прямо через Telegram без установки дополнительных приложений",
      "Контекстные предложения: показ релевантных товаров и скидок на основе текущих покупок в офлайн-точке",
      "Детальная аналитика: трекинг конверсии от офлайн-активности к онлайн-покупкам в Mini App"
    ],
    implementation: "2-3 дня",
    price: "$20/месяц"
  },
  "Лента новостей с алгоритмической подачей": {
    features: [
      "AI-курация контента: автоматическое создание персонализированной ленты на основе интересов пользователя Telegram",
      "Умная модерация: автоматическое выявление нежелательного контента с точностью 98%",
      "Вирусная механика: система лайков, репостов и комментариев для увеличения вовлеченности в Mini App",
      "Трендинг-алгоритмы: выявление популярного контента в реальном времени для поднятия в ленте",
      "Cross-platform публикация: автоматическое распространение контента в связанные Telegram каналы"
    ],
    implementation: "6-7 дней",
    price: "$60/месяц"
  },
  "Встроенный блог с редактором и SEO": {
    features: [
      "Профессиональный WYSIWYG-редактор: создание статей с медиафайлами прямо в Telegram Mini App",
      "Автоматическая SEO-оптимизация: генерация мета-тегов, sitemap и структурированной разметки для поисковиков",
      "Умная система тегов: автоматическое предложение релевантных тегов на основе содержания статьи",
      "Модерация комментариев: AI-фильтрация спама и токсичных комментариев в реальном времени",
      "Детальная аналитика: трекинг источников трафика, времени чтения и популярности контента"
    ],
    implementation: "4-5 дней",
    price: "$45/месяц"
  },
  "Стриминг видео с адаптивным качеством": {
    features: [
      "Адаптивный битрейт: автоматическая подстройка качества видео от 240p до 4K в зависимости от скорости интернета",
      "Глобальная CDN-сеть: минимальные задержки воспроизведения для пользователей Telegram по всему миру",
      "DRM-защита контента: многоуровневая система защиты от несанкционированного копирования и распространения",
      "Продвинутая аналитика: детальная статистика просмотров, удержания аудитории и поведенческих паттернов",
      "Монетизация контента: гибкие модели подписок, разовых покупок и рекламных вставок в Mini App"
    ],
    implementation: "8-10 дней",
    price: "$100/месяц"
  },
  "Push-уведомления с персонализацией по поведению": {
    features: [
      "Умная сегментация пользователей по 20+ поведенческим параметрам",
      "Триггерные уведомления: брошенная корзина, неактивность, новые товары",
      "A/B тестирование заголовков, текстов и времени отправки",
      "Персональное определение оптимального времени для каждого клиента",
      "Детальная аналитика: открытия, клики, конверсии в покупки"
    ],
    implementation: "2-3 дня",
    price: "$30/месяц"
  },
  "Система скидок и промокодов": {
    features: [
      "Многоуровневые скидки: создание сложных правил с комбинированием различных условий активации",
      "Временные ограничения: настройка промокодов с точным периодом действия вплоть до минут",
      "Персональные предложения: генерация уникальных одноразовых промокодов для конкретных пользователей Telegram",
      "Геотаргетинг скидок: автоматическое применение региональных предложений",
      "Аналитика эффективности: детальные отчеты по ROI каждой промо-акции"
    ],
    implementation: "1-2 дня",
    price: "Включено в базовый пакет"
  },
  "Система статусов заказов с real-time трекингом": {
    features: [
      "Детализированный процесс статусов: 8-10 этапов обработки заказа с подробными уведомлениями для клиента через Telegram",
      "GPS-трекинг курьеров: отображение текущего местоположения курьера на карте с прогнозируемым временем прибытия прямо в Mini App",
      "Предиктивная аналитика доставки: расчет точного времени доставки с учетом загруженности дорог и статистических данных",
      "Мгновенные уведомления: автоматическая отправка сообщений о смене статуса заказа через Telegram Bot",
      "Интеграция с логистическими сервисами: автоматическое получение трек-номеров и статусов от транспортных компаний"
    ],
    implementation: "3-4 дня",
    price: "$40/месяц"
  },
  "Интеграция с СДЭК, Boxberry, Почтой России": {
    features: [
      "Единый интерфейс управления: централизованное управление отправками через различные службы доставки прямо из админ-панели Telegram Mini App",
      "Автоматический расчет стоимости: мгновенное определение оптимального способа доставки по стоимости и срокам",
      "Печать документов: автоматическое формирование и печать этикеток, накладных и других сопроводительных документов",
      "Трекинг отправлений: отслеживание статусов доставки с автоматическим обновлением информации в Telegram",
      "Интеграция с маркетплейсами: синхронизация заказов из Mini App с Wildberries, Ozon, Яндекс.Маркет для омниканальных продаж"
    ],
    implementation: "4-5 дней",
    price: "$50/месяц"
  }
};

export function ModuleModal({ module, isOpen, onClose }: ModuleModalProps) {
  const moduleImage = moduleImages[module?.name] || categoryImages[module?.category] || ecommerceImage;
  const details = moduleFeatures[module?.name] || {
    features: module?.features || [
      "Основные возможности модуля",
      "Быстрое внедрение в ваш проект",
      "Техническая поддержка при настройке"
    ],
    implementation: "3-5 дней",
    price: "От $25/месяц"
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
                Что умеет модуль
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