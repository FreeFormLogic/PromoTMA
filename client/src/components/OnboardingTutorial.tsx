import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Sparkles, Package, Briefcase, CreditCard, Rocket, Users } from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  selector?: string;
  icon: React.ReactNode;
  position: "center" | "top" | "bottom" | "left" | "right";
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Добро пожаловать в PromoTMA",
    description: "Это ваш справочник готовых бизнес-модулей для Telegram Mini Apps. Давайте покажем, как всё работает.",
    icon: <Sparkles className="w-6 h-6" />,
    position: "center"
  },
  {
    id: 2,
    title: "Каталог модулей",
    description: "Здесь собраны готовые компоненты для вашего приложения. Каждый модуль - это отдельная функция, которую можно интегрировать.",
    selector: '[href="/modules"]',
    icon: <Package className="w-6 h-6" />,
    position: "bottom"
  },
  {
    id: 3,
    title: "Бизнес-ниши",
    description: "29 специализированных решений для разных видов бизнеса. От ресторанов до психологов - найдите свою нишу.",
    selector: '[href="/industries"]',
    icon: <Briefcase className="w-6 h-6" />,
    position: "bottom"
  },
  {
    id: 4,
    title: "Прозрачные цены",
    description: "Четкие тарифы без скрытых платежей. Выберите подходящий план для вашего проекта.",
    selector: '[href="/pricing"]',
    icon: <CreditCard className="w-6 h-6" />,
    position: "bottom"
  },
  {
    id: 5,
    title: "Процесс разработки",
    description: "Понятная схема работы от идеи до запуска. Знайте, что вас ждет на каждом этапе.",
    selector: '[href="/process"]',
    icon: <Rocket className="w-6 h-6" />,
    position: "bottom"
  },
  {
    id: 6,
    title: "Партнерская программа",
    description: "Специальные условия для партнеров. Этот раздел находится в разработке.",
    selector: '[href="/partners"]',
    icon: <Users className="w-6 h-6" />,
    position: "bottom"
  },
  {
    id: 7,
    title: "Готовы начать?",
    description: "Теперь вы знаете основы платформы. Изучайте каталог модулей и выбирайте решения для вашего бизнеса!",
    icon: <Sparkles className="w-6 h-6" />,
    position: "center"
  }
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [highlightPosition, setHighlightPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const step = tutorialSteps[currentStep];
    if (step.selector) {
      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition(rect);
        
        // Scroll element into view
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setHighlightPosition(null);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const getTooltipPosition = () => {
    const step = tutorialSteps[currentStep];
    
    if (!highlightPosition || step.position === "center") {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
    }

    const tooltipWidth = 400;
    const tooltipHeight = 200;
    const padding = 20;

    switch (step.position) {
      case "top":
        return {
          top: `${highlightPosition.top - tooltipHeight - padding}px`,
          left: `${highlightPosition.left + highlightPosition.width / 2}px`,
          transform: "translateX(-50%)"
        };
      case "bottom":
        return {
          top: `${highlightPosition.bottom + padding}px`,
          left: `${highlightPosition.left + highlightPosition.width / 2}px`,
          transform: "translateX(-50%)"
        };
      case "left":
        return {
          top: `${highlightPosition.top + highlightPosition.height / 2}px`,
          left: `${highlightPosition.left - tooltipWidth - padding}px`,
          transform: "translateY(-50%)"
        };
      case "right":
        return {
          top: `${highlightPosition.top + highlightPosition.height / 2}px`,
          left: `${highlightPosition.right + padding}px`,
          transform: "translateY(-50%)"
        };
      default:
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        };
    }
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];
  const tooltipPosition = getTooltipPosition();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Highlight area */}
        {highlightPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute border-2 border-blue-500 rounded-lg shadow-2xl"
            style={{
              top: highlightPosition.top - 4,
              left: highlightPosition.left - 4,
              width: highlightPosition.width + 8,
              height: highlightPosition.height + 8,
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
              pointerEvents: "none"
            }}
          >
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg animate-pulse" />
          </motion.div>
        )}

        {/* Tutorial card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute max-w-md"
          style={tooltipPosition}
        >
          <Card className="border-2 border-blue-500/50 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    {step.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Шаг {currentStep + 1} из {tutorialSteps.length}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                {step.description}
              </CardDescription>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-500 h-1.5 rounded-full"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Назад
                </Button>

                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: index === currentStep ? 1.2 : 1,
                        backgroundColor: index === currentStep ? "rgb(59, 130, 246)" : 
                                       index < currentStep ? "rgb(147, 197, 253)" : "rgb(229, 231, 235)"
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Завершить" : "Далее"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}