import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Settings, Trash2, Eye, Download, Share2, Sparkles, Plus, Check, Zap, DollarSign, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [showPrototype, setShowPrototype] = useState(false);
  const [selectedModuleForModal, setSelectedModuleForModal] = useState<Module | null>(null);
  
  const clearProject = () => {
    setSelectedModules([]);
    localStorage.removeItem('selectedModules');
  };

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

  // Remove duplicates by ID and sort using AI-based relevance logic
  const uniqueModules = selectedModules
    .filter((module, index, self) => self.findIndex(m => m.id === module.id) === index)
    .sort((a, b) => {
      // AI-based sorting: prioritize by business relevance and category importance
      const categoryPriority: Record<string, number> = {
        'ОТРАСЛЕВЫЕ РЕШЕНИЯ': 1,     // Industry-specific first
        'E-COMMERCE': 2,
        'CRM': 3,
        'МАРКЕТИНГ': 4,
        'АВТОМАТИЗАЦИЯ': 5,
        'ВОВЛЕЧЕНИЕ': 6,
        'АНАЛИТИКА': 7
      };
      
      const aPriority = categoryPriority[a.category] || 999;
      const bPriority = categoryPriority[b.category] || 999;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Within same category, sort by module number for consistency
      return a.number - b.number;
    });
  
  const categories = uniqueModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const categoryColors: Record<string, string> = {
    'E-COMMERCE': 'bg-blue-100 text-blue-800',
    'МАРКЕТИНГ': 'bg-purple-100 text-purple-800',
    'ВОВЛЕЧЕНИЕ': 'bg-green-100 text-green-800',
    'ОБРАЗОВАНИЕ': 'bg-yellow-100 text-yellow-800',
    'FINTECH': 'bg-indigo-100 text-indigo-800',
    'CRM': 'bg-pink-100 text-pink-800',
    'БРОНИРОВАНИЕ': 'bg-orange-100 text-orange-800',
    'ОТРАСЛЕВЫЕ РЕШЕНИЯ': 'bg-blue-100 text-blue-800',
    'АВТОМАТИЗАЦИЯ': 'bg-cyan-100 text-cyan-800',
    'КОММУНИКАЦИИ': 'bg-teal-100 text-teal-800',
    'ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ': 'bg-gray-100 text-gray-800',
    'АНАЛИТИКА': 'bg-purple-100 text-purple-800',
    'БЕЗОПАСНОСТЬ': 'bg-green-100 text-green-800',
    'СОЦИАЛЬНАЯ КОММЕРЦИЯ': 'bg-pink-100 text-pink-800',
    'AI И АВТОМАТИЗАЦИЯ': 'bg-blue-100 text-blue-800',
  };

  // Generate generic Russian app name
  const generateAppName = () => {
    if (uniqueModules.length === 0) return "Мое Mini App";
    
    return "Бизнес Приложение";
  };

  // Generate generic AI description
  const generateAIDescription = () => {
    if (uniqueModules.length === 0) return "Добавьте модули через AI-конструктор для создания персонального описания приложения";
    
    return `Создаем универсальное Telegram Mini App, объединяющее ${uniqueModules.length} специально подобранных модулей. Комплексное решение для автоматизации и роста вашего бизнеса.`;
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

          </motion.div>
          
          {/* App Benefits */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">{generateAppName()}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
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
            <Button 
              onClick={() => window.location.href = '/ai-chat'}
              className="bg-blue-600 hover:bg-blue-700"
            >
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
                  ~{Math.max(1, Math.round(uniqueModules.length * 0.5))}
                </div>
                <div className="text-sm text-gray-600">Дней разработки</div>
              </Card>
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
                            className="p-4 h-full bg-white border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                            onClick={() => setSelectedModuleForModal(module)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-2">
                                  {module.name}
                                </h4>
                                <p className="text-xs text-gray-600 mb-3">
                                  {module.description}
                                </p>
                                <div 
                                  className="text-xs text-blue-600 leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: module.benefits.replace(/\.\.\..*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  }}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeModule(module.id);
                                }}
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

            {/* Bottom Action Buttons */}
            <div className="flex flex-col gap-4 mt-8 max-w-md mx-auto">
              <Button 
                onClick={() => {
                  const message = encodeURIComponent(
                    `Здравствуйте! Я подобрал функционал и хотел бы увидеть прототип.`
                  );
                  window.open(`https://t.me/balilegend?text=${message}`, '_blank');
                }}
                disabled={selectedModules.length < 3}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Получить прототип
              </Button>
              
              <Button 
                onClick={clearProject}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Очистить проект
              </Button>
            </div>
          </>
        )}
      </div>
      
      {/* Module Detail Modal */}
      <Dialog open={!!selectedModuleForModal} onOpenChange={() => setSelectedModuleForModal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {selectedModuleForModal?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {selectedModuleForModal && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {selectedModuleForModal.category}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedModuleForModal.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ключевые возможности</h3>
                  <div className="space-y-2">
                    {Array.isArray(selectedModuleForModal.keyFeatures) ? 
                      selectedModuleForModal.keyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      )) : 
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{selectedModuleForModal.keyFeatures}</span>
                      </div>
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Бизнес-преимущества</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedModuleForModal.benefits}
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}