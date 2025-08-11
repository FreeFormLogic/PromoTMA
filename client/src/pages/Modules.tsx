    import React, { useState, useEffect, useMemo } from "react";
    import { 
      Card, 
      CardContent, 
      CardDescription, 
      CardFooter, 
      CardHeader, 
      CardTitle 
    } from "@/components/ui/card";
    import { Badge } from "@/components/ui/badge";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogFooter,
    } from "@/components/ui/dialog";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import {
      Search,
      Filter,
      ShoppingCart,
      BarChart3,
      Gift,
      GraduationCap,
      Calendar,
      DollarSign,
      FileText,
      Brain,
      TrendingUp,
      Award,
      Gamepad2,
      Globe,
      Phone,
      MessageSquare,
      Lock,
      FormInput,
      Sparkles,
      Rocket,
      CheckCircle2,
      Timer,
      Layers,
      Camera,
      Video,
      Eye,
      Heart,
      Database,
      Settings,
      Users,
      CreditCard,
      Package,
      Warehouse,
      Building2,
      Target,
      Headphones,
      Mail,
      Cloud,
      Briefcase,
      Star,
      Shield,
    } from "lucide-react";

    // Определение типов
    interface Feature {
      title: string;
      description: string;
    }

    interface Module {
      id: number;
      name: string;
      description: string;
      fullDescription?: string;
      icon: React.ReactNode;
      category: string;
      subcategory?: string;
      isPopular?: boolean;
      features: Feature[];
      benefits: string;
    }

    // Функция для получения иконок по имени
    const getIcon = (name: string, className: string = "h-5 w-5"): React.ReactNode => {
      const icons: Record<string, React.ReactNode> = {
        ShoppingCart: <ShoppingCart className={className} />,
        BarChart3: <BarChart3 className={className} />,
        Gift: <Gift className={className} />,
        GraduationCap: <GraduationCap className={className} />,
        Calendar: <Calendar className={className} />,
        DollarSign: <DollarSign className={className} />,
        FileText: <FileText className={className} />,
        Brain: <Brain className={className} />,
        TrendingUp: <TrendingUp className={className} />,
        Award: <Award className={className} />,
        Gamepad2: <Gamepad2 className={className} />,
        Globe: <Globe className={className} />,
        Phone: <Phone className={className} />,
        MessageSquare: <MessageSquare className={className} />,
        Lock: <Lock className={className} />,
        FormInput: <FormInput className={className} />,
        Sparkles: <Sparkles className={className} />,
        Rocket: <Rocket className={className} />,
        CheckCircle2: <CheckCircle2 className={className} />,
        Timer: <Timer className={className} />,
        Layers: <Layers className={className} />,
        Camera: <Camera className={className} />,
        Star: <Star className={className} />,
        Eye: <Eye className={className} />,
        Heart: <Heart className={className} />,
        Database: <Database className={className} />,
        Settings: <Settings className={className} />,
        Users: <Users className={className} />,
        CreditCard: <CreditCard className={className} />,
        Package: <Package className={className} />,
        Warehouse: <Warehouse className={className} />,
        Video: <Video className={className} />,
        Building2: <Building2 className={className} />,
        Shield: <Shield className={className} />,
        Cloud: <Cloud className={className} />
      };

      return icons[name] || <Settings className={className} />;
    };

    // Данные модулей - E-COMMERCE
    const ecommerceModules: Module[] = [
      {
        id: 1,
        name: "Витрина товаров с AI-описаниями",
        description: "Революционный каталог с нейросетевыми описаниями и 20+ умными фильтрами",
        fullDescription: "Интеллектуальная система каталога с автоматической генерацией SEO-описаний через нейросети, визуальным поиском по фото с точностью 95% и персонализацией под каждого пользователя",
        icon: getIcon("Brain"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Нейросетевые описания товаров", 
            description: "Автоматическая генерация продающих текстов с сокращением времени наполнения каталога на 90%" 
          },
          { 
            title: "Интеллектуальная фильтрация", 
            description: "20+ типов фильтров с автоматической настройкой релевантности под категории товаров" 
          },
          { 
            title: "Визуальный поиск по фото", 
            description: "Загрузка фотографии товара для поиска аналогов с точностью до 95%" 
          },
          { 
            title: "Динамическое ранжирование", 
            description: "Автоматическое ранжирование на основе предпочтений пользователя и популярности" 
          },
          { 
            title: "Персонализация витрины", 
            description: "Адаптация отображаемого ассортимента под интересы каждого пользователя" 
          }
        ],
        benefits: "Повышение конверсии на 40%, сокращение времени поиска на 60%"
      },
      {
        id: 2,
        name: "Карточка товара с 360° галереей",
        description: "Интерактивная презентация с 3D-обзором, видео и AR-примеркой",
        fullDescription: "Максимально вовлекающая карточка товара с возможностью кругового обзора, HD-зуммированием деталей и примеркой через камеру",
        icon: getIcon("Camera"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "3D-просмотр товаров", 
            description: "Интерактивное вращение на 360° с плавным масштабированием" 
          },
          { 
            title: "Видео-демонстрации", 
            description: "Встроенный плеер для просмотра обзоров с автоадаптацией качества" 
          },
          { 
            title: "HD-зуммирование", 
            description: "Детальное рассмотрение материалов с 20-кратным увеличением" 
          },
          { 
            title: "AR-примерка", 
            description: "Визуализация товаров в реальном пространстве через камеру устройства" 
          },
          { 
            title: "Интерактивные хотспоты", 
            description: "Выделение и описание ключевых особенностей товара" 
          }
        ],
        benefits: "Снижение возвратов на 35%, увеличение среднего чека на 25%"
      },
      {
        id: 3,
        name: "Корзина с сохранением сессии",
        description: "Умная корзина с облачной синхронизацией и автовосстановлением",
        fullDescription: "Интеллектуальная система управления корзиной с автосохранением, восстановлением брошенных покупок и персональными напоминаниями",
        icon: getIcon("ShoppingCart"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Синхронизация с аккаунтом", 
            description: "Мгновенное сохранение корзины при повторном открытии Mini App" 
          },
          { 
            title: "Облачное хранение", 
            description: "Сохранение содержимого корзины до 30 дней для пользователей" 
          },
          { 
            title: "Восстановление сессий", 
            description: "Автоматическое восстановление корзины после закрытия приложения" 
          },
          { 
            title: "Интеллектуальные напоминания", 
            description: "Персонализированные уведомления о незавершенных покупках" 
          },
          { 
            title: "Аналитика поведения", 
            description: "Выявление паттернов, приводящих к отказу от покупки" 
          }
        ],
        benefits: "Восстановление 45% брошенных корзин, рост конверсии на 30%"
      },
      {
        id: 4,
        name: "Автоматический прием платежей",
        description: "15+ способов оплаты с нулевой комиссией через Telegram Stars",
        fullDescription: "Универсальная платежная экосистема с поддержкой всех популярных методов оплаты и встроенной защитой от мошенничества",
        icon: getIcon("CreditCard"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Интеграция с Telegram Payments", 
            description: "Быстрая оплата через встроенные в Telegram платежные методы" 
          },
          { 
            title: "Мультиплатформенный прием", 
            description: "15+ способов оплаты включая карты, электронные кошельки, СБП" 
          },
          { 
            title: "Защита от мошенничества", 
            description: "ML-алгоритмы для выявления подозрительных операций" 
          },
          { 
            title: "Автоматические возвраты", 
            description: "Мгновенная обработка возвратов и частичных возмещений" 
          },
          { 
            title: "Умные платежные формы", 
            description: "Адаптивный дизайн с минимизацией полей для быстрой оплаты" 
          }
        ],
        benefits: "Увеличение конверсии оплат на 35%, снижение отказов на 40%"
      },
      {
        id: 5,
        name: "Система статусов заказов с трекингом",
        description: "Детальное отслеживание заказа с GPS-координатами курьера",
        fullDescription: "Прозрачная система мониторинга движения заказов от оформления до получения с предиктивной аналитикой времени доставки",
        icon: getIcon("Package"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Детализированные статусы", 
            description: "8-10 этапов обработки заказа с подробными уведомлениями" 
          },
          { 
            title: "GPS-трекинг курьеров", 
            description: "Отображение текущего местоположения с прогнозом прибытия" 
          },
          { 
            title: "Предиктивная аналитика", 
            description: "Расчет точного времени доставки с учетом загруженности дорог" 
          },
          { 
            title: "Мгновенные уведомления", 
            description: "Автоматические сообщения о смене статуса через Telegram" 
          },
          { 
            title: "Логистическая интеграция", 
            description: "Получение трек-номеров от транспортных компаний" 
          }
        ],
        benefits: "Снижение обращений в поддержку на 60%, рост лояльности на 40%"
      },
      {
        id: 6,
        name: "Виртуальная примерка AR",
        description: "AR-примерка мебели, одежды и аксессуаров через камеру",
        fullDescription: "Инновационная AR-технология для визуализации товаров в реальном пространстве прямо в Telegram Mini App",
        icon: getIcon("Sparkles"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Бесшовная AR-интеграция", 
            description: "Работа без необходимости установки дополнительных приложений" 
          },
          { 
            title: "Высокоточное распознавание", 
            description: "Определение размеров тела и лица с точностью до 98%" 
          },
          { 
            title: "Реалистичная визуализация", 
            description: "Точная передача фактуры и цвета материалов в AR" 
          },
          { 
            title: "Фотофиксация примерки", 
            description: "Сохранение фото товара в интерьере или на себе" 
          },
          { 
            title: "Мультитоварная примерка", 
            description: "Одновременная визуализация нескольких товаров для комплектов" 
          }
        ],
        benefits: "Снижение возвратов на 50%, рост конверсии на 45%"
      }
    ];

    // Данные о модулях
    const modulesData: Module[] = [
      // E-COMMERCE
      {
        id: 1,
        name: "Витрина товаров с AI-описаниями",
        description: "Революционная витрина с 20+ фильтрами и визуальным поиском",
        fullDescription: "Интеллектуальная система каталога с автоматической генерацией SEO-описаний через нейросети, визуальным поиском по фото с точностью 95% и персонализацией под каждого пользователя",
        icon: getIcon("Brain"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Нейросетевые описания товаров", 
            description: "Автоматическая генерация продающих текстов, сокращение времени наполнения каталога на 90%" 
          },
          { 
            title: "20+ типов умных фильтров", 
            description: "Адаптированы специально под компактный интерфейс Telegram" 
          },
          { 
            title: "Визуальный поиск по фото", 
            description: "Загрузка фотографии для быстрого поиска аналогов с точностью до 95%" 
          },
          { 
            title: "Динамическое ранжирование", 
            description: "Автоматическое ранжирование товаров на основе предпочтений пользователя" 
          },
          { 
            title: "Персонализация витрины", 
            description: "Адаптация отображаемого ассортимента под интересы пользователя" 
          }
        ],
        benefits: "Повышение конверсии на 40%, сокращение времени поиска на 60%"
      },
      {
        id: 2,
        name: "Карточка товара с 360° галереей",
        description: "Интерактивная презентация с 3D-просмотром и AR-примеркой",
        fullDescription: "Максимально вовлекающая карточка товара с возможностью кругового обзора, HD-зуммированием деталей и примеркой через камеру",
        icon: getIcon("Camera"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "3D-просмотр товаров", 
            description: "Интерактивное вращение на 360° с плавным масштабированием" 
          },
          { 
            title: "Видео-демонстрации", 
            description: "Встроенный плеер для просмотра обзоров без выхода из Telegram" 
          },
          { 
            title: "HD-зуммирование", 
            description: "Детальное рассмотрение материалов с 20-кратным увеличением" 
          },
          { 
            title: "AR-примерка", 
            description: "Визуализация товаров в реальном пространстве через камеру устройства" 
          },
          { 
            title: "Интерактивные хотспоты", 
            description: "Выделение и описание ключевых особенностей товара" 
          }
        ],
        benefits: "Снижение возвратов на 35%, увеличение среднего чека на 25%"
      },
      {
        id: 3,
        name: "Корзина с сохранением между сессиями",
        description: "Умная корзина с облачной синхронизацией и напоминаниями",
        fullDescription: "Интеллектуальная система управления корзиной с автосохранением, восстановлением брошенных покупок и персональными напоминаниями",
        icon: getIcon("ShoppingCart"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Синхронизация с аккаунтом Telegram", 
            description: "Мгновенное сохранение корзины при повторном открытии Mini App" 
          },
          { 
            title: "Облачное хранение данных", 
            description: "Сохранение содержимого корзины до 30 дней" 
          },
          { 
            title: "Восстановление прерванных сессий", 
            description: "Автоматическое восстановление корзины после закрытия приложения" 
          },
          { 
            title: "Интеллектуальные напоминания", 
            description: "Персонализированные уведомления о незавершенных покупках" 
          },
          { 
            title: "Аналитика поведения", 
            description: "Выявление паттернов, приводящих к отказу от покупки" 
          }
        ],
        benefits: "Восстановление 45% брошенных корзин, рост конверсии на 30%"
      },
      {
        id: 4,
        name: "Автоматический прием платежей",
        description: "15+ способов оплаты включая Telegram Stars и криптовалюты",
        fullDescription: "Универсальная платежная экосистема с поддержкой всех популярных методов оплаты и встроенной защитой от мошенничества",
        icon: getIcon("CreditCard"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Интеграция с Telegram Payments", 
            description: "Быстрая оплата через встроенные в Telegram платежные методы" 
          },
          { 
            title: "Мультиплатформенный прием", 
            description: "Поддержка карт, электронных кошельков, СБП и Telegram Stars" 
          },
          { 
            title: "Защита от мошенничества", 
            description: "ML-алгоритмы для выявления подозрительных операций" 
          },
          { 
            title: "Автоматические возвраты", 
            description: "Мгновенная обработка возвратов и частичных возмещений" 
          },
          { 
            title: "Умные платежные формы", 
            description: "Минимум полей для быстрой оплаты прямо в Telegram" 
          }
        ],
        benefits: "Увеличение конверсии оплат на 35%, снижение отказов на 40%"
      },
      {
        id: 5,
        name: "Система статусов заказов с трекингом",
        description: "Полная прозрачность от оформления до доставки",
        fullDescription: "Детализированное отслеживание заказа с GPS-трекингом курьера и автоматическими уведомлениями",
        icon: getIcon("Package"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Детализированный процесс", 
            description: "8-10 этапов статусов заказа с подробными уведомлениями" 
          },
          { 
            title: "GPS-трекинг курьера", 
            description: "Отображение текущего местоположения курьера на карте" 
          },
          { 
            title: "Предиктивная аналитика доставки", 
            description: "Расчет точного времени доставки с учетом загруженности дорог" 
          },
          { 
            title: "Мгновенные уведомления", 
            description: "Автоматические сообщения о смене статуса через Telegram" 
          },
          { 
            title: "Интеграция с логистическими сервисами", 
            description: "Автоматическое получение трек-номеров от транспортных компаний" 
          }
        ],
        benefits: "Снижение обращений в поддержку на 60%, рост лояльности на 40%"
      },
      {
        id: 6,
        name: "Управление доставкой",
        description: "Единый интерфейс для всех служб доставки (СДЭК, Boxberry)",
        fullDescription: "Комплексная автоматизация логистики с расчетом оптимального способа доставки и автоматической печатью документов",
        icon: getIcon("Warehouse"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Единый интерфейс управления", 
            description: "Централизованное управление отправками через разные службы доставки" 
          },
          { 
            title: "Автоматический расчет стоимости", 
            description: "Мгновенное определение оптимального способа доставки" 
          },
          { 
            title: "Печать документов", 
            description: "Автоматическое формирование этикеток и накладных" 
          },
          { 
            title: "Трекинг отправлений", 
            description: "Отслеживание статусов доставки с обновлением в Telegram" 
          },
          { 
            title: "Интеграция с маркетплейсами", 
            description: "Синхронизация заказов с Wildberries, Ozon, Яндекс.Маркет" 
          }
        ],
        benefits: "Экономия времени на логистику 70%, снижение ошибок на 90%"
      },
      {
        id: 7,
        name: "Виртуальная примерка AR",
        description: "Примерка товаров через камеру без установки приложений",
        fullDescription: "Инновационная AR-технология для визуализации товаров в реальном пространстве прямо в Telegram Mini App",
        icon: getIcon("Sparkles"),
        category: "E-COMMERCE",
        isPopular: true,
        features: [
          { 
            title: "Бесшовная AR-интеграция", 
            description: "Работа без необходимости установки дополнительных приложений" 
          },
          { 
            title: "Высокоточное распознавание", 
            description: "Определение размеров тела и лица с точностью до 98%" 
          },
          { 
            title: "Реалистичная визуализация", 
            description: "Точная передача фактуры и цвета материалов в AR" 
          },
          { 
            title: "Фотофиксация примерки", 
            description: "Сохранение фото товара в интерьере или на себе" 
          },
          { 
            title: "Мультитоварная примерка", 
            description: "Одновременная визуализация нескольких товаров для комплектов" 
          }
        ],
        benefits: "Снижение возвратов на 50%, рост конверсии на 45%"
      },
      {
        id: 8,
        name: "Система промокодов и скидок",
        description: "Гибкие механизмы ценообразования и акций",
        fullDescription: "Мощный инструмент стимулирования продаж с многоуровневыми скидками и персональными предложениями",
        icon: getIcon("Gift"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Многоуровневые скидки", 
            description: "Создание сложных правил с комбинированием различных условий" 
          },
          { 
            title: "Временные ограничения", 
            description: "Настройка промокодов с точным периодом действия до минут" 
          },
          { 
            title: "Персональные промокоды", 
            description: "Генерация уникальных одноразовых кодов для конкретных пользователей" 
          },
          { 
            title: "Автоматические скидки", 
            description: "Применение скидок на основе состава корзины и поведения" 
          },
          { 
            title: "Защита от злоупотреблений", 
            description: "Система предотвращения мошенничества с промокодами" 
          }
        ],
        benefits: "Рост среднего чека на 20%, увеличение повторных покупок на 35%"
      },
      {
        id: 9,
        name: "Кросс-продажи с умными рекомендациями",
        description: "AI-рекомендации для увеличения среднего чека",
        fullDescription: "Интеллектуальная система персонализированных предложений на основе машинного обучения",
        icon: getIcon("TrendingUp"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "ML-анализ покупок", 
            description: "Анализ покупательских паттернов для выявления связей между товарами" 
          },
          { 
            title: "Контекстные рекомендации", 
            description: "Динамические предложения в зависимости от этапа покупки" 
          },
          { 
            title: "Персонализированная выдача", 
            description: "Рекомендации на основе предыдущих покупок и просмотров" 
          },
          { 
            title: "Автоматические комплекты", 
            description: "Создание готовых наборов товаров со специальной ценой" 
          },
          { 
            title: "A/B тестирование стратегий", 
            description: "Автоматический подбор оптимальных алгоритмов рекомендаций" 
          }
        ],
        benefits: "Увеличение среднего чека на 30-40%, рост LTV на 25%"
      },
      {
        id: 10,
        name: "Быстрый повтор заказа в один клик",
        description: "Мгновенное переоформление предыдущих покупок",
        fullDescription: "Инструмент для максимального упрощения повторных покупок с сохранением всех данных",
        icon: getIcon("Rocket"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Шаблоны заказов", 
            description: "Сохранение истории заказов с возможностью быстрого повторения" 
          },
          { 
            title: "Умные напоминания", 
            description: "Автоматическое определение оптимального момента для напоминания" 
          },
          { 
            title: "Предзаполненные формы", 
            description: "Сохранение всех данных без повторного ввода" 
          },
          { 
            title: "Отслеживание расходных материалов", 
            description: "Интеллектуальное отслеживание периодичности заказов" 
          },
          { 
            title: "Экспресс-доставка", 
            description: "Приоритетная обработка повторных заказов" 
          }
        ],
        benefits: "Рост повторных продаж на 60%, увеличение LTV на 40%"
      },
      {
        id: 11,
        name: "Групповые покупки со скидками",
        description: "Социальные продажи с прогрессивными скидками",
        fullDescription: "Механизм коллективных покупок с автоматическим снижением цены при росте участников",
        icon: getIcon("Users"),
        category: "E-COMMERCE",
        features: [
          { 
            title: "Динамическое ценообразование", 
            description: "Автоматическое снижение цены при достижении пороговых значений участников" 
          },
          { 
            title: "Таймеры обратного отсчета", 
            description: "Создание ощущения срочности с ограниченным временем" 
          },
          { 
            title: "Интеграция с чатами Telegram", 
            description: "Инструменты для приглашения друзей через чаты и каналы" 
          },
          { 
            title: "Прозрачный прогресс", 
            description: "Наглядное отображение текущего статуса группы" 
          },
          { 
            title: "Автоматические уведомления", 
            description: "Информирование участников о статусе покупки через бота" 
          }
        ],
        benefits: "Вирусный рост продаж на 80%, увеличение охвата на 150%"
      },
      // МАРКЕТИНГ
      {
        id: 16,
        name: "AI-персонализация и рекомендации",
        description: "ML-система для создания уникального опыта для каждого клиента",
        fullDescription: "Продвинутая система машинного обучения, анализирующая 50+ факторов поведения для точной персонализации контента и предложений",
        icon: getIcon("Brain"),
        category: "МАРКЕТИНГ",
        isPopular: true,
        features: [
          { 
            title: "Анализ 50+ факторов", 
            description: "Комплексная обработка взаимодействия пользователя с Mini App" 
          },
          { 
            title: "Динамическая персонализация", 
            description: "Автоматическая адаптация контента под каждого пользователя" 
          },
          { 
            title: "Предиктивные рекомендации", 
            description: "Прогнозирование интереса к товарам с точностью до 85%" 
          },
          { 
            title: "Микросегментация", 
            description: "Распределение пользователей для таргетированных кампаний" 
          },
          { 
            title: "Самообучающиеся алгоритмы", 
            description: "Постоянное улучшение рекомендаций на основе обратной связи" 
          }
        ],
        benefits: "Рост конверсии на 45%, увеличение среднего чека на 35%"
      },
      {
        id: 17,
        name: "Дашборд бизнес-аналитики",
        description: "15+ готовых отчетов с real-time метриками и прогнозами",
        fullDescription: "Комплексное решение для визуализации и анализа ключевых показателей вашего Telegram Mini App",
        icon: getIcon("BarChart3"),
        category: "МАРКЕТИНГ",
        isPopular: true,
        features: [
          { 
            title: "15+ готовых отчетов", 
            description: "Настраиваемые отчеты по всем критическим бизнес-метрикам" 
          },
          { 
            title: "Real-time мониторинг", 
            description: "Отображение показателей с минимальной задержкой" 
          },
          { 
            title: "Многоуровневые воронки", 
            description: "Анализ пути пользователя с выявлением проблемных этапов" 
          },
          { 
            title: "Когортный анализ", 
            description: "Сегментация пользователей для оценки долгосрочной ценности" 
          },
          { 
            title: "Предиктивная аналитика", 
            description: "Прогнозирование показателей на основе исторических данных" 
          }
        ],
        benefits: "Ускорение принятия решений на 60%, рост ROI на 40%"
      },
      {
        id: 18,
        name: "A/B тестирование интерфейсов",
        description: "Многовариантное тестирование для оптимизации конверсии",
        fullDescription: "Научный подход к оптимизации через экспериментальную проверку гипотез с автоматическим определением победителя",
        icon: getIcon("Target"),
        category: "МАРКЕТИНГ",
        features: [
          { 
            title: "Многовариантное тестирование", 
            description: "Сравнение до 10 версий элементов интерфейса одновременно" 
          },
          { 
            title: "Статистическая достоверность", 
            description: "Расчет размера выборки и определение победителя" 
          },
          { 
            title: "Таргетированные эксперименты", 
            description: "Тестирование на определенных сегментах аудитории" 
          },
          { 
            title: "Визуальный редактор", 
            description: "Создание вариаций без необходимости программирования" 
          },
          { 
            title: "Комплексная аналитика", 
            description: "Оценка влияния изменений на ключевые бизнес-показатели" 
          }
        ],
        benefits: "Рост конверсии на 25-40% через оптимизацию"
      }
    ];

    // Данные модулей - ВОВЛЕЧЕНИЕ
    const engagementModules: Module[] = [
      {
        id: 29,
        name: "Многоуровневые VIP-статусы",
        description: "5-7 уровней лояльности с эксклюзивными привилегиями",
        fullDescription: "Продвинутая система статусов для стимулирования долгосрочной лояльности клиентов в Telegram Mini App",
        icon: getIcon("Award"),
        category: "ВОВЛЕЧЕНИЕ",
        isPopular: true,
        features: [
          { 
            title: "Иерархия из 5-7 уровней", 
            description: "Уровни с увеличивающимися привилегиями и возможностями" 
          },
          { 
            title: "Прозрачные условия перехода", 
            description: "Четкие метрики для повышения статуса пользователя" 
          },
          { 
            title: "Персонализированные привилегии", 
            description: "Уникальные бонусы для каждого уровня" 
          },
          { 
            title: "Защита от понижения", 
            description: "Механизм сохранения статуса при временной неактивности" 
          },
          { 
            title: "Эксклюзивные возможности", 
            description: "Доступ к специальным предложениям для VIP-пользователей" 
          }
        ],
        benefits: "Рост LTV на 80%, увеличение retention на 65%"
      },
      {
        id: 31,
        name: "Ежедневные задания со streak-системой",
        description: "Система формирования привычек через дейли-квесты",
        fullDescription: "Механика создания устойчивых привычек использования Telegram Mini App через регулярные персонализированные задания",
        icon: getIcon("Calendar"),
        category: "ВОВЛЕЧЕНИЕ",
        isPopular: true,
        features: [
          { 
            title: "Персонализированные квесты", 
            description: "Адаптивные задания под интересы пользователя" 
          },
          { 
            title: "Система стриков", 
            description: "Накопление серий с растущими наградами" 
          },
          { 
            title: "Визуализация прогресса", 
            description: "Интерактивный календарь с отметками успешных дней" 
          },
          { 
            title: "Защита от пропусков", 
            description: "Страховки от прерывания серии активности" 
          },
          { 
            title: "Каскадные награды", 
            description: "Специальные бонусы за достижение ключевых этапов" 
          }
        ],
        benefits: "Рост DAU на 60%, увеличение retention D30 на 50%"
      },
      {
        id: 35,
        name: "Геймификация всех действий",
        description: "Комплексная система игровых механик с наградами",
        fullDescription: "Комплексная система игровых механик, трансформирующая весь пользовательский опыт в увлекательную игру",
        icon: getIcon("Gamepad2"),
        category: "ВОВЛЕЧЕНИЕ",
        features: [
          { 
            title: "Система опыта и уровней", 
            description: "Начисление XP за все типы взаимодействий с приложением" 
          },
          { 
            title: "Дерево развития", 
            description: "Нелинейная система прогрессии с выбором направлений" 
          },
          { 
            title: "Внутренняя экономика", 
            description: "Виртуальная валюта и коллекционные предметы" 
          },
          { 
            title: "Квесты и миссии", 
            description: "Разнообразные задания с уникальными наградами" 
          },
          { 
            title: "Сезонные события", 
            description: "Регулярные мероприятия с эксклюзивными активностями" 
          }
        ],
        benefits: "Рост времени в приложении на 120%, retention +80%"
      }
    ];

    // Данные модулей - ОБРАЗОВАНИЕ
    const educationModules: Module[] = [
      {
        id: 41,
        name: "Платформа курсов с видео и тестами",
        description: "Комплексное решение для онлайн-обучения в Telegram",
        fullDescription: "Полноценная LMS-система внутри Telegram с видео, интерактивными тестами и системой отслеживания прогресса",
        icon: getIcon("GraduationCap"),
        category: "ОБРАЗОВАНИЕ",
        isPopular: true,
        features: [
          { 
            title: "Адаптивный видеоплеер", 
            description: "Оптимизированное воспроизведение с регулировкой качества" 
          },
          { 
            title: "Интерактивные таймкоды", 
            description: "Навигация по ключевым моментам видеоконтента" 
          },
          { 
            title: "Многоязычные субтитры", 
            description: "Автоматическая генерация и переключение языков" 
          },
          { 
            title: "Встроенные тесты", 
            description: "Тесты и задания, интегрированные непосредственно в видео" 
          },
          { 
            title: "Синхронизация прогресса", 
            description: "Сохранение позиции просмотра между устройствами" 
          }
        ],
        benefits: "Завершаемость курсов 70%, рост вовлеченности на 85%"
      },
      {
        id: 44,
        name: "Система вебинаров и прямых эфиров",
        description: "HD-трансляции с интерактивными инструментами",
        fullDescription: "Профессиональная платформа для проведения онлайн-мероприятий и обучающих трансляций в Telegram",
        icon: getIcon("Video"),
        category: "ОБРАЗОВАНИЕ",
        isPopular: true,
        features: [
          { 
            title: "HD-трансляция", 
            description: "Высококачественный стриминг с адаптивным битрейтом" 
          },
          { 
            title: "Интерактивные инструменты", 
            description: "Встроенные опросы, вопросы, реакции и чат" 
          },
          { 
            title: "Демонстрация экрана", 
            description: "Показ презентаций с поддержкой аннотаций" 
          },
          { 
            title: "Автоматическая запись", 
            description: "Сохранение трансляций для последующего просмотра" 
          },
          { 
            title: "Оповещения в Telegram", 
            description: "Уведомления о предстоящих трансляциях" 
          }
        ],
        benefits: "Охват аудитории x5, конверсия в продажи 15%"
      }
    ];

    // Данные модулей - ФИНТЕХ
    const fintechModules: Module[] = [
      {
        id: 73,
        name: "Прием Telegram Stars",
        description: "0% комиссия на платежи внутри Telegram",
        fullDescription: "Нативная интеграция с внутренней валютой Telegram для мгновенных платежей без комиссии",
        icon: getIcon("Star"),
        category: "ФИНТЕХ",
        isPopular: true,
        features: [
          { 
            title: "Нулевая комиссия", 
            description: "Отсутствие дополнительных сборов за использование" 
          },
          { 
            title: "Мгновенные транзакции", 
            description: "Моментальное зачисление средств без задержек" 
          },
          { 
            title: "Автоматическая конвертация", 
            description: "Перевод Stars в фиатные валюты по актуальному курсу" 
          },
          { 
            title: "Защищенные платежи", 
            description: "Многоуровневая система безопасности с верификацией" 
          },
          { 
            title: "Нативная интеграция", 
            description: "Прямое подключение к экосистеме Telegram" 
          }
        ],
        benefits: "Конверсия платежей +35%, экономия на комиссиях 5-10%"
      },
      {
        id: 69,
        name: "Платежи для России и СНГ",
        description: "Интеграция со СБП, YooKassa и картами МИР",
        fullDescription: "Оптимизированное решение для приема платежей от российской аудитории с минимальными комиссиями",
        icon: getIcon("CreditCard"),
        category: "ФИНТЕХ",
        isPopular: true,
        features: [
          { 
            title: "СБП интеграция", 
            description: "Прием оплаты по QR-коду с минимальными комиссиями" 
          },
          { 
            title: "Поддержка карт МИР", 
            description: "Полная интеграция с национальной платежной системой" 
          },
          { 
            title: "SberPay, Tinkoff Pay", 
            description: "Подключение популярных pay-сервисов российских банков" 
          },
          { 
            title: "ЮKassa и CloudPayments", 
            description: "Интеграция с ведущими платежными агрегаторами" 
          },
          { 
            title: "Автоматическая фискализация", 
            description: "Соответствие 54-ФЗ с отправкой чеков" 
          }
        ],
        benefits: "Успешность транзакций +40%, снижение комиссий на 1%"
      }
    ];

    // Объединение всех модулей
    const modulesData: Module[] = [
      ...ecommerceModules,
      ...marketingModules,
      ...engagementModules,
      ...educationModules,
      ...fintechModules
    ];

    // Компонент карточки модуля
    const ModuleCard: React.FC<{
      module: Module;
      onClick: (module: Module) => void;
    }> = ({ module, onClick }) => {
      return (
        <Card 
          className="h-full flex flex-col overflow-hidden cursor-pointer transition-all hover:shadow-md"
          onClick={() => onClick(module)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start mb-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                {module.icon}
              </div>
              {module.isPopular && (
                <Badge variant="secondary" className="ml-auto">
                  Популярный
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg mt-2">{module.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{module.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-xs text-muted-foreground">{module.benefits}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              Подробнее
            </Button>
          </CardFooter>
        </Card>
      );
    };

    // Модальное окно с детальной информацией о модуле
    const ModuleDetailModal: React.FC<{
      module: Module | null;
      isOpen: boolean;
      onClose: () => void;
    }> = ({ module, isOpen, onClose }) => {
      if (!module) return null;

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {module.icon}
                </div>
                <div className="flex-grow">
                  <DialogTitle className="text-xl flex items-center gap-2">
                    {module.name}
                    {module.isPopular && <Badge variant="secondary">Популярный</Badge>}
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {module.category}
                  </DialogDescription>
                </div>
              </div>
              <p className="mt-4 text-base">
                {module.fullDescription || module.description}
              </p>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Ключевые возможности</h3>
                <div className="space-y-3">
                  {module.features.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/20 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Основные преимущества:</h3>
                <p>{module.benefits}</p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>Закрыть</Button>
              <Button>Добавить модуль</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    // Основной компонент страницы
    export default function ModulesPage() {
      const [activeCategory, setActiveCategory] = useState<string>("all");
      const [searchQuery, setSearchQuery] = useState<string>("");
      const [selectedModule, setSelectedModule] = useState<Module | null>(null);
      const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
      const [showPopularOnly, setShowPopularOnly] = useState<boolean>(false);

      // Получаем уникальные категории
      const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(modulesData.map(module => module.category)));
        return ["all", ...uniqueCategories];
      }, []);

      // Фильтрация модулей по категории, поисковому запросу и популярности
      const filteredModules = useMemo(() => {
        return modulesData.filter(module => {
          const matchesCategory = activeCategory === "all" || module.category === activeCategory;
          const matchesSearch = 
            module.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            module.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesPopular = showPopularOnly ? module.isPopular === true : true;

          return matchesCategory && matchesSearch && matchesPopular;
        });
      }, [activeCategory, searchQuery, showPopularOnly]);

      // Обработчики событий
      const handleModuleClick = (module: Module) => {
        setSelectedModule(module);
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      };

      const handleTogglePopular = () => {
        setShowPopularOnly(!showPopularOnly);
      };

      return (
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Модули для Telegram Mini App</h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Выберите подходящие модули для вашего проекта
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6"> </Button>
            <div className="flex-grow relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input eCategory}>tailsModal 
                placeholder="Поиск модулей..." uto">selectedModule}
                className="pl-9"lue="all">Все модули</TabsTrigger>
                value={searchQuery}      {categories.filter(c => c !== 'all').map(category => (
                onChange={handleSearchChange}            <TabsTrigger key={category} value={category}>
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={showPopularOnly ? "default" : "outline"} 
                onClick={handleTogglePopular}t-2">
                className="flex items-center gap-2"ap-6">
              >filteredModules.map((module) => (
                <Star className="h-4 w-4" />
                Популярные
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Фильтры))}
              </Button>          </div>
            </div>
          </div>y-12">

          <Tabs value={activeCategory} onValueChange={setActiveCategory}> className="text-muted-foreground">
            <TabsList className="mb-6 flex-wrap h-auto">вый запрос или выбрать другую категорию
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category === "all" ? "Все модули" : category}
                </TabsTrigger>bsContent>
              ))}
            </TabsList>

            <TabsContent value={activeCategory}>electedModule}
              {filteredModules.length > 0 ? (sModalOpen}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">ose={closeModal}
                  {filteredModules.map((module) => (      />
                    <ModuleCard
                      key={module.id}
                      module={module}
                      onClick={handleModuleClick}
                    />
                  ))}me="text-lg">Модули не найдены</p>
                </div>="text-muted-foreground">
              ) : (   Попробуйте изменить поисковый запрос или выбрать другую категорию
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Модули не найдены</h3>            </div>
                  <p className="text-muted-foreground mt-2">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          {closeModal}
          <ModuleDetailModal 
            module={selectedModule}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      );
    }
                </div>
              )}
            </TabsContent>
          </Tabs>

          <ModuleDetailModal 
            module={selectedModule}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      );
    }
              {filteredModules.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg">Модули не найдены</p>
                  <p className="text-muted-foreground">
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <ModuleDetailModal 
            module={selectedModule}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      );
    }
            title: "Оптимальный тайминг", 
            description: "Автоматический подбор времени для максимальной конверсии" 
          },k: (module: Module) => void;
          { module, onClick }) => {
            title: "Ограничение частоты", 
            description: "Защита от чрезмерного давления на пользователя" 
          }lassName="overflow-hidden cursor-pointer transition-all hover:shadow-md"
        ],onClick={() => onClick(module)}
        benefits: "Возврат 30% пользователей, ROI кампаний 400%"
      }   <CardContent className="p-6 flex flex-col h-full">
    ];      <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">">
                {module.icon}
              </div>>
              {module.isPopular && (
                <Badge variant="secondary" className="ml-auto">
                  Популярный
                </Badge>
              )}
            </div>кно с детальной информацией о модуле
            <CardTitle className="text-lg mt-2">{module.name}</CardTitle>
            <CardDescription className="text-sm">{module.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">) => void;
            <p className="text-xs text-muted-foreground">{module.benefits}</p>
          </CardContent>rn null;
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full">
              Подробнее open={open} onOpenChange={onClose}>
            </Button>  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          </CardFooter>      <DialogHeader>
        </Card>          <div className="flex items-center gap-2 mb-2">
      );ded-lg">
    };

    // Детальное модальное окно для модуляlogTitle className="text-xl">{module.name}</DialogTitle>
    const ModuleDetailModal: React.FC<{Popular && (
      module: Module | null;ry">Популярный</Badge>
      isOpen: boolean;
      onClose: () => void;          </div>
    }> = ({ module, isOpen, onClose }) => {<DialogDescription className="text-base pt-2">
      if (!module) return null;

      return (>
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>nt-semibold text-lg mb-3">Ключевые возможности</h3>
              <div className="flex items-center gap-3">ssName="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  {module.icon}ssName="border rounded-lg p-3">
                </div>}</div>
                <div>  <div className="text-sm text-muted-foreground">{feature.description}</div>
                  <DialogTitle className="text-xl">{module.name}</DialogTitle>div>
                  <DialogDescription className="text-md">
                    {module.description}
                  </DialogDescription>
                </div>e="mt-6 bg-secondary/30 p-4 rounded-lg">
                {module.isPopular && (    <h3 className="font-semibold">Основные преимущества:</h3>
                  <Badge variant="secondary" className="ml-auto">">{module.benefits}</p>
                    Популярный
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="my-4">
              <p className="text-sm text-muted-foreground mb-4">понент страницы модулей
                {module.fullDescription || module.description}unction ModulesPage() {
              </p>ctiveCategory, setActiveCategory] = useState("all");

              <h3 className="text-lg font-semibold mb-3">Ключевые возможности</h3>(null);
              <div className="space-y-3">e);
                {module.features.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-3"> модулей
                    <h4 className="font-medium">{feature.title}</h4>seMemo(() => {
                    <p className="text-sm text-muted-foreground">{feature.description}</p>s = ['all', ...Array.from(new Set(modulesData.map(m => m.category)))];
                  </div>return cats;
                ))}}, []);
              </div>
     поисковому запросу
              <div className="mt-6 p-4 bg-primary/5 rounded-lg"> {
                <h3 className="font-semibold mb-2">Основные преимущества:</h3>
                <p>{module.benefits}</p>' || module.category === activeCategory;
              </div>oLowerCase()) || 
            </div>e().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Закрыть
              </Button>duleClick = (module: Module) => {
              <Button>Добавить модуль</Button>lectedModule(module);
            </DialogFooter>    setIsModalOpen(true);
          </DialogContent>
        </Dialog>
      );
    };

    // Основной компонент страницы модулей
    export default function ModulesPage() {
      const [activeCategory, setActiveCategory] = useState("all");v className="container mx-auto py-8">
      const [searchQuery, setSearchQuery] = useState("");etween items-center mb-8">
      const [selectedModule, setSelectedModule] = useState<Module | null>(null);        <div>
      const [isModalOpen, setIsModalOpen] = useState(false);ли для Telegram Mini App</h1>
    uted-foreground mt-1">
      // Категории модулейодящие модули для вашего проекта из каталога
      const categories = useMemo(() => {      </p>
        const cats = ['all', ...Array.from(new Set(modulesData.map(m => m.category)))];        </div>
        return cats;
      }, []);
      <div className="mb-6 flex gap-4 flex-col sm:flex-row">
      // Фильтрация модулей по категории и поисковому запросу        <div className="relative flex-1">
      const filteredModules = useMemo(() => {<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        return modulesData.filter(module => {
          const matchesCategory = activeCategory === 'all' || module.category === activeCategory;
          const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) || lassName="pl-8"
                               module.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;.value)}
        });
      }, [activeCategory, searchQuery]);
    n variant="outline" className="flex items-center gap-2">
      const handleModuleClick = (module: Module) => {ilter className="h-4 w-4" />
        setSelectedModule(module);          Фильтры
        setIsModalOpen(true);
      };

      const closeModal = () => {ultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        setIsModalOpen(false);p h-auto">
      };="all">Все модули</TabsTrigger>
    => c !== 'all').map(category => (
      return (
        <div className="container mx-auto py-8">  {category}
          <div className="flex justify-between items-center mb-8">TabsTrigger>
            <div>
              <h1 className="text-3xl font-bold">Модули для Telegram Mini App</h1>
              <p className="text-muted-foreground mt-1">
                Выберите подходящие модули для вашего проекта из каталогаent value={activeCategory} className="mt-2">
              </p>iv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            </div>            {filteredModules.map((module) => (
          </div>

          <div className="mb-6 flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск модулей..."
                className="pl-8"lteredModules.length === 0 && (
                value={searchQuery}assName="text-center py-12">
                onChange={(e) => setSearchQuery(e.target.value)}              <p className="text-lg">Модули не найдены</p>
              />
            </div>ю
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фильтры
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>tailsModal 
            <TabsList className="mb-8 flex-wrap h-auto">selectedModule}
              <TabsTrigger value="all">Все модули</TabsTrigger>
              {categories.filter(c => c !== 'all').map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module}
                    onClick={handleModuleClick}
                  />
                ))}
              </div>
              {filteredModules.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg">Модули не найдены</p>
                  <p className="text-muted-foreground">
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <ModuleDetailModal 
            module={selectedModule}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      );
    }
              {filteredModules.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg">Модули не найдены</p>
                  <p className="text-muted-foreground">
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <ModuleDetailModal 
            module={selectedModule}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        </div>
      );
    }
