import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IndustryCard } from "@/components/IndustryCard";
import { IndustryModal } from "@/components/IndustryModal";
import { Check, AlertTriangle, Building2, MessageSquare, Puzzle, Search, Filter, Grid3X3, List } from "lucide-react";
import { type Industry, type Module } from "@shared/schema";
import { industries } from "@/data/industries";
import { moduleCategories } from "@/data/modules";

export default function Industries() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleIndustryClick = (industry: any) => {
    setSelectedIndustry(industry);
    setIsModalOpen(true);
  };

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
          {filteredIndustries.map((industry) => (
            <IndustryCard 
              key={industry.name} 
              industry={industry} 
              onClick={() => handleIndustryClick(industry)}
            />
          ))}
        </div>

        {/* Industry Modal */}
        {selectedIndustry && (
          <IndustryModal
            industry={selectedIndustry}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedIndustry(null);
            }}
          />
        )}

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
