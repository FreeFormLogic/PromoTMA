import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Calendar, 
  Rocket, 
  Settings, 
  CheckCircle,
  Clock,
  Users,
  Zap,
  Phone,
  Code,
  Palette,
  Globe
} from "lucide-react";

const processSteps = [
  {
    number: 1,
    title: "Консультация и анализ",
    duration: "В течение дня",
    description: "Обсуждаем ваши цели, анализируем потребности и подбираем идеальный набор модулей",
    tasks: [
      "Анализ бизнес-задач",
      "Выбор модулей из каталога",
      "Определение архитектуры",
      "Планирование интеграций"
    ],
    icon: MessageSquare,
    color: "bg-blue-500"
  },
  {
    number: 2,
    title: "Разработка",
    duration: "1-3 дня",
    description: "Настраиваем выбранные модули, кастомизируем под ваш бренд и интегрируем в Telegram",
    tasks: [
      "Настройка модулей",
      "Брендинг и дизайн",
      "Интеграция с Telegram API",
      "Тестирование функций"
    ],
    icon: Code,
    color: "bg-purple-500"
  },
  {
    number: 3,
    title: "Согласование и оплата",
    duration: "В течение дня",
    description: "Демонстрируем прототип, согласовываем финальные детали и получаем оплату",
    tasks: [
      "Демонстрация прототипа",
      "Согласование изменений",
      "Подписание договора",
      "Получение оплаты"
    ],
    icon: CheckCircle,
    color: "bg-yellow-500"
  },
  {
    number: 4,
    title: "Запуск и поддержка",
    duration: "1-2 дня",
    description: "Финальное тестирование, деплой в продакшн и настройка аналитики",
    tasks: [
      "Финальное тестирование",
      "Деплой в продакшн",
      "Настройка аналитики",
      "Обучение команды"
    ],
    icon: Rocket,
    color: "bg-green-500"
  },
  {
    number: 5,
    title: "Постоянная поддержка",
    duration: "Постоянно",
    description: "Техническая поддержка, обновления, доработки и развитие приложения",
    tasks: [
      "Техническая поддержка 24/7",
      "Регулярные обновления",
      "Новые функции",
      "Оптимизация производительности"
    ],
    icon: Settings,
    color: "bg-orange-500"
  }
];

const advantages = [
  {
    icon: Clock,
    title: "Скорость",
    description: "1-5 дней вместо месяцев",
    detail: "Готовые модули позволяют запустить проект в рекордные сроки"
  },
  {
    icon: Zap,
    title: "Эффективность",
    description: "60+ готовых модулей",
    detail: "Проверенные решения вместо разработки с нуля"
  },
  {
    icon: Users,
    title: "Экспертиза",
    description: "Опытная команда",
    detail: "Глубокие знания Telegram API и мобильной разработки"
  }
];

export default function Process() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Процесс разработки
          </h1>
          <p className="text-gray-600 mb-6">
            От идеи до готового приложения за 1-5 дней
          </p>
          <Badge className="bg-success text-white text-lg px-4 py-2">
            Прототип готов за 1 день!
          </Badge>
        </div>

        {/* Process Timeline */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <div key={step.number} className="relative">
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 z-0">
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  )}
                  
                  <Card className="relative z-10 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className={`mx-auto w-16 h-16 ${step.color} rounded-full flex items-center justify-center mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <Badge variant="outline" className="text-telegram">
                        {step.duration}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {step.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-xs text-gray-600 flex items-start">
                            <CheckCircle className="w-3 h-3 text-success mr-2 mt-0.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Advantages */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Почему мы работаем быстро
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              
              return (
                <Card key={index} className="text-center p-6">
                  <div className="mx-auto w-12 h-12 bg-telegram/10 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-telegram" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm font-medium text-telegram mb-2">
                    {advantage.description}
                  </p>
                  <p className="text-xs text-gray-600">
                    {advantage.detail}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Detailed Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Детальный процесс
          </h2>
          
          <div className="space-y-8">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    День 1: Анализ и прототип
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Phone className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Созвон для обсуждения задач (30-60 мин)</span>
                    </li>
                    <li className="flex items-center">
                      <Settings className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Подбор модулей под ваши потребности</span>
                    </li>
                    <li className="flex items-center">
                      <Palette className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Создание визуального прототипа</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Утверждение технического задания</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    День 2-4: Разработка
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Code className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Настройка и кастомизация модулей</span>
                    </li>
                    <li className="flex items-center">
                      <Palette className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Адаптация под ваш бренд</span>
                    </li>
                    <li className="flex items-center">
                      <Globe className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Интеграция с внешними сервисами</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Тестирование всех функций</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
            
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    День 5: Запуск
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Rocket className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Деплой в продакшн среду</span>
                    </li>
                    <li className="flex items-center">
                      <Settings className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Настройка мониторинга</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Обучение вашей команды</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Передача проекта</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Постоянно: Поддержка
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Clock className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Техподдержка 24/7</span>
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Регулярные обновления</span>
                    </li>
                    <li className="flex items-center">
                      <Settings className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Новые модули по запросу</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-telegram mr-3" />
                      <span className="text-sm">Мониторинг производительности</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-telegram to-telegram-dark text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы получить прототип завтра?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Запустим ваш проект в рекордные сроки с гарантией результата
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button className="bg-success hover:bg-success/90 text-white px-8 py-3 font-semibold">
              <MessageSquare className="w-4 h-4 mr-2" />
              Начать проект прямо сейчас
            </Button>
            <div className="text-blue-100 text-sm">
              Консультация бесплатна • Прототип за 1 день
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">1 день</div>
              <div className="text-sm text-blue-100">До прототипа</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1-5 дней</div>
              <div className="text-sm text-blue-100">До запуска</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-blue-100">Поддержка</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
