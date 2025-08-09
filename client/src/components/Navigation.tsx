import { Link, useLocation } from "wouter";
import { 
  MessageSquare, 
  Puzzle, 
  Building2, 
  DollarSign, 
  Rocket,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('telegram_auth');
    window.location.reload();
  };

  const navItems = [
    { path: "/", label: "Главная", icon: MessageSquare },
    { path: "/modules", label: "Модули", icon: Puzzle },
    { path: "/industries", label: "Отрасли", icon: Building2 },
    { path: "/pricing", label: "Цены", icon: DollarSign },
    { path: "/process", label: "Процесс", icon: Rocket },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <MessageSquare className="text-telegram text-2xl" />
              <h1 className="text-xl font-semibold text-gray-900">Mini Apps Directory</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-telegram text-white' 
                      : 'text-gray-700 hover:text-telegram hover:bg-telegram/10'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-700"></div>
                <div className="w-full h-0.5 bg-gray-700"></div>
                <div className="w-full h-0.5 bg-gray-700"></div>
              </div>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
