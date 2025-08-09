import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleCard } from "@/components/ModuleCard";
import { Grid3X3, Filter, Building2, Search, List, ArrowRight } from "lucide-react";
import { type Module, type Industry } from "@shared/schema";
import { moduleCategories } from "@/data/modules";
import { ModuleModal } from "@/components/ModuleModal";

export default function Modules() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const { data: industries = [] } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });

  // Create modules from our comprehensive data with proper descriptions
  const moduleDescriptions: Record<string, string> = {
    // E-COMMERCE И ПРОДАЖИ
    "Витрина товаров с AI-описаниями и умными фильтрами": "Интеллектуальная система каталога с автоматической генерацией SEO-описаний через нейросети, 20+ типов фильтров и визуальным поиском по фото",
    "Карточка товара с 360° галереей и видео-обзорами": "Интерактивные карточки с 3D-просмотром, встроенным видеоплеером, зуммированием деталей и AR-примеркой для максимального вовлечения",
    "Корзина с сохранением между сессиями": "Умная корзина с облачной синхронизацией, восстановлением брошенных покупок и персональными напоминаниями о забытых товарах",
    "Автоматический прием платежей (Telegram Stars, карты, СБП, крипта)": "Универсальный платежный шлюз с поддержкой 15+ способов оплаты, мгновенными переводами и защитой от мошенничества",
    "Система статусов заказов с real-time трекингом": "Полная прозрачность заказа: от оформления до доставки с GPS-трекингом курьера и автоматическими уведомлениями клиенту",
    "Интеграция с СДЭК, Boxberry, Почтой России": "Прямая интеграция с курьерскими службами: расчет стоимости, выбор ПВЗ на карте, автоматическая печать этикеток",
    "Управление складом и остатками в реальном времени": "Система WMS с синхронизацией 1С, автоматическим резервированием товаров и контролем остатков по складам",
    "QR-коды для быстрых покупок в офлайне": "Бесконтактные покупки через QR-коды: от сканирования до оплаты за 10 секунд, интеграция с кассовыми системами",
    
    // МАРКЕТИНГ И АНАЛИТИКА
    "AI-персонализация с умными рекомендациями": "Система машинного обучения, анализирующая 50+ факторов поведения для персональных рекомендаций товаров с точностью 85%",
    "Дашборд бизнес-аналитики с real-time метриками": "Комплексная аналитика продаж: 15+ готовых отчетов, воронки конверсий, когортный анализ и прогнозирование выручки",
    "Система промокодов и купонов с ограничениями": "Гибкая система скидок с настраиваемыми условиями: временные рамки, лимиты использования, персональные предложения",
    "Email и SMS рассылки с сегментацией": "Автоматизированный маркетинг: цепочки писем, A/B-тестирование, сегментация клиентов по 20+ критериям",
    "Интеграция с Google Analytics и Яндекс.Метрикой": "Полная настройка сквозной аналитики: Enhanced Ecommerce, события, конверсии, атрибуция по каналам",
    "Push-уведомления с геотаргетингом": "Умная система уведомлений с геолокацией: акции в радиусе 500м, персональные предложения по местоположению",
    "Chatbot с ИИ для автоматических продаж": "Продающий чат-бот на GPT-4: консультации 24/7, обработка возражений, увеличение конверсии на 40%",
    "A/B тестирование интерфейсов": "Платформа для экспериментов: сплит-тесты дизайна, измерение влияния на конверсию, статистическая значимость",
    
    // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ
    "Программа лояльности с уровнями и бонусами": "Геймифицированная система лояльности: уровни клиентов, бонусные баллы, персональные привилегии для VIP",
    "Gamification с достижениями и рейтингами": "Игровые механики для удержания: достижения, лидерборды, челленджи, виртуальные награды",
    "Реферальная система с многоуровневыми вознаграждениями": "Мотивация к рекомендациям: бонусы за приглашения, многоуровневая схема, трекинг цепочек",
    "Система отзывов с модерацией и ответами": "Управление репутацией: автомодерация отзывов через ИИ, быстрые ответы бизнеса, рейтинги",
    "Social Proof с живыми уведомлениями о покупках": "Создание ажиотажа: \"Иван купил iPhone за 45,000₽\", увеличение доверия и продаж",
    "Интеграция с соцсетями для вирального роста": "Автопостинг покупок в соцсети, конкурсы с UGC, вирусные механики распространения",
    
    // ОБРАЗОВАНИЕ И ОБУЧЕНИЕ  
    "LMS платформа с прогрессом и сертификатами": "Полноценная система обучения: курсы, тесты, прогресс-трекинг, выдача сертификатов",
    "Интерактивные тесты и квизы с мгновенными результатами": "Геймифицированное тестирование: адаптивные вопросы, мгновенная проверка, детальная аналитика",
    "Видео-уроки с таймкодами и заметками": "HD-плеер с навигацией: закладки на важных моментах, конспекты, скорость воспроизведения",
    "Вебинары с интерактивными функциями": "Live-трансляции с чатом, опросами, белой доской, записью и автоматической рассылкой",
    
    // СЕРВИСЫ И БРОНИРОВАНИЕ
    "Календарь записи с автоматическим подтверждением": "Умный календарь с интеграцией Google Calendar, автоматическими напоминаниями SMS/email, защитой от двойных записей",
    "Система управления очередями": "Электронная очередь с QR-кодами, SMS-уведомлениями о подходе, статистикой времени ожидания",
    "Бронирование номеров и столиков в реальном времени": "Система с картой зала, выбором мест, автоматической блокировкой на время оплаты, календарем доступности",
    "CRM для клиентов с историей взаимодействий": "Полная карточка клиента: история покупок, предпочтения, заметки менеджера, автоматические сегменты",
    "Интеграция с 1С и другими учетными системами": "Двусторонняя синхронизация: товары, клиенты, остатки, заказы в реальном времени через REST API",
    
    // ФИНТЕХ И ПЛАТЕЖИ
    "Мультивалютные кошельки с конвертацией": "Поддержка 10+ валют с автоматической конвертацией по курсу ЦБ, комиссии от 0.5%, мгновенные переводы",
    "P2P переводы между пользователями": "Безопасные переводы с эскроу-счетами, верификацией получателя, защитой от мошенничества",
    "Система кредитования и рассрочек": "Автоматическое скоринг-решение за 30 секунд, партнерство с банками, гибкие условия погашения",
    "Интеграция с банковскими API": "Подключение к Open Banking: проверка баланса, автоплатежи, выписки, уведомления о транзакциях",
    
    // КОНТЕНТ И МЕДИА
    "Стриминг видео с адаптивным качеством": "HD/4K трансляции с автоматической подстройкой под скорость интернета, CDN доставка, защита от пиратства",
    "Система подкастов с монетизацией": "Хостинг аудио, автоматическая транскрипция, реклама в подкастах, аналитика прослушиваний",
    "Фото и видеогалереи с тегированием": "ИИ-распознавание объектов на фото, автоматические теги, поиск по содержимому, сжатие без потери качества",
    "Система комментариев с модерацией": "Многоуровневые комментарии, автомодерация через ИИ, система рейтингов, интеграция с соцсетями",
    
    // ИНТЕГРАЦИИ И API
    "Синхронизация с внешними сервисами": "Автоматическая синхронизация данных с CRM, ERP, складскими системами через API",
    "Веб-хуки для уведомлений": "Мгновенные уведомления партнеров о событиях: новые заказы, изменения статусов, платежи",
    "Экспорт данных в популярные форматы": "Выгрузка в Excel, CSV, JSON, PDF с настраиваемыми шаблонами и автоматической отправкой",
    
    // ВОВЛЕЧЕНИЕ И ЛОЯЛЬНОСТЬ  
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
            
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredModules.map((module) => (
                <Card 
                  key={module.id} 
                  className="p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedModule(module);
                    setIsModalOpen(true);
                  }}
                >
                  <div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-telegram transition-colors">
                          {module.name}
                        </h3>
                        {module.isPopular && (
                          <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">
                            Популярный
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-telegram opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

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
        
        {/* Module Modal */}
        {selectedModule && (
          <ModuleModal
            module={selectedModule}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedModule(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
