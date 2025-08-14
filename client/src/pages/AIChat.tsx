import { useState, useCallback, useEffect } from 'react';
import AIChat from '@/components/AIChat';
import { Card } from '@/components/ui/card';
import { X, Menu, Home, Package, Users, FileText, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { trackAIChat } from '@/lib/analytics';

export default function AIChatPage() {
  const [, setLocation] = useLocation();
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  const [currentlyDisplayedModules, setCurrentlyDisplayedModules] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAnalysisUpdate = (analysis: any) => {
    // Handle business analysis updates
  };

  const handleModulesUpdate = (modules: any[]) => {
    setCurrentlyDisplayedModules(modules);
  };

  const handleClose = useCallback(() => {
    console.log('Close button clicked - navigating home');
    trackAIChat('close_chat');
    setLocation('/');
  }, [setLocation]);

  // Track chat opening when component mounts
  useEffect(() => {
    trackAIChat('open_chat', { isReturningUser: true });
  }, []);

  return (
    <div 
      className="h-screen w-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden"
      onClick={(e) => {
        // Close menu when clicking outside
        if (isMenuOpen && !(e.target as Element).closest('.fixed')) {
          setIsMenuOpen(false);
        }
      }}
    >
      
      {/* Full Screen AI Chat - it will render its own header */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AIChat
          onAnalysisUpdate={handleAnalysisUpdate}
          onModulesUpdate={handleModulesUpdate}
          currentlyDisplayedModules={currentlyDisplayedModules}
          isFullScreen={true}
        />
      </div>

      {/* Compact Menu Button for AI Chat - positioned to not interfere with send button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg"
          title="Меню"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Floating Menu */}
      {isMenuOpen && (
        <div className="fixed bottom-36 right-4 z-40">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-3 min-w-[160px]">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-gray-100"
                onClick={() => {
                  setLocation('/');
                  setIsMenuOpen(false);
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Главная
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-gray-100"
                onClick={() => {
                  setLocation('/modules');
                  setIsMenuOpen(false);
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Модули
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-gray-100"
                onClick={() => {
                  setLocation('/development');
                  setIsMenuOpen(false);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Ваше преимущество
              </Button>
              {selectedModules.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-gray-100"
                  onClick={() => {
                    setLocation('/my-app');
                    setIsMenuOpen(false);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Мое App ({selectedModules.length})
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}