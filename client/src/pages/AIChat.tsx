import { useState, useCallback } from 'react';
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

  const handleClose = useCallback(() => {
    console.log('Close button clicked - navigating home');
    // Force navigation to home with delay to ensure state is updated
    setTimeout(() => {
      setLocation('/');
      window.location.href = '/';
    }, 100);
  }, [setLocation]);

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

      {/* Close Button - Floating */}
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={handleClose}
        className="absolute top-3 right-3 h-8 w-8 p-0 z-50 bg-white/90 hover:bg-white shadow-sm"
        title="Закрыть"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}