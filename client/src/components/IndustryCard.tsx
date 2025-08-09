import { Card, CardContent } from "@/components/ui/card";
import { 
  Store, 
  UtensilsCrossed, 
  GraduationCap,
  Building2,
  Stethoscope,
  Scissors,
  Home,
  Car
} from "lucide-react";
import { type Industry } from "@shared/schema";

interface IndustryCardProps {
  industry: Industry;
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

export function IndustryCard({ industry }: IndustryCardProps) {
  const IconComponent = iconMap[industry.icon] || Building2;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-telegram/10 rounded-lg flex-shrink-0">
            <IconComponent className="w-4 h-4 text-telegram" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {industry.name}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {industry.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
