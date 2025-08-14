import { useState, useCallback, useEffect } from 'react';
import AIChat from '@/components/AIChat';
import { Card } from '@/components/ui/card';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { trackAIChat } from '@/lib/analytics';

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
    <div className="h-screen w-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden">
      
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
          onClick={() => setLocation('/')}
          className="w-6 h-6 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg"
          title="Меню"
        >
          <Menu className="w-3 h-3" />
        </Button>
      </div>

    </div>
  );
}