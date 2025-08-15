import { useState, useMemo } from 'react';
import { Module } from '@shared/schema';
import { ChevronDown, ChevronUp, Sparkles, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ModuleModal } from './ModuleModal';

// Компонент карточки модуля
interface ModuleCardProps {
  module: Module;
  onClick: () => void;
}

const ModuleCard = ({ module, onClick }: ModuleCardProps) => {
  const IconComponent = Sparkles; // Use sparkles icon like in AI chat
  
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 border mb-3 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="p-4">
        {/* Icon and header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight break-words hyphens-auto">
              {module.name.replace(/\*\*/g, '')}
            </h3>
            <div className="text-[10px] mt-1 font-normal text-gray-500 uppercase">
              {module.category}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {module.description.replace(/\*\*/g, '')}
        </p>
        
        {/* Benefit and arrow */}
        <div className="flex items-center justify-between">
          <div 
            className="text-xs text-blue-600 dark:text-blue-400 font-medium flex-1"
            dangerouslySetInnerHTML={{
              __html: module.benefits.replace(/\.\.\..*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Note: Module selection functionality can be added here later
              }}
              className="w-6 h-6 p-0 text-gray-400 hover:text-blue-600"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Основной компонент каталога модулей
interface ModuleCatalogProps {
  allModulesData: Module[];
}

const ModuleCatalog = ({ allModulesData }: ModuleCatalogProps) => {
  const [selectedBusinessGoals, setSelectedBusinessGoals] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Извлекаем бизнес-цели из преимуществ модулей
  const businessGoals = useMemo(() => {
    const goals = new Set<string>();
    
    allModulesData.forEach(module => {
      const benefits = module.benefits?.toLowerCase() || '';
      
      // Ключевые слова для определения бизнес-целей
      if (benefits.includes('продаж') || benefits.includes('прибыл')) {
        goals.add('Увеличение продаж');
      }
      if (benefits.includes('автоматизац') || benefits.includes('автомат')) {
        goals.add('Автоматизация');
      }
      if (benefits.includes('лояльност') || benefits.includes('удержан')) {
        goals.add('Повышение лояльности');
      }
      if (benefits.includes('затрат') || benefits.includes('экономи') || benefits.includes('снижен')) {
        goals.add('Снижение затрат');
      }
      if (benefits.includes('клиент') || benefits.includes('пользовател')) {
        goals.add('Улучшение клиентского опыта');
      }
      if (benefits.includes('скорост') || benefits.includes('быстр') || benefits.includes('эффективност')) {
        goals.add('Повышение эффективности');
      }
      if (benefits.includes('аналитик') || benefits.includes('данн') || benefits.includes('отчет')) {
        goals.add('Аналитика и отчетность');
      }
    });

    return Array.from(goals);
  }, [allModulesData]);

  // Фильтрация модулей по бизнес-целям
  const filteredModules = useMemo(() => {
    let filtered = allModulesData;

    // Фильтрация по бизнес-целям (И-логика: модуль должен соответствовать ВСЕМ выбранным целям)
    if (selectedBusinessGoals.length > 0) {
      filtered = filtered.filter(module => {
        const benefits = module.benefits?.toLowerCase() || '';
        return selectedBusinessGoals.every(goal => {
          switch (goal) {
            case 'Увеличение продаж':
              return benefits.includes('продаж') || benefits.includes('прибыл');
            case 'Автоматизация':
              return benefits.includes('автоматизац') || benefits.includes('автомат');
            case 'Повышение лояльности':
              return benefits.includes('лояльност') || benefits.includes('удержан');
            case 'Снижение затрат':
              return benefits.includes('затрат') || benefits.includes('экономи') || benefits.includes('снижен');
            case 'Улучшение клиентского опыта':
              return benefits.includes('клиент') || benefits.includes('пользовател');
            case 'Повышение эффективности':
              return benefits.includes('скорост') || benefits.includes('быстр') || benefits.includes('эффективност');
            case 'Аналитика и отчетность':
              return benefits.includes('аналитик') || benefits.includes('данн') || benefits.includes('отчет');
            default:
              return false;
          }
        });
      });
    }

    return filtered;
  }, [allModulesData, selectedBusinessGoals]);

  // Группировка по категориям
  const groupedModules = useMemo(() => {
    const groups: { [key: string]: Module[] } = {};
    
    filteredModules.forEach(module => {
      const category = module.category || 'Без категории';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(module);
    });

    return groups;
  }, [filteredModules]);

  // Переключение категории
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Переключение бизнес-цели
  const toggleBusinessGoal = (goal: string) => {
    setSelectedBusinessGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Теги бизнес-целей */}
      {businessGoals.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Фильтр по бизнес-целям:</h3>
          <div className="flex flex-wrap gap-2">
            {businessGoals.map(goal => (
              <Badge
                key={goal}
                variant={selectedBusinessGoals.includes(goal) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedBusinessGoals.includes(goal)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={() => toggleBusinessGoal(goal)}
              >
                {goal}
              </Badge>
            ))}
            {selectedBusinessGoals.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBusinessGoals([])}
                className="text-gray-500 hover:text-gray-700 h-6 px-2 text-xs"
              >
                Очистить
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Результаты фильтрации */}
      {selectedBusinessGoals.length > 0 && (
        <div className="text-sm text-gray-600">
          Найдено модулей: {filteredModules.length} из {allModulesData.length}
        </div>
      )}

      {/* Аккордеон категорий */}
      <div className="space-y-4">
        {Object.entries(groupedModules).map(([category, modules]) => (
          <Collapsible
            key={category}
            open={openCategories.includes(category)}
            onOpenChange={() => toggleCategory(category)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {category}
                  </span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {modules.length} модул{modules.length === 1 ? 'ь' : modules.length < 5 ? 'я' : 'ей'}
                  </Badge>
                </div>
                {openCategories.includes(category) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {modules.map(module => (
                  <ModuleCard 
                    key={module.id} 
                    module={module} 
                    onClick={() => {
                      setSelectedModule(module);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Сообщение о пустых результатах */}
      {Object.keys(groupedModules).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Модули не найдены</div>
          <div className="text-gray-400 text-sm">
            Попробуйте изменить поисковый запрос или фильтры
          </div>
        </div>
      )}

      {/* Modal for selected module */}
      {selectedModule && (
        <ModuleModal
          module={selectedModule}
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedModule(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ModuleCatalog;