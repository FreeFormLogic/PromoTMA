import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  MessageSquare, 
  Puzzle, 
  Building2, 
  Rocket,
  Handshake,
  LogOut,
  Menu,
  X,
  Settings,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Убрали функцию logout - нет авторизации

  const handlePartnersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Раздел в разработке",
      description: "Раздел 'Партнерам' еще находится в разработке. Скоро будет доступен!",
      variant: "default",
    });
  };

  const navItems = [
    { path: "/home", label: "Главная", icon: MessageSquare },
    { path: "/modules", label: "Функционал", icon: Puzzle },
    { path: "/industries", label: "Отрасли", icon: Building2 },
    { path: "/", label: "AI-конструктор", icon: Bot },
    { path: "/my-app", label: "Мое App", icon: Settings },
    { path: "/development", label: "Ваше преимущество", icon: Rocket },
    { path: "/partners", label: "Партнерам", icon: Handshake },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <MessageSquare className="text-blue-500 text-2xl" />
                <h1 className="text-xl font-semibold text-gray-900">Mini Apps Directory</h1>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                const isPartnersItem = item.path === "/partners";
                
                if (isPartnersItem) {
                  return (
                    <div 
                      key={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-gray-700 hover:text-telegram hover:bg-telegram/10`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  );
                }
                
                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : item.path === '/ai-chat'
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Убрали кнопку "Выйти" - нет авторизации */}
            </div>
          </nav>
        </div>
      </header>


      {/* Mobile menu button - снизу экрана */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <Button 
          variant="default" 
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>
        
      {/* Mobile Menu - снизу экрана */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg rounded-t-xl">
            <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              const isPartnersItem = item.path === "/partners";
              
              if (isPartnersItem) {
                return (
                  <div 
                    key={item.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors cursor-pointer text-gray-700 hover:text-telegram hover:bg-telegram/10`}
                    onClick={(e) => {
                      handlePartnersClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                );
              }
              
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : item.path === '/ai-chat'
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
            
            {/* Убрали кнопку "Выйти" из мобильного меню */}
            </div>
          </div>
        </>
      )}
    </>
  );
}