import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleCard } from "@/components/ModuleCard";
import { type Module } from "@shared/schema";

export default function Modules() {
  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const moduleCategories = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

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

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Категории</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(moduleCategories).map(([category, categoryModules]) => (
                    <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 line-clamp-1">
                        {category}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryModules.length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules Grid */}
          <div className="lg:col-span-9">
            {Object.entries(moduleCategories).map(([category, categoryModules]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mr-3">
                    {category}
                  </h2>
                  <Badge variant="outline" className="text-telegram">
                    {categoryModules.length} модулей
                  </Badge>
                </div>
                
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryModules.map((module) => (
                    <ModuleCard key={module.id} module={module} />
                  ))}
                </div>
              </div>
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
      </div>
    </div>
  );
}
