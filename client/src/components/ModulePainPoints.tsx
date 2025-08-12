import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Zap,
  TrendingUp,
  X
} from "lucide-react";

interface PainPoint {
  problem: string;
  solution: string;
  impact?: string;
}

interface ModulePainPointsProps {
  moduleName: string;
  painPoints?: PainPoint[];
}

// Данные болевых точек для разных модулей
const modulePainPointsData: Record<string, PainPoint[]> = {
  "Витрина товаров с AI-описаниями": [
    {
      problem: "Скучные шаблонные описания товаров отталкивают покупателей",
      solution: "AI генерирует уникальные продающие тексты для каждого товара",
      impact: "Конверсия увеличивается на 40-60%"
    },
    {
      problem: "Тратите 20-30 минут на написание описания одного товара",
      solution: "Автоматическая генерация за 30 секунд с учетом целевой аудитории",
      impact: "Экономия времени на 95%"
    },
    {
      problem: "Сложно найти нужный товар среди сотен позиций",
      solution: "20+ умных фильтров с автонастройкой релевантности",
      impact: "Время поиска сокращается на 60%"
    }
  ],
  "Корзина с сохранением сессии": [
    {
      problem: "68% корзин бросают и никогда не возвращаются к покупке",
      solution: "Корзина сохраняется до 30 дней с умными напоминаниями",
      impact: "Восстановление 45% брошенных корзин"
    },
    {
      problem: "Клиенты забывают что хотели купить при повторном заходе",
      solution: "Автоматическое восстановление с персональными предложениями",
      impact: "Увеличение повторных покупок на 30%"
    },
    {
      problem: "Нет синхронизации между устройствами пользователя",
      solution: "Облачное сохранение с мгновенной синхронизацией",
      impact: "Удобство использования на 80% выше"
    }
  ],
  "Программа лояльности с баллами": [
    {
      problem: "Клиенты покупают один раз и больше не возвращаются",
      solution: "Система баллов с мотивирующими уровнями и бонусами",
      impact: "Повторные покупки увеличиваются на 180%"
    },
    {
      problem: "Сложно мотивировать к более дорогим покупкам",
      solution: "Прогрессивные бонусы за увеличение суммы заказа",
      impact: "Средний чек растет на 35%"
    },
    {
      problem: "Нет эффективной реферальной системы",
      solution: "Автоматические бонусы за приглашение друзей",
      impact: "Органический рост клиентской базы на 25%"
    }
  ],
  "Push-уведомления и рассылки": [
    {
      problem: "Email-рассылки попадают в спам и имеют низкую открываемость",
      solution: "Push-уведомления через Telegram доставляются на 99%",
      impact: "Открываемость увеличивается на 400%"
    },
    {
      problem: "Клиенты забывают о ваших акциях и новинках",
      solution: "Автоматические напоминания о скидках и поступлениях",
      impact: "Возврат клиентов на 60% чаще"
    },
    {
      problem: "Сложно сегментировать аудиторию для таргетированных рассылок",
      solution: "Умная сегментация по поведению и предпочтениям",
      impact: "CTR увеличивается на 250%"
    }
  ],
  "Чат-бот поддержки": [
    {
      problem: "Операторы отвечают клиентам 3-8 часов",
      solution: "Мгновенные ответы на 80% вопросов через AI-бота",
      impact: "Время ответа сокращается на 95%"
    },
    {
      problem: "Одни и те же вопросы задают десятки раз в день",
      solution: "База знаний с автоматическими ответами на типовые вопросы",
      impact: "Нагрузка на поддержку снижается на 70%"
    },
    {
      problem: "Клиенты уходят, не дождавшись ответа",
      solution: "24/7 доступность с умной эскалацией к живому оператору",
      impact: "Удержание клиентов увеличивается на 45%"
    }
  ],
  "Каталог услуг с онлайн-записью": [
    {
      problem: "Клиенты звонят в нерабочее время и не могут записаться",
      solution: "Круглосуточная онлайн-запись с календарем свободных слотов",
      impact: "Конверсия записей увеличивается на 80%"
    },
    {
      problem: "Администратор тратит час в день на обзвоны и подтверждения",
      solution: "Автоматические напоминания и подтверждения через Telegram",
      impact: "Экономия времени персонала на 75%"
    },
    {
      problem: "25% клиентов не приходят на записанное время",
      solution: "Система напоминаний за 24 часа и 2 часа до визита",
      impact: "Количество no-show снижается на 60%"
    }
  ],
  "Менеджер задач и проектов": [
    {
      problem: "Задачи теряются в переписках и Excel-таблицах",
      solution: "Централизованная система с уведомлениями в Telegram",
      impact: "Выполнение задач в срок увеличивается на 85%"
    },
    {
      problem: "Руководитель не видит реальный прогресс проектов",
      solution: "Дашборд с визуализацией прогресса в реальном времени",
      impact: "Контроль проектов улучшается на 300%"
    },
    {
      problem: "Команда тратит время на статус-митинги",
      solution: "Автоматические отчеты и уведомления о важных изменениях",
      impact: "Время на координацию сокращается на 50%"
    }
  ],
  "Система отзывов с модерацией": [
    {
      problem: "Негативные отзывы появляются на публичных площадках",
      solution: "Приватная система отзывов с возможностью решения проблем",
      impact: "Негативные публичные отзывы снижаются на 70%"
    },
    {
      problem: "Сложно собрать обратную связь от довольных клиентов",
      solution: "Автоматические запросы отзывов после покупки",
      impact: "Количество отзывов увеличивается на 400%"
    },
    {
      problem: "Нет системы для работы с жалобами",
      solution: "Структурированная обработка с трекингом решения",
      impact: "Время решения жалоб сокращается на 60%"
    }
  ],
  // Универсальные болевые точки для ресторанной отрасли
  "Ресторанная отрасль": [
    {
      problem: "Высокие комиссии агрегаторов (25-35%) съедают всю прибыль",
      solution: "Собственный канал продаж без комиссий посредников",
      impact: "Экономия на комиссиях до 30% от оборота"
    },
    {
      problem: "Отсутствие данных о клиентах - нет базы для маркетинга",
      solution: "Полная информация о клиентах и их предпочтениях",
      impact: "Повторные заказы увеличиваются на 150%"
    },
    {
      problem: "Зависимость от внешних платформ и их правил",
      solution: "Независимый канал коммуникации и продаж",
      impact: "Стабильность бизнеса повышается на 200%"
    }
  ],
  // Дополнительные варианты названий для ресторанов
  "Управление доставкой": [
    {
      problem: "Курьеры часто опаздывают, клиенты недовольны",
      solution: "GPS-трекинг с точным временем прибытия",
      impact: "Удовлетворенность доставкой растет на 80%"
    },
    {
      problem: "Нет контроля над процессом доставки",
      solution: "Полная прозрачность маршрута и статуса заказа",
      impact: "Жалобы на доставку снижаются на 60%"
    },
    {
      problem: "Сложно координировать работу нескольких курьеров",
      solution: "Централизованная система управления доставками",
      impact: "Эффективность логистики увеличивается на 40%"
    }
  ],
  "Каталог блюд": [
    {
      problem: "Невкусные фото блюд снижают аппетит покупателей",
      solution: "Профессиональные фото и детальные описания блюд",
      impact: "Конверсия каталога увеличивается на 45%"
    },
    {
      problem: "Клиенты не могут найти нужное блюдо в большом меню",
      solution: "Умные фильтры по составу, калориям и предпочтениям",
      impact: "Время выбора блюда сокращается на 50%"
    },
    {
      problem: "Нет информации об аллергенах и составе",
      solution: "Подробная информация о составе и пищевой ценности",
      impact: "Доверие клиентов повышается на 70%"
    }
  ]
};

export function ModulePainPoints({ moduleName, painPoints: externalPainPoints }: ModulePainPointsProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Попробуем найти болевые точки по точному названию или по ключевым словам
  let painPoints = externalPainPoints || modulePainPointsData[moduleName];
  
  // Если не найдено точное соответствие, ищем по ключевым словам
  if (!painPoints) {
    const lowerModuleName = moduleName.toLowerCase();
    if (lowerModuleName.includes('доставк') || lowerModuleName.includes('курьер')) {
      painPoints = modulePainPointsData["Управление доставкой"];
    } else if (lowerModuleName.includes('блюд') || lowerModuleName.includes('меню') || lowerModuleName.includes('каталог')) {
      painPoints = modulePainPointsData["Каталог блюд"];
    } else if (lowerModuleName.includes('ресторан') || lowerModuleName.includes('кафе') || lowerModuleName.includes('еда')) {
      painPoints = modulePainPointsData["Ресторанная отрасль"];
    } else if (lowerModuleName.includes('корзин')) {
      painPoints = modulePainPointsData["Корзина с сохранением сессии"];
    } else if (lowerModuleName.includes('товар') || lowerModuleName.includes('витрин')) {
      painPoints = modulePainPointsData["Витрина товаров с AI-описаниями"];
    } else if (lowerModuleName.includes('лояльн') || lowerModuleName.includes('балл')) {
      painPoints = modulePainPointsData["Программа лояльности с баллами"];
    } else if (lowerModuleName.includes('уведомл') || lowerModuleName.includes('рассылк')) {
      painPoints = modulePainPointsData["Push-уведомления и рассылки"];
    } else if (lowerModuleName.includes('бот') || lowerModuleName.includes('поддержк')) {
      painPoints = modulePainPointsData["Чат-бот поддержки"];
    } else if (lowerModuleName.includes('запис') || lowerModuleName.includes('услуг')) {
      painPoints = modulePainPointsData["Каталог услуг с онлайн-записью"];
    } else if (lowerModuleName.includes('задач') || lowerModuleName.includes('проект')) {
      painPoints = modulePainPointsData["Менеджер задач и проектов"];
    } else if (lowerModuleName.includes('отзыв') || lowerModuleName.includes('модерац')) {
      painPoints = modulePainPointsData["Система отзывов с модерацией"];
    }
  }
  
  // Если всё ещё не найдено, используем дефолтные
  if (!painPoints) {
    painPoints = [
      {
        problem: "Текущие процессы неэффективны и требуют много ручной работы",
        solution: "Автоматизация основных операций с умными алгоритмами",
        impact: "Эффективность увеличивается на 70%"
      },
      {
        problem: "Сложно отслеживать результаты и анализировать данные",
        solution: "Встроенная аналитика с наглядными отчетами",
        impact: "Время на анализ сокращается на 80%"
      }
    ];
  }

  console.log('ModulePainPoints render:', { moduleName, painPointsLength: painPoints.length, foundData: !!modulePainPointsData[moduleName] });

  const handlePointClick = (index: number) => {
    if (selectedPoint === index) {
      setShowSolution(!showSolution);
    } else {
      setSelectedPoint(index);
      setShowSolution(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Основные болевые точки и их решение
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          Нажмите на любую проблему, чтобы увидеть решение
        </p>

        {/* Pain Points Grid */}
        <div className="grid gap-4">
          {painPoints.map((point, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedPoint === index ? 'ring-2 ring-telegram shadow-lg' : ''
              }`}
              onClick={() => handlePointClick(index)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedPoint === index ? 'bg-telegram' : 'bg-red-100'
                  }`}>
                    {selectedPoint === index ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {point.problem}
                    </p>
                    
                    {selectedPoint === index && (
                      <div className="mt-3">
                        <Badge className="bg-telegram text-white text-xs">
                          Нажмите для решения
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Solution View */}
        {selectedPoint !== null && (
          <Card className="border-2 border-telegram/20 bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              {/* Toggle Buttons */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant={!showSolution ? "default" : "outline"}
                  onClick={() => setShowSolution(false)}
                  className={`${!showSolution ? 'bg-red-500 hover:bg-red-600' : ''} transition-all`}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Проблема
                </Button>
                
                <ArrowRight className="w-6 h-6 text-gray-400 animate-pulse" />
                
                <Button
                  variant={showSolution ? "default" : "outline"}
                  onClick={() => setShowSolution(true)}
                  className={`${showSolution ? 'bg-green-500 hover:bg-green-600' : ''} transition-all`}
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Решение
                </Button>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                {!showSolution ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <Badge variant="destructive">Текущая ситуация</Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-red-200">
                      {painPoints[selectedPoint].problem}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <Badge className="bg-green-100 text-green-800">Наше решение</Badge>
                    </div>
                    <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-green-200">
                      {painPoints[selectedPoint].solution}
                    </p>
                    
                    {painPoints[selectedPoint].impact && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <Badge className="bg-telegram text-white">
                            {painPoints[selectedPoint].impact}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="text-center mt-6">
                <Button 
                  onClick={() => setShowSolution(!showSolution)}
                  className="bg-telegram hover:bg-telegram/90 text-white"
                  size="sm"
                >
                  {!showSolution ? (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Посмотреть решение
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Вернуться к проблеме
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedPoint === null && (
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              👆 Выберите любую проблему выше, чтобы увидеть, как модуль её решает
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}