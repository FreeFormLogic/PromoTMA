import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, X, CheckCircle, AlertCircle } from "lucide-react";

interface BeforeAfterDemoProps {
  moduleName: string;
}

const demoData: Record<string, {
  before: {
    title: string;
    problems: string[];
    metrics: string[];
  };
  after: {
    title: string;
    improvements: string[];
    metrics: string[];
  };
}> = {
  "Витрина товаров с AI-описаниями": {
    before: {
      title: "БЕЗ AI-описаний",
      problems: [
        "Скучные шаблонные описания",
        "Время на написание: 20-30 мин на товар", 
        "Низкая конверсия из-за неинтересного контента",
        "Одинаковые фразы для всех товаров"
      ],
      metrics: ["Конверсия: 2.1%", "Время создания: 25 мин", "CTR: 1.8%"]
    },
    after: {
      title: "С AI-описаниями",
      improvements: [
        "Уникальные продающие тексты для каждого товара",
        "Автоматическая генерация за 30 секунд",
        "Адаптация под целевую аудиторию",
        "SEO-оптимизированные ключевые слова"
      ],
      metrics: ["Конверсия: 3.8%", "Время создания: 30 сек", "CTR: 3.2%"]
    }
  },
  "Корзина с сохранением сессии": {
    before: {
      title: "Обычная корзина",
      problems: [
        "Корзина очищается при закрытии",
        "Клиенты забывают что хотели купить",
        "45% брошенных корзин навсегда",
        "Нет возможности вернуться к покупке"
      ],
      metrics: ["Брошенные корзины: 68%", "Возврат к покупке: 15%", "Конверсия: 2.3%"]
    },
    after: {
      title: "С сохранением сессии",
      improvements: [
        "Корзина сохраняется до 30 дней",
        "Умные напоминания о незавершенных покупках",
        "Синхронизация между устройствами",
        "Автоматическое восстановление при возврате"
      ],
      metrics: ["Брошенные корзины: 23%", "Возврат к покупке: 65%", "Конверсия: 4.1%"]
    }
  },
  "Программа лояльности с баллами": {
    before: {
      title: "Без программы лояльности",
      problems: [
        "Клиенты покупают один раз и уходят",
        "Нет мотивации для повторных покупок",
        "Сложно удержать постоянных клиентов",
        "Высокая стоимость привлечения новых"
      ],
      metrics: ["Повторные покупки: 18%", "LTV клиента: ₽2,400", "Частота покупок: 1.2/год"]
    },
    after: {
      title: "С программой лояльности",
      improvements: [
        "Автоматическое начисление баллов за покупки",
        "Бонусы за приглашение друзей",
        "Персональные предложения постоянным клиентам",
        "Геймификация с уровнями и достижениями"
      ],
      metrics: ["Повторные покупки: 58%", "LTV клиента: ₽7,200", "Частота покупок: 3.8/год"]
    }
  }
};

export function BeforeAfterDemo({ moduleName }: BeforeAfterDemoProps) {
  const [showAfter, setShowAfter] = useState(false);
  const demo = demoData[moduleName];

  if (!demo) {
    return (
      <div className="text-center py-8 text-gray-500">
        Демонстрация для этого модуля готовится...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <Button
          variant={!showAfter ? "default" : "outline"}
          onClick={() => setShowAfter(false)}
          className={!showAfter ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <X className="w-4 h-4 mr-2" />
          До внедрения
        </Button>
        <ArrowRight className="w-6 h-6 mt-2 text-gray-400" />
        <Button
          variant={showAfter ? "default" : "outline"}
          onClick={() => setShowAfter(true)}
          className={showAfter ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          После внедрения
        </Button>
      </div>

      {/* Demo Content */}
      <div className="border rounded-lg p-6 min-h-[300px] transition-all duration-500">
        {!showAfter ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                Проблемы
              </Badge>
              <h3 className="text-lg font-semibold">{demo.before.title}</h3>
            </div>
            
            <div className="space-y-3">
              {demo.before.problems.map((problem, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{problem}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Текущие показатели:</h4>
              <div className="flex flex-wrap gap-2">
                {demo.before.metrics.map((metric, index) => (
                  <Badge key={index} variant="outline" className="border-red-300 text-red-700">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Решение
              </Badge>
              <h3 className="text-lg font-semibold">{demo.after.title}</h3>
            </div>
            
            <div className="space-y-3">
              {demo.after.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{improvement}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Улучшенные показатели:</h4>
              <div className="flex flex-wrap gap-2">
                {demo.after.metrics.map((metric, index) => (
                  <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <Button
          onClick={() => setShowAfter(!showAfter)}
          className="bg-telegram hover:bg-telegram/90"
        >
          {!showAfter ? "Посмотреть результат" : "Вернуться к проблемам"}
        </Button>
      </div>
    </div>
  );
}