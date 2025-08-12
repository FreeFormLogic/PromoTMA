import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  TrendingUp, 
  DollarSign,
  Users,
  Clock,
  Target,
  Zap,
  BarChart3,
  Star
} from "lucide-react";

interface PainPoint {
  id: string;
  title: string;
  problem: string;
  solution: string;
  metrics: {
    before: string;
    after: string;
    improvement: string;
  };
  icon: any;
  color: string;
}

const painPoints: PainPoint[] = [
  {
    id: "conversion",
    title: "Низкая конверсия",
    problem: "Клиенты добавляют товары в корзину, но не завершают покупку. 68% корзин остаются брошенными.",
    solution: "Умная корзина с сохранением сессии, напоминания и персонализированные предложения.",
    metrics: {
      before: "2.3%",
      after: "4.8%",
      improvement: "+108%"
    },
    icon: TrendingUp,
    color: "from-red-400 to-red-600"
  },
  {
    id: "retention",
    title: "Отток клиентов",
    problem: "Клиенты покупают один раз и больше не возвращаются. Нет связи с аудиторией.",
    solution: "Программа лояльности, push-уведомления и персональные предложения через Telegram.",
    metrics: {
      before: "18%",
      after: "58%",
      improvement: "+222%"
    },
    icon: Users,
    color: "from-orange-400 to-orange-600"
  },
  {
    id: "costs",
    title: "Высокие комиссии",
    problem: "Маркетплейсы берут 15-35% комиссии, съедая всю прибыль от продаж.",
    solution: "Собственный канал продаж через Telegram Mini App без комиссий посредников.",
    metrics: {
      before: "25%",
      after: "0%",
      improvement: "-100%"
    },
    icon: DollarSign,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: "time",
    title: "Время на рутину",
    problem: "Менеджеры тратят 4-6 часов в день на обработку заказов и общение с клиентами.",
    solution: "Автоматизация приема заказов, оплаты и уведомлений. CRM с умной обработкой.",
    metrics: {
      before: "5 часов",
      after: "30 минут",
      improvement: "-90%"
    },
    icon: Clock,
    color: "from-green-400 to-green-600"
  }
];

export function PainPointsSection() {
  const [selectedPoint, setSelectedPoint] = useState<string | null>("time");
  const [showSolution, setShowSolution] = useState(false);

  const handlePointClick = (pointId: string) => {
    if (selectedPoint === pointId) {
      setShowSolution(!showSolution);
    } else {
      setSelectedPoint(pointId);
      setShowSolution(false);
    }
  };

  const selectedPainPoint = painPoints.find(p => p.id === selectedPoint);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Основные проблемы бизнеса
          </h2>
          <p className="text-gray-600">
            Нажмите на любую проблему, чтобы увидеть, как Telegram Mini Apps решают её
          </p>
        </div>

        {/* Compact Problem Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {painPoints.map((point) => {
            const Icon = point.icon;
            const isSelected = selectedPoint === point.id;
            
            return (
              <Card
                key={point.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-telegram shadow-lg bg-telegram/5' : ''
                }`}
                onClick={() => handlePointClick(point.id)}
              >
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${point.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{point.title}</h3>
                  <div className="text-xs text-gray-500">
                    Нажмите для деталей
                  </div>
                  {isSelected && (
                    <div className="mt-2">
                      <Badge className="bg-telegram text-white text-xs">
                        Выбрано
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Compact Detailed View */}
        {selectedPainPoint && (
          <div className="max-w-3xl mx-auto">
            <Card className="overflow-hidden shadow-lg border border-gray-200">
              <CardContent className="p-0">
                {/* Compact Toggle */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant={!showSolution ? "default" : "outline"}
                      onClick={() => setShowSolution(false)}
                      className={`${!showSolution ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    >
                      Проблема
                    </Button>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <Button
                      size="sm"
                      variant={showSolution ? "default" : "outline"}
                      onClick={() => setShowSolution(true)}
                      className={`${showSolution ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      Решение
                    </Button>
                  </div>
                </div>

                {/* Compact Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Text Content */}
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedPainPoint.title}
                      </h3>
                      
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {!showSolution ? selectedPainPoint.problem : selectedPainPoint.solution}
                      </p>
                      
                      <Badge className={`${showSolution ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs`}>
                        {showSolution ? 'С Telegram Mini Apps' : 'Текущая ситуация'}
                      </Badge>
                    </div>

                    {/* Compact Metrics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Ключевые показатели
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-500">
                            {selectedPainPoint.metrics.before}
                          </div>
                          <div className="text-xs text-gray-600">До</div>
                        </div>
                        
                        <div className="flex justify-center">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">
                            {selectedPainPoint.metrics.after}
                          </div>
                          <div className="text-xs text-gray-600">
                            {showSolution ? 'После решения' : 'После'}
                          </div>
                        </div>
                        
                        <div className="text-center mt-3">
                          <Badge className="bg-telegram text-white text-xs px-2 py-1">
                            {selectedPainPoint.metrics.improvement}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Action */}
                <div className="bg-telegram/5 p-4 text-center border-t">
                  <Button size="sm" className="bg-telegram hover:bg-telegram/90 text-white">
                    Решить эту проблему
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        {!selectedPoint && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Выберите любую проблему выше, чтобы увидеть решение
            </p>
            <Button 
              onClick={() => setSelectedPoint('conversion')}
              className="bg-telegram hover:bg-telegram/90 text-white px-8 py-3"
            >
              Начать с конверсии
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}