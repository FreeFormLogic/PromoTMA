import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IndustryCard } from "@/components/IndustryCard";
import { Check, AlertTriangle, Building2, MessageSquare, Puzzle, Search, Filter, Grid3X3, List } from "lucide-react";
import { type Industry, type Module } from "@shared/schema";
import { industries } from "@/data/industries";
import { moduleCategories } from "@/data/modules";

export default function Industries() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: industryData = [], isLoading } = useQuery<Industry[]>({
    queryKey: ["/api/industries"],
  });

  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ["/api/modules"],
  });

  // Use our comprehensive industries data
  const allIndustries = industries;
  
  // Get all unique tags from industries
  const allTags = Array.from(new Set(allIndustries.flatMap(industry => industry.tags || [])));
  
  // Filter industries based on search and tags
  const filteredIndustries = allIndustries.filter(industry => {
    const matchesSearch = searchTerm === "" || 
      industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.solutions.some(solution => solution.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === "all" || industry.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
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
            30+ отраслевых решений
          </h1>
          <p className="text-gray-600">
            Готовые решения для вашей ниши с учетом специфики бизнеса
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-12">
          {industries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>

        {/* Detailed Industry Examples */}
        <div className="space-y-8">
          {industries.slice(0, 3).map((industry) => (
            <Card key={industry.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-telegram/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-telegram" />
                  </div>
                  <span>{industry.name}</span>
                </CardTitle>
                <p className="text-gray-600">{industry.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                      Проблемы отрасли
                    </h4>
                    <ul className="space-y-2">
                      {(industry.painPoints as string[]).map((pain, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Check className="w-4 h-4 text-success mr-2" />
                      Наши решения
                    </h4>
                    <ul className="space-y-2">
                      {(industry.solutions as string[]).map((solution, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Check className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Related Modules */}
        <div className="mt-12 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Популярные модули для всех отраслей
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.filter(m => m.isPopular).slice(0, 8).map((module) => (
              <Card key={module.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-telegram/10 rounded-lg">
                    <Puzzle className="w-4 h-4 text-telegram" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">{module.name}</h4>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{module.description}</p>
                <div className="text-xs text-telegram font-medium">{module.category}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-telegram to-telegram-dark text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Не нашли свою отрасль?
          </h3>
          <p className="text-blue-100 mb-6">
            Мы создаем индивидуальные решения для любого бизнеса. 
            Модульная архитектура позволяет адаптировать приложение под любую нишу.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-success hover:bg-success/90 text-white px-8 py-3 font-semibold">
              <MessageSquare className="w-4 h-4 mr-2" />
              Обсудить ваш проект
            </Button>
            <div className="text-blue-100 text-sm">
              Консультация бесплатна • Решение за 1 день
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
