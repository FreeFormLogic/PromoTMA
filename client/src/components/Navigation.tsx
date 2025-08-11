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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear secure cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('telegram_auth');
    
    // Force a complete page reload to reset all component states
    window.location.href = window.location.origin;
  };

  const handlePartnersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Раздел в разработке",
      description: "Раздел 'Партнерам' еще находится в разработке. Скоро будет доступен!",
      variant: "default",
    });
  };

  const navItems = [
    { path: "/", label: "Главная", icon: MessageSquare },
    { path: "/modules", label: "Модули", icon: Puzzle },
    { path: "/industries", label: "Отрасли", icon: Building2 },
    { path: "/process", label: "Разработка", icon: Rocket },
    { path: "/partners", label: "Партнерам", icon: Handshake },
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
              const isPartnersItem = item.path === "/partners";
              
              if (isPartnersItem) {
                return (
                  <div 
                    key={item.path}
                    onClick={handlePartnersClick}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer text-gray-700 hover:text-telegram hover:bg-telegram/10`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                );
              }
              
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    data-tutorial-target={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
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
                          ? 'bg-telegram text-white' 
                          : 'text-gray-700 hover:text-telegram hover:bg-telegram/10'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full justify-start mt-4"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
