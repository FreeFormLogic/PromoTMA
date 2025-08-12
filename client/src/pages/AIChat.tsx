import { useState } from 'react';
import AIChat from '@/components/AIChat';
import { Card } from '@/components/ui/card';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function AIChatPage() {
  const [, setLocation] = useLocation();
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  const [currentlyDisplayedModules, setCurrentlyDisplayedModules] = useState<any[]>([]);

  const handleAnalysisUpdate = (analysis: any) => {
    // Handle business analysis updates
  };

  const handleModulesUpdate = (modules: any[]) => {
    setCurrentlyDisplayedModules(modules);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative">
      {/* Header with Menu Button */}
      <div className="p-3 border-b bg-primary/5 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">AI-конструктор</h1>
          <p className="text-sm text-muted-foreground">
            Персональный подбор модулей для вашего бизнеса
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Standard Menu Button */}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setLocation('/modules')}
            className="h-8 px-3"
            title="Функционал"
          >
            <Menu className="h-4 w-4 mr-1" />
            Меню
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="h-8 w-8 p-0"
            title="Закрыть"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Full Screen AI Chat */}
      <div className="flex-1 overflow-hidden">
        <AIChat
          onAnalysisUpdate={handleAnalysisUpdate}
          onModulesUpdate={handleModulesUpdate}
          currentlyDisplayedModules={currentlyDisplayedModules}
          isFullScreen={true}
        />
      </div>
    </div>
  );
}