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
};

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
        {industry.tags && industry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {industry.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-semibold text-success">ROI за 2-4 недели</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full group-hover:bg-telegram group-hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Подробнее
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
