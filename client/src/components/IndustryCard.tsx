import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  UtensilsCrossed, 
  GraduationCap,
  Building2,
  Stethoscope,
  Scissors,
  Home,
  Car,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { type Industry } from "@shared/schema";

// Import industry images
import retailImage from "@assets/generated_images/Retail_e-commerce_industry_2d9f6898.png";
import restaurantImage from "@assets/generated_images/Restaurant_food_delivery_a5d568f6.png";
import hotelImage from "@assets/generated_images/Hotel_tourism_industry_91b816d2.png";
import healthcareImage from "@assets/generated_images/Healthcare_medicine_industry_df8a9904.png";
import beautyImage from "@assets/generated_images/Beauty_salon_services_3ede7a8c.png";
import fitnessImage from "@assets/generated_images/Fitness_gym_industry_59ad0f82.png";
import educationImage from "@assets/generated_images/Education_online_learning_34175a04.png";
import realEstateImage from "@assets/generated_images/Real_estate_property_e7fdd0e9.png";
import automotiveImage from "@assets/generated_images/Automotive_car_services_47d4008d.png";

interface IndustryCardProps {
  industry: any;
  onClick?: () => void;
}

const iconMap: Record<string, any> = {
  Store,
  UtensilsCrossed,
  GraduationCap,
  Building2,
  Stethoscope,
  Scissors,
  Home,
  Car,
};

const industryImages: Record<string, string> = {
  "Розничная торговля и e-commerce": retailImage,
  "Рестораны и доставка еды": restaurantImage,
  "Гостиничный бизнес и туризм": hotelImage,
  "Медицина и здравоохранение": healthcareImage,
  "Красота и салонные услуги": beautyImage,
  "Образование и онлайн-обучение": educationImage,
  "Фитнес и спортивные клубы": fitnessImage,
  "Недвижимость и риелторские услуги": realEstateImage,
  "Автомобильные услуги": automotiveImage,
};

// Business examples for each industry
function getBusinessExamples(industryName: string): string[] {
  const examples: Record<string, string[]> = {
    "Розничная торговля и e-commerce": ["Магазин одежды", "Электроника", "Продукты питания"],
    "Рестораны и доставка еды": ["Пиццерия", "Суши-бар", "Кофейня"],
    "Гостиничный бизнес и туризм": ["Отель", "Хостел", "Экскурсии"],
    "Медицина и здравоохранение": ["Частная клиника", "Стоматология", "Лаборатория"],
    "Красота и салонные услуги": ["Салон красоты", "Спа-центр", "Барбершоп"],
    "Образование и онлайн-обучение": ["Языковые курсы", "IT-школа", "Детский центр"],
    "Фитнес и спортивные клубы": ["Тренажерный зал", "Йога-студия", "Бассейн"],
    "Недвижимость и риелторские услуги": ["Агентство", "Застройщик", "Брокер"],
    "Автомобильные услуги": ["Автосалон", "СТО", "Автомойка"]
  };
  return examples[industryName] || ["Бизнес", "Услуги", "Компания"];
}

export function IndustryCard({ industry, onClick }: IndustryCardProps) {
  const IconComponent = iconMap[industry.icon] || Building2;
  const industryImage = industryImages[industry.name];

  return (
    <Card 
      className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden h-full flex flex-col"
      onClick={onClick}
    >
      {industryImage && (
        <div className="h-32 overflow-hidden bg-gradient-to-b from-telegram/10 to-transparent">
          <img 
            src={industryImage} 
            alt={industry.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className={`${industryImage ? "pt-3" : ""} pb-2`}>
        <div className="flex items-start gap-2">
          <div className="p-2 bg-telegram/10 rounded-lg flex-shrink-0">
            <IconComponent className="w-4 h-4 text-telegram" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {industry.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {industry.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {getBusinessExamples(industry.name).slice(0, 3).map((example: string, index: number) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-telegram/10 text-telegram rounded-full"
            >
              {example}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
