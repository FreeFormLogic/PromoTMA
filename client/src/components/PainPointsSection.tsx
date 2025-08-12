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
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Основные проблемы бизнеса
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Нажмите на любую проблему, чтобы увидеть, как Telegram Mini Apps решают её
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {painPoints.map((point) => {
            const Icon = point.icon;
            const isSelected = selectedPoint === point.id;
            
            return (
              <Card
                key={point.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-telegram shadow-xl scale-105' : ''
                }`}
                onClick={() => handlePointClick(point.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${point.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
                  <div className="text-sm text-gray-600">
                    Нажмите для деталей
                  </div>
                  {isSelected && (
                    <div className="mt-3">
                      <Badge className="bg-telegram text-white">
                        Выбрано
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed View */}
        {selectedPainPoint && (
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-2 border-telegram/20">
              <CardContent className="p-0">
                {/* Toggle Buttons */}
                <div className="bg-gray-50 p-6 border-b">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant={!showSolution ? "default" : "outline"}
                      onClick={() => setShowSolution(false)}
                      className={`${!showSolution ? 'bg-red-500 hover:bg-red-600' : ''} transition-all`}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Проблема
                    </Button>
                    
                    <div className="relative">
                      <ArrowRight className="w-8 h-8 text-gray-400 animate-pulse" />
                    </div>
                    
                    <Button
                      variant={showSolution ? "default" : "outline"}
                      onClick={() => setShowSolution(true)}
                      className={`${showSolution ? 'bg-green-500 hover:bg-green-600' : ''} transition-all`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Решение
                    </Button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {selectedPainPoint.title}
                        </h3>
                        
                        {!showSolution ? (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">
                                {selectedPainPoint.problem}
                              </p>
                            </div>
                            <Badge variant="destructive" className="text-sm">
                              Текущая ситуация
                            </Badge>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">
                                {selectedPainPoint.solution}
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 text-sm">
                              С Telegram Mini Apps
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Metrics */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Ключевые показатели
                        </h4>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-red-500">
                              {selectedPainPoint.metrics.before}
                            </div>
                            <div className="text-sm text-gray-600">До</div>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-400" />
                          </div>
                          
                          <div>
                            <div className="text-2xl font-bold text-green-500">
                              {selectedPainPoint.metrics.after}
                            </div>
                            <div className="text-sm text-gray-600">После</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-center">
                          <Badge className="bg-telegram text-white text-lg px-4 py-2">
                            {selectedPainPoint.metrics.improvement} улучшение
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Visual Element with Progress Ring */}
                    <div className="relative">
                      <div className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-r ${selectedPainPoint.color} flex items-center justify-center shadow-2xl transform transition-all duration-700 ${showSolution ? 'scale-110 rotate-6' : ''}`}>
                        <div className="text-center text-white relative">
                          <selectedPainPoint.icon className={`w-16 h-16 mx-auto mb-4 transition-transform duration-500 ${showSolution ? 'scale-125' : ''}`} />
                          <div className="text-3xl font-bold mb-2">
                            {showSolution ? selectedPainPoint.metrics.after : selectedPainPoint.metrics.before}
                          </div>
                          <div className="text-sm opacity-90">
                            {showSolution ? 'После решения' : 'Текущее состояние'}
                          </div>
                          
                          {/* Animated progress ring */}
                          {showSolution && (
                            <div className="absolute inset-0 -m-8">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  stroke="rgba(255,255,255,0.2)"
                                  strokeWidth="2"
                                  fill="transparent"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  stroke="white"
                                  strokeWidth="3"
                                  fill="transparent"
                                  strokeDasharray="283"
                                  strokeDashoffset="85"
                                  className="animate-pulse"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Success indicators */}
                      {showSolution && (
                        <>
                          <div className="absolute -top-4 -right-4 animate-bounce">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <Zap className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          <div className="absolute -bottom-4 -left-4 animate-pulse">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          
                          <div className="absolute top-1/2 -right-8 animate-bounce delay-300">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Before state indicators */}
                      {!showSolution && (
                        <>
                          <div className="absolute -top-2 -right-2 opacity-60">
                            <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          
                          <div className="absolute -bottom-2 -left-2 opacity-60">
                            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                              <Clock className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="bg-telegram/5 p-6 border-t text-center">
                  <Button className="bg-telegram hover:bg-telegram/90 text-white px-8 py-3">
                    <Target className="w-5 h-5 mr-2" />
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