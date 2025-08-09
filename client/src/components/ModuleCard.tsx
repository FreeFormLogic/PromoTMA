import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Image, 
  ShoppingCart, 
  CreditCard, 
  Package,
  Brain,
  BarChart3,
  MapPin,
  TestTube,
  Crown,
  Trophy,
  Calendar,
  Users,
  GraduationCap
} from "lucide-react";
import { type Module } from "@shared/schema";

interface ModuleCardProps {
  module: Module;
}

const iconMap: Record<string, any> = {
  Store,
  Image,
  ShoppingCart,
  CreditCard,
  Package,
  Brain,
  BarChart3,
  MapPin,
  TestTube,
  Crown,
  Trophy,
  Calendar,
  Users,
  GraduationCap,
};

export function ModuleCard({ module }: ModuleCardProps) {
  const IconComponent = iconMap[module.icon] || Store;

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-telegram/10 rounded-lg">
              <IconComponent className="w-5 h-5 text-telegram" />
            </div>
            {module.isPopular && (
              <Badge variant="secondary" className="text-xs">
                Популярный
              </Badge>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
          {module.name}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {module.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700">Возможности:</h4>
          <ul className="space-y-1">
            {(module.features as string[]).slice(0, 3).map((feature, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <div className="w-1 h-1 bg-success rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
            {(module.features as string[]).length > 3 && (
              <li className="text-xs text-gray-400">
                +{(module.features as string[]).length - 3} возможностей...
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
