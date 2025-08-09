import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleCard } from "@/components/ModuleCard";
import { Grid3X3, Filter, Building2, Search, List } from "lucide-react";
import { type Module, type Industry } from "@shared/schema";
import { moduleCategories } from "@/data/modules";

export default function Modules() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const { data: industries = [] } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });

  // Create modules from our comprehensive data with proper descriptions
  const moduleDescriptions: Record<string, string> = {
    // E-COMMERCE И ПРОДАЖИ
    "Витрина товаров с AI-описаниями и умными фильтрами": "Автоматическое создание SEO-оптимизированных описаний товаров, интеллектуальная фильтрация по 20+ параметрам",
    "Карточка товара с 360° галереей и видео-обзорами": "Интерактивный 3D-просмотр товаров, встроенный видеоплеер с таймкодами для демонстрации функций",
    "Корзина с сохранением между сессиями": "Облачная синхронизация корзины между устройствами, автоматическое восстановление брошенных корзин",
    "Автоматический прием платежей (Telegram Stars, карты, СБП, крипта)": "Мультивалютный процессинг с автоматической конвертацией, защита от мошенничества",
    "Система статусов заказов с real-time трекингом": "GPS-отслеживание курьера на карте, автоматические push-уведомления на каждом этапе",
    "Интеграция с СДЭК, Boxberry, Почтой России": "Автоматический расчет стоимости доставки, выбор ПВЗ на карте, печать этикеток",
    "Управление складом и остатками в реальном времени": "Синхронизация с 1С, автоматическое резервирование товаров, учет по складам",
    "QR-коды для быстрых покупок в офлайне": "Генерация уникальных QR для каждого товара, мгновенная оплата через телефон",
    
    // МАРКЕТИНГ И АНАЛИТИКА
    "AI-персонализация с умными рекомендациями": "Машинное обучение на основе 50+ факторов поведения для точных рекомендаций",
    "Дашборд бизнес-аналитики с real-time метриками": "15+ готовых отчетов, воронки продаж, когортный анализ, прогнозирование",
    "Система промокодов и купонов с ограничениями": "Гибкие условия применения, временные рамки, персональные скидки",
    "Email и SMS рассылки с сегментацией": "Автоматические цепочки писем, A/B тестирование, отслеживание конверсий",
    "Интеграция с Google Analytics и Яндекс.Метрикой": "Автоматическая разметка событий, расширенная электронная торговля",
    "Реферальная программа с многоуровневыми вознаграждениями": "Автоматическое начисление бонусов, партнерские ссылки, статистика",
    "A/B тестирование и оптимизация конверсий": "Сплит-тесты страниц, автоматический выбор победителя, тепловые карты",
    "Система отзывов и рейтингов с модерацией": "Верификация покупок, фото-отзывы, автоматическая модерация спама",
    
    // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ
    "Многоуровневые VIP-статусы с привилегиями": "Автоматическое повышение статуса, эксклюзивные предложения, приоритетная поддержка",
    "Программа лояльности с начислением баллов": "Гибкие правила начисления, обмен на товары, срок действия баллов",
    "Ежедневные задания и streak-система": "Геймификация с наградами, ежедневные бонусы за активность, достижения",
    "Колесо фортуны и мини-игры для вовлечения": "Настраиваемые призы, ограничение попыток, виральные механики",
    "Push-уведомления с персонализацией по поведению": "Умное время отправки, сегментация, rich-уведомления с изображениями",
    "Система достижений и бейджей за активность": "50+ готовых достижений, прогресс-бары, социальное признание",
    "Реферальная система с вознаграждениями": "Двусторонние бонусы, отслеживание конверсий, партнерский кабинет",
    "Социальный граф и взаимодействие между пользователями": "Подписки, лайки, комментарии, приватные сообщения",
    
    // ОБРАЗОВАНИЕ И ОБУЧЕНИЕ
    "Платформа курсов с видео и интерактивными тестами": "Адаптивное видео, таймкоды, субтитры, интерактивные задания внутри видео",
    "Система сертификатов и дипломов с верификацией": "Блокчейн-верификация, QR-коды для проверки, интеграция с LinkedIn",
    "Вебинары и live-стримы с чатом": "До 1000 участников, запись трансляций, модерация чата, опросы",
    "Домашние задания с проверкой и обратной связью": "Автопроверка тестов, peer-review, комментарии преподавателя",
    "Трекинг прогресса обучения и статистика": "Индивидуальный план, напоминания, аналитика по группам",
    "Библиотека материалов с поиском и фильтрами": "Полнотекстовый поиск, теги, избранное, офлайн-доступ",
    "Форум для общения студентов и менторов": "Вопросы-ответы, лучшие решения, репутация участников",
    "Расписание занятий с напоминаниями": "Синхронизация с календарем, часовые пояса, перенос занятий",
    
    // СЕРВИСЫ И БРОНИРОВАНИЕ
    "Онлайн-запись с календарем в реальном времени": "Синхронизация с Google Calendar, блокировка слотов, напоминания клиентам",
    "Управление расписанием специалистов": "Индивидуальные графики, отпуска, замены, учет загрузки",
    "Система очередей с уведомлениями о готовности": "Электронная очередь, SMS когда подойдет очередь, перенос времени",
    "Предоплата и депозиты при бронировании": "Частичная оплата, возвраты, штрафы за неявку",
    "Отзывы о специалистах с рейтингами": "Верифицированные отзывы, фото работ, портфолио мастеров",
    "CRM для управления клиентской базой": "История визитов, предпочтения, дни рождения, автосегментация",
    "Калькулятор стоимости услуг с опциями": "Динамическое ценообразование, пакеты услуг, сезонные цены",
    "Видеоконсультации и удаленные услуги": "Встроенный видеозвонок, демонстрация экрана, запись консультаций",
    
    // ФИНТЕХ И ПЛАТЕЖИ
    "Прием Telegram Stars (0% комиссия)": "Мгновенные переводы без комиссий, автоматическая конвертация в рубли",
    "Мультивалютный кошелек с конвертацией": "20+ валют, выгодные курсы, история операций, лимиты",
    "P2P переводы между пользователями": "Переводы по номеру телефона, запросы на оплату, разделение счета",
    "Криптовалютные платежи (Bitcoin, USDT, TON)": "Автоматическая конвертация, холодные кошельки, минимальные комиссии",
    "Рассрочка и кредитование через партнеров": "Интеграция с Тинькофф, Сбер, одобрение за 2 минуты",
    "Система подписок и рекуррентных платежей": "Автопродление, пробные периоды, управление подписками",
    "Выставление счетов и актов для юрлиц": "Автоматическая генерация документов, ЭДО, интеграция с 1С",
    "Эквайринг для офлайн-точек через QR": "Прием платежей без терминала, моментальное зачисление",
    
    // КОНТЕНТ И МЕДИА
    "Лента новостей с алгоритмической подачей": "Умная лента на основе интересов, приоритеты, скрытие неинтересного",
    "Встроенный блог с редактором и SEO": "WYSIWYG редактор, метатеги, sitemap, AMP-версии",
    "Галерея фото/видео с категориями": "Автоматическая обработка, водяные знаки, защита от скачивания",
    "Подкасты и аудиоконтент с плейлистами": "Фоновое воспроизведение, закладки, скорость воспроизведения",
    "Прямые трансляции и stories": "Эфемерный контент, реакции, опросы, стикеры, музыка",
    "Система комментариев с модерацией": "Древовидные комментарии, реакции, автомодерация, жалобы",
    "Генерация контента через AI (тексты, изображения)": "GPT для текстов, DALL-E для изображений, автопостинг",
    "Планировщик публикаций и контент-календарь": "Отложенный постинг, оптимальное время, календарный вид"
  };

  const allModules = Object.entries(moduleCategories).flatMap(([category, moduleList]) =>
    moduleList.map((moduleName, index) => {
      const cleanName = moduleName.split('(')[0].trim();
      return {
        id: `${category}-${index}`,
        name: cleanName,
        description: moduleDescriptions[cleanName] || moduleDescriptions[moduleName] || `Автоматизация процессов и улучшение клиентского опыта в категории ${category.toLowerCase()}`,
        fullName: moduleName,
        category,
        isPopular: index < 3,
        tags: [category.toLowerCase()]
      };
    })
  );

  const filteredModules = allModules.filter(module => {
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            60+ готовых модулей
          </h1>
          <p className="text-gray-600">
            Выбирайте и комбинируйте нужные функции для вашего приложения
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск модулей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Категории ({Object.keys(moduleCategories).length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    className={`w-full justify-between ${
                      selectedCategory === "all" ? "bg-telegram hover:bg-telegram/90" : ""
                    }`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    <span className="flex items-center">
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Все модули
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {allModules.length}
                    </Badge>
                  </Button>
                  
                  {Object.entries(moduleCategories).map(([category, categoryModules]) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className={`w-full justify-between text-left ${
                        selectedCategory === category ? "bg-telegram hover:bg-telegram/90" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span className="truncate pr-2">{category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryModules.length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules Grid */}
          <div className="lg:col-span-9">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mr-3">
                  {selectedCategory === "all" ? "Все модули" : selectedCategory}
                </h2>
                <Badge variant="outline" className="text-telegram">
                  {filteredModules.length} модулей
                </Badge>
              </div>
            </div>
            
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "lg:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredModules.map((module) => (
                <Card key={module.id} className={`${
                  viewMode === "list" ? "p-4" : "p-6"
                } hover:shadow-md transition-shadow`}>
                  <div className={`${
                    viewMode === "list" ? "flex items-center justify-between" : ""
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{module.name}</h3>
                        {module.isPopular && (
                          <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">
                            Популярный
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                    </div>
                    {viewMode === "list" && (
                      <Button variant="outline" size="sm" className="ml-4">
                        Подробнее
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              
              {filteredModules.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    Модули не найдены. Попробуйте изменить поисковый запрос или категорию.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Industries */}
        <div className="mt-12 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Отрасли, которые используют наши модули
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.slice(0, 6).map((industry) => (
              <Card key={industry.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-telegram/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-telegram" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{industry.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{industry.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-12 bg-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Все модули доступны из коробки
          </h3>
          <p className="text-gray-600 mb-6">
            Каждый модуль включает полную функциональность, настройку под ваш бренд 
            и интеграцию с Telegram API
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-telegram mb-1">$300</div>
              <div className="text-sm text-gray-600">Единовременная стоимость</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-telegram mb-1">$15</div>
              <div className="text-sm text-gray-600">Ежемесячная поддержка</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-telegram mb-1">1-5</div>
              <div className="text-sm text-gray-600">Дней до запуска</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
