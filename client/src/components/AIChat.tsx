import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2, X, Heart, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BusinessAnalysis {
  industry: string;
  size: string;
  challenges: string[];
  goals: string[];
  relevantCategories: string[];
  keywords: string[];
  persona: string;
}

interface Module {
  id: string;
  number: number;
  name: string;
  description: string;
  category: string;
  keyFeatures: string | string[];
  benefits: string;
  icon: string;
}

interface AIChatProps {
  onAnalysisUpdate: (analysis: BusinessAnalysis | null) => void;
  onModulesUpdate: (modules: any[]) => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  currentlyDisplayedModules?: any[];
}

// Global state for chat persistence
let persistentMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Привет! Я помогу собрать приложение для вашего бизнеса. Расскажите, чем вы занимаетесь и какие задачи хотите решить с помощью Telegram Mini Apps?',
    timestamp: new Date()
  }
];

export default function AIChat({ onAnalysisUpdate, onModulesUpdate, isMinimized = false, onToggleMinimize, currentlyDisplayedModules = [], isFullScreen = false }: AIChatProps & { isFullScreen?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(persistentMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [chatModules, setChatModules] = useState<Module[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Загружаем все модули для отображения в чате
  const { data: allModules } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const analyzeAndUpdateModules = async (messageHistory: string[]) => {
    try {
      // Analyze business context
      const analysisResponse = await apiRequest('POST', '/api/ai/analyze', { 
        messages: messageHistory 
      });
      const analysisData = await analysisResponse.json();
      
      setAnalysis(analysisData);
      onAnalysisUpdate(analysisData);
      
      // Skip getting modules here since we'll get them from the AI chat response
    } catch (error) {
      console.error('Error analyzing business:', error);
    }
  };

  const handleModuleLike = (module: Module) => {
    const isAlreadySelected = selectedModules.find(m => m.id === module.id);
    if (isAlreadySelected) {
      setSelectedModules(prev => prev.filter(m => m.id !== module.id));
    } else {
      setSelectedModules(prev => [...prev, module]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    persistentMessages = updatedMessages;
    setInput('');
    setIsLoading(true);

    try {
      // Prepare message history for AI
      const messageHistory = [...messages, userMessage].map(m => m.content);
      
      // Analyze business context and update modules
      await analyzeAndUpdateModules(messageHistory);
      
      // Get AI response with recommended modules
      const response = await apiRequest('POST', '/api/ai/chat', {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        })),
        alreadyShownModules: currentlyDisplayedModules.map(m => m.number)
      });
      const responseData = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      persistentMessages = finalMessages;

      // If AI recommended specific modules, get them and add to chat display
      if (responseData.recommendedModules && responseData.recommendedModules.length > 0 && allModules) {
        const recommendedModuleDetails = allModules.filter(module => 
          responseData.recommendedModules.includes(module.number)
        );
        setChatModules(prev => [...prev, ...recommendedModuleDetails]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const ModuleCard = ({ module }: { module: Module }) => {
    const isSelected = selectedModules.find(m => m.id === module.id);
    
    return (
      <Card className={`p-3 cursor-pointer transition-all duration-200 border ${
        isSelected 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-200 hover:border-blue-300'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-primary">
                Модуль {module.number}
              </span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
                {module.category}
              </Badge>
            </div>
            <h4 className="font-medium text-sm mb-1">{module.name}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {module.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleModuleLike(module)}
            className={`ml-2 ${
              isSelected 
                ? 'text-green-600 hover:text-green-700' 
                : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    );
  };

  const generatePrototype = () => {
    if (selectedModules.length < 3) {
      return;
    }
    
    const prototypeDescription = `Прототип приложения создан!\n\nВыбранные модули (${selectedModules.length}):\n${selectedModules.map(m => `• Модуль ${m.number}: ${m.name}`).join('\n')}\n\nВаше приложение будет включать: ${selectedModules.map(m => m.category).filter((c, i, arr) => arr.indexOf(c) === i).join(', ')}\n\nГотово к передаче в разработку! Хотите обсудить детали дизайна или дополнительные функции?`;
    
    const prototypeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: prototypeDescription,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, prototypeMessage]);
  };

  const renderMessageWithModules = (content: string, isAssistant: boolean) => {
    if (!isAssistant || !allModules) {
      return content;
    }

    // Split content by [MODULE:NUMBER] pattern and replace with inline module cards
    const parts = content.split(/(\[MODULE:\d+\])/g);
    
    return parts.map((part, index) => {
      const moduleMatch = part.match(/\[MODULE:(\d+)\]/);
      if (moduleMatch) {
        const moduleNumber = parseInt(moduleMatch[1]);
        const module = allModules.find(m => m.number === moduleNumber);
        
        if (module) {
          return (
            <div key={index} className="my-2">
              <ModuleCard module={module} />
            </div>
          );
        }
        return <span key={index} className="text-red-500">Модуль {moduleNumber} не найден</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
        {selectedModules.length > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
            {selectedModules.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`${isFullScreen ? 'h-screen w-screen rounded-none border-0' : 'h-full'} flex flex-col bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/10 ${isMinimized ? 'w-80' : ''}`}>
      {/* Header */}
      <div className="p-3 border-b bg-primary/5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-semibold text-sm">Подобрать функционал</h3>
              <p className="text-xs text-muted-foreground">
                AI Консультант {selectedModules.length > 0 && `(${selectedModules.length} выбрано)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {selectedModules.length >= 3 && (
              <Button 
                size="sm" 
                onClick={generatePrototype}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-7"
              >
                Создать прототип
              </Button>
            )}
            {onToggleMinimize && (
              <Button size="sm" variant="ghost" onClick={onToggleMinimize} className="h-6 w-6 p-0">
                <Minimize2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 min-h-0">
        <div className="space-y-3 min-h-[200px]">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted shadow-sm border border-border'
                  }`}
                >
                  <div className="text-xs whitespace-pre-wrap leading-relaxed">
                    {renderMessageWithModules(message.content, message.role === 'assistant')}
                  </div>
                  <p className={`text-[10px] mt-1 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          

          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 justify-start"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-muted rounded-xl px-3 py-2 shadow-sm border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs text-muted-foreground">AI печатает...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input - More compact */}
      <div className="p-2 border-t bg-background/50 backdrop-blur">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Расскажите о бизнесе..."
            className="min-h-[36px] max-h-[80px] resize-none text-xs"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[36px] w-[36px]"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

      </div>
    </Card>
  );
}