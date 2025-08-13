import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Settings, Trash2, Eye, Download, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Module {
  id: string;
  number: number;
  name: string;
  description: string;
  category: string;
  keyFeatures: string | string[];
  benefits: string;
  icon: string;
}

export default function MyApp() {
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  
  const clearProject = () => {
    setSelectedModules([]);
    localStorage.removeItem('selectedModules');
  };
  const [showPrototype, setShowPrototype] = useState(false);

  // Load selected modules from localStorage
  useEffect(() => {
    const savedModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
    setSelectedModules(savedModules);
  }, []);
  
  const { data: allModules } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const removeModule = (moduleId: string) => {
    const updatedModules = selectedModules.filter(m => m.id !== moduleId);
    setSelectedModules(updatedModules);
    localStorage.setItem('selectedModules', JSON.stringify(updatedModules));
  };

  const generatePrototype = () => {
    // Redirect to @balilegend for prototype creation
    const message = encodeURIComponent(
      `Привет! Хочу создать прототип Telegram Mini App. Выбрал ${selectedModules.length} модулей:\n\n${selectedModules.map(m => `• ${m.name} (${m.category})`).join('\n')}\n\nМожете создать прототип на основе этих модулей?`
    );
    window.open(`https://t.me/balilegend?text=${message}`, '_blank');
  };

  // Remove duplicates and group by category
  const uniqueModules = selectedModules.filter((module, index, self) => 
    self.findIndex(m => m.id === module.id) === index
  );
  
  const categories = uniqueModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const categoryColors: Record<string, string> = {
    'E-COMMERCE': 'bg-blue-100 text-blue-800',
    'МАРКЕТИНГ': 'bg-green-100 text-green-800',
    'ВОВЛЕЧЕНИЕ': 'bg-purple-100 text-purple-800',
    'ОБРАЗОВАНИЕ': 'bg-orange-100 text-orange-800',
    'ФИНТЕХ': 'bg-yellow-100 text-yellow-800',
    'CRM': 'bg-pink-100 text-pink-800',
    'БРОНИРОВАНИЕ': 'bg-indigo-100 text-indigo-800',
    'ОТРАСЛЕВЫЕ РЕШЕНИЯ': 'bg-red-100 text-red-800',
    'АВТОМАТИЗАЦИЯ': 'bg-cyan-100 text-cyan-800',
    'КОММУНИКАЦИИ': 'bg-teal-100 text-teal-800',
    'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ': 'bg-gray-100 text-gray-800',
    'АНАЛИТИКА': 'bg-purple-100 text-purple-800',
    'БЕЗОПАСНОСТЬ': 'bg-red-100 text-red-800',
    'СОЦИАЛЬНАЯ КОММЕРЦИЯ': 'bg-pink-100 text-pink-800',
    'AI И АВТОМАТИЗАЦИЯ': 'bg-blue-100 text-blue-800',
  };

  // Generate AI description based on selected modules
  const generateAIDescription = () => {
    if (uniqueModules.length === 0) return "Добавьте модули через AI-конструктор для создания персонального описания приложения";
    
    const categories = Array.from(new Set(uniqueModules.map(m => m.category)));
    const isIndustrySpecific = uniqueModules.some(m => m.category === "ОТРАСЛЕВЫЕ РЕШЕНИЯ");
    
    if (isIndustrySpecific) {
      const industryModule = uniqueModules.find(m => m.category === "ОТРАСЛЕВЫЕ РЕШЕНИЯ");
      if (industryModule?.name.includes("салон")) {
        return "Создаем комплексное решение для салона красоты с возможностями онлайн-записи, управления клиентской базой и программой лояльности. Ваше приложение поможет автоматизировать бизнес-процессы и увеличить доходы.";
      } else if (industryModule?.name.includes("ресторан")) {
        return "Разрабатываем мощную систему управления рестораном с интегрированными решениями для заказов, доставки и лояльности клиентов. Приложение оптимизирует операции и повысит прибыльность.";
      } else if (industryModule?.name.includes("фитнес")) {
        return "Создаем инновационное приложение для фитнес-клуба с системой управления абонементами, расписанием тренировок и мотивацией участников. Современные технологии для роста вашего бизнеса.";
      }
    }
    
    if (categories.includes("E-COMMERCE")) {
      return "Создаем мощную eCommerce-платформу с интегрированными решениями для продаж, маркетинга и аналитики. Ваше приложение станет центром цифрового бизнеса.";
    } else if (categories.includes("ОБРАЗОВАНИЕ")) {
      return "Разрабатываем современную образовательную платформу с интерактивными курсами, системой оценки и вовлечения студентов. Технологии будущего для качественного обучения.";
    }
    
    return `Создаем уникальное Telegram Mini App, объединяющее ${uniqueModules.length} специально подобранных модулей. Комплексное решение для автоматизации и роста вашего бизнеса.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Мое Mini App
              </h1>
              <p className="text-gray-600 mt-1">
                {uniqueModules.length} модулей выбрано
              </p>
            </div>
            {uniqueModules.length > 0 && (
              <Button 
                onClick={clearProject}
                variant="outline"
                size="sm"
                className="ml-4 text-red-600 border-red-200 hover:bg-red-50"
              >
                Очистить проект
              </Button>
            )}
          </motion.div>
          
          {/* AI Description */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Описание вашего приложения</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {generateAIDescription()}
              </p>
            </div>
          </Card>
        </div>

        {uniqueModules.length === 0 ? (
          <Card className="p-12 text-center">
            <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Пока нет выбранных модулей
            </h3>
            <p className="text-gray-500 mb-6">
              Начните общение с AI-консультантом, чтобы подобрать подходящие модули для вашего бизнеса
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Перейти к AI-консультанту
            </Button>
          </Card>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {selectedModules.length}
                </div>
                <div className="text-sm text-gray-600">Модулей выбрано</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Object.keys(categories).length}
                </div>
                <div className="text-sm text-gray-600">Категорий</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  В работе
                </div>
                <div className="text-sm text-gray-600">Статус</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  ~{selectedModules.length * 2}
                </div>
                <div className="text-sm text-gray-600">Дней разработки</div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <Button 
                onClick={generatePrototype}
                disabled={selectedModules.length < 3}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Создать прототип
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Экспорт ТЗ
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </Button>
            </div>

            {/* Selected Modules by Category */}
            <div className="space-y-6">
              {Object.entries(categories).map(([category, modules]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={`${categoryColors[category] || 'bg-gray-100 text-gray-800'} text-sm font-medium`}
                      >
                        {category}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {modules.length} модул{modules.length === 1 ? 'ь' : modules.length < 5 ? 'я' : 'ей'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {modules.map((module) => (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group"
                        >
                          <Card 
                            className="p-4 h-full border-2 border-green-200 bg-green-50 hover:shadow-md transition-all cursor-pointer hover:border-green-300"
                            onClick={() => {
                              // Make modules clickable like in Modules section
                              console.log('Module clicked:', module.name);
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-green-700">
                                    Модуль {module.number}
                                  </span>
                                </div>
                                <h4 className="font-medium text-sm mb-2">
                                  {module.name}
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">
                                  {module.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeModule(module.id)}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Prototype Preview */}
            {showPrototype && uniqueModules.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-xl p-6 shadow-lg border-2 border-green-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Прототип готов!
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Выбранные модули:</h4>
                    <div className="space-y-2">
                      {uniqueModules.map((module) => (
                        <div key={module.id} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Модуль {module.number}: {module.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Функциональность:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Интеграция с Telegram Bot API</p>
                      <p>• Адаптивный интерфейс для всех устройств</p>
                      <p>• Система авторизации через Telegram</p>
                      <p>• Встроенная аналитика и метрики</p>
                      <p>• Поддержка платежей Telegram Stars</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Ваше приложение готово к передаче в разработку! 
                    Предполагаемое время разработки: {uniqueModules.length * 2} дня
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}