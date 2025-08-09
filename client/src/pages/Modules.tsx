import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleCard } from "@/components/ModuleCard";
import { Grid3X3, Filter, Building2 } from "lucide-react";
import { type Module, type Industry } from "@shared/schema";

export default function Modules() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: modules = [], isLoading } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  const { data: industries = [] } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });

  const moduleCategories = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const filteredModules = selectedCategory === "all" 
    ? modules 
    : modules.filter(module => module.category === selectedCategory);

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
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Категории
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    className={`w-full justify-between ${
                      selectedCategory === "all" ? "bg-telegram hover:bg-telegram/90" : ""
                    }`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    <span className="flex items-center">
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Все модули
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {modules.length}
                    </Badge>
                  </Button>
                  
                  {Object.entries(moduleCategories).map(([category, categoryModules]) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className={`w-full justify-between text-left ${
                        selectedCategory === category ? "bg-telegram hover:bg-telegram/90" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span className="truncate pr-2">{category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {categoryModules.length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules Grid */}
          <div className="lg:col-span-9">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mr-3">
                  {selectedCategory === "all" ? "Все модули" : selectedCategory}
                </h2>
                <Badge variant="outline" className="text-telegram">
                  {filteredModules.length} модулей
                </Badge>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>
        </div>

        {/* Related Industries */}
        <div className="mt-12 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Отрасли, которые используют наши модули
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.slice(0, 6).map((industry) => (
              <Card key={industry.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-telegram/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-telegram" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{industry.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{industry.description}</p>
                  </div>
                </div>
              </Card>
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
