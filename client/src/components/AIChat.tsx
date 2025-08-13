import { useState, useRef, useEffect, Component as ReactComponent } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2, X, Heart, Plus, Check, ArrowRight, Settings, Component } from 'lucide-react';
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
    content: 'Привет! Я помогу создать ваше собственное приложение для бизнеса.\n\n**Как это работает:**\n• Расскажите о вашем бизнесе\n• Я покажу подходящие модули\n• Нажимайте **плюсики** на модулях, чтобы добавить их в ваше приложение\n• Соберите 3-30 модулей для создания прототипа\n\nРасскажите, чем вы занимаетесь и какие задачи хотите решить?',
    timestamp: new Date()
  }
];

// Error Boundary Component to handle external extension errors
class ChatErrorBoundary extends ReactComponent<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log error but don't break the app
    console.warn('AIChat Error Boundary caught error:', error, errorInfo);
    
    // Check if it's a browser extension error and ignore it
    if (error?.stack?.includes('extension') || 
        error?.message?.includes('extension') ||
        error?.stack?.includes('chrome-extension') ||
        error?.stack?.includes('moz-extension')) {
      console.log('Browser extension error ignored:', error);
      this.setState({ hasError: false }); // Reset state to continue
      return;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="h-full flex items-center justify-center p-4">
          <div className="text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">AI чат временно недоступен</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => this.setState({ hasError: false })}
              className="mt-2"
            >
              Попробовать снова
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

function AIChatComponent({ onAnalysisUpdate, onModulesUpdate, isMinimized = false, onToggleMinimize, currentlyDisplayedModules = [], isFullScreen = false }: AIChatProps & { isFullScreen?: boolean }) {
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
    // Scroll to beginning of the new AI message, not the end
    if (scrollAreaRef.current && messages.length > 0) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'assistant') {
          // Find the last assistant message element and scroll to its top
          setTimeout(() => {
            const messageElements = scrollContainer.querySelectorAll('[data-message-role="assistant"]');
            const lastAssistantMessage = messageElements[messageElements.length - 1];
            if (lastAssistantMessage) {
              lastAssistantMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          }, 100);
        } else {
          // For user messages, scroll to bottom normally
          setTimeout(() => {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }
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
      // Remove from localStorage
      const savedModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
      const updatedModules = savedModules.filter((m: Module) => m.id !== module.id);
      localStorage.setItem('selectedModules', JSON.stringify(updatedModules));
    } else {
      setSelectedModules(prev => [...prev, module]);
      // Save to localStorage for "Мое App" section
      const savedModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
      const updatedModules = [...savedModules, module];
      localStorage.setItem('selectedModules', JSON.stringify(updatedModules));
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

  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    "E-COMMERCE": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "МАРКЕТИНГ": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    "ВОВЛЕЧЕНИЕ": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "ОБРАЗОВАНИЕ": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "ФИНТЕХ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "CRM": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    "B2B": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    "БРОНИРОВАНИЕ": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    "КОНТЕНТ И МЕДИА": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    "ИНТЕГРАЦИИ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "ИНДОНЕЗИЯ": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    "ИГРЫ": "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    "АВТОМАТИЗАЦИЯ": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    "ОТРАСЛЕВЫЕ РЕШЕНИЯ": "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
    "АНАЛИТИКА": "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    "БЕЗОПАСНОСТЬ": "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    "КОММУНИКАЦИИ": "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
    "СОЦИАЛЬНАЯ КОММЕРЦИЯ": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300",
    "AI И АВТОМАТИЗАЦИЯ": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    "AI-АВАТАРЫ": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    "ПАРСИНГ TELEGRAM": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "WEB3 & DEFI": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "ЛОКАЛЬНЫЕ СЕРВИСЫ": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
  };

  const ModuleCard = ({ module }: { module: Module }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isSelected = selectedModules.find(m => m.id === module.id);
    const IconComponent = Sparkles; // Use sparkles icon for now
    
    return (
      <>
        <Card 
          className={`group cursor-pointer transition-all duration-300 border ${
            isSelected 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
          } hover:-translate-y-1 hover:shadow-lg`}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="p-4">
            {/* Icon and header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight break-words hyphens-auto">
                  {module.name}
                </h3>
                <Badge className={`text-xs mt-1 opacity-100 ${categoryColors[module.category] || categoryColors["ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ"]}`}>
                  {module.category}
                </Badge>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {module.description}
            </p>
            
            {/* Benefit and arrow */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex-1">
                {module.benefits}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleLike(module);
                  }}
                  className={`w-6 h-6 p-0 ${
                    isSelected 
                      ? 'text-blue-600 hover:text-blue-700' 
                      : 'text-gray-400 hover:text-blue-600'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </Button>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Module details modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden z-[9999]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {module.name}
                </DialogTitle>
              </div>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Icon and description */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {module.description}
                    </p>
                    <div className="mt-3 bg-blue-50 dark:bg-blue-900/30 px-4 py-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div 
                          className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: module.benefits.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                {module.keyFeatures && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      Ключевые возможности
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {Array.isArray(module.keyFeatures) 
                        ? module.keyFeatures.map((feature, index) => (
                            <div key={index} className="mb-2">• {feature}</div>
                          ))
                        : <div>• {module.keyFeatures}</div>
                      }
                    </div>
                  </div>
                )}

                {/* Add to app button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => {
                      handleModuleLike(module);
                      setIsModalOpen(false);
                    }}
                    className={`w-full ${
                      isSelected 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Убрать из приложения
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить в приложение
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
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

  const renderMessageWithModules = (content: string, isAssistant: boolean, hasDisplayedModules: boolean = false) => {
    if (!isAssistant || !allModules) {
      // Format text for user messages with bold support
      return formatText(content);
    }

    // Split content by [MODULE:NUMBER] pattern and replace with inline module cards
    const parts = content.split(/(\[MODULE:\d+\])/g);
    const hasModules = parts.some(part => part.match(/\[MODULE:\d+\]/));
    
    const renderedParts = parts.map((part, index) => {
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
      return <span key={index}>{formatText(part)}</span>;
    });

    // Add clickable text at the end if this message has modules or if modules are currently displayed
    // Debug: Always show for assistant messages that follow module recommendations
    if (isAssistant && (hasModules || hasDisplayedModules || (currentlyDisplayedModules && currentlyDisplayedModules.length > 0))) {
      renderedParts.push(
        <div key="actions" className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs">
            <span
              onClick={() => {
                const userMessage: Message = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: 'Предложи больше функций',
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, userMessage]);
                setIsLoading(true);
                
                setTimeout(async () => {
                  try {
                    const response = await fetch('/api/ai/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        messages: [...messages, userMessage],
                        alreadyShownModules: currentlyDisplayedModules || []
                      })
                    });
                    
                    const data = await response.json();
                    
                    if (data.recommendedModules) {
                      onModulesUpdate(data.recommendedModules);
                    }
                    
                    const botMessage: Message = {
                      id: Date.now().toString() + '_bot',
                      role: 'assistant',
                      content: data.response,
                      timestamp: new Date()
                    };
                    
                    setMessages(prev => [...prev, botMessage]);
                  } catch (error) {
                    console.error('Chat error:', error);
                  } finally {
                    setIsLoading(false);
                  }
                }, 500);
              }}
              className="text-blue-600 hover:text-blue-700 cursor-pointer hover:underline font-medium"
            >
              Больше функций
            </span>
            
            {selectedModules.length > 0 && (
              <span
                onClick={() => window.location.href = '/my-app'}
                className="text-blue-600 hover:text-blue-700 cursor-pointer hover:underline font-medium"
              >
                Мое App ({selectedModules.length})
              </span>
            )}
          </div>
        </div>
      );
    }
    
    return renderedParts;
  };

  // Function to format text with bold support and preserve line breaks
  const formatText = (text: string) => {
    if (!text) return text;
    
    // Split by **bold** patterns and render accordingly
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
              <strong key={index} className="font-semibold text-gray-900 dark:text-gray-100">
                {boldText}
              </strong>
            );
          }
          // Handle line breaks
          const lines = part.split('\n');
          return (
            <span key={index}>
              {lines.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line}
                  {lineIndex < lines.length - 1 && <br />}
                </span>
              ))}
            </span>
          );
        })}
      </>
    );
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
          <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white">
            {selectedModules.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`${isFullScreen ? 'h-screen w-screen rounded-none border-0' : 'h-full'} flex flex-col bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/10 ${isMinimized ? 'w-80' : ''}`}>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-3 min-h-[100px] pb-20">
          <AnimatePresence>
            {messages.map((message) => {
              try {
                return (
                  <motion.div
                    key={message.id}
                    data-message-role={message.role}
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
                      className={`max-w-[85%] rounded-xl px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted shadow-sm border border-border'
                      }`}
                    >
                      <div className="text-xs whitespace-pre-wrap leading-relaxed">
                        {renderMessageWithModules(
                          message.content, 
                          message.role === 'assistant', 
                          message.role === 'assistant' && currentlyDisplayedModules && currentlyDisplayedModules.length > 0
                        )}
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
                );
              } catch (error) {
                // Catch any errors in message rendering and show fallback
                console.warn('Error rendering message:', error);
                return (
                  <div key={message.id} className="text-xs text-gray-500 p-2">
                    Ошибка отображения сообщения
                  </div>
                );
              }
            })}
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

      {/* Input - Fixed positioning with proper width */}
      <div className="sticky bottom-0 bg-background border-t border-gray-200 z-10 shadow-lg">

        
        {/* Input field */}
        <div className="p-2 pt-1 flex gap-2 w-full max-w-full">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Расскажите о бизнесе..."
            className="min-h-[36px] max-h-[80px] resize-none text-xs flex-1 min-w-0"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[36px] w-[36px] flex-shrink-0"
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

// Wrap the component with error boundary and export
export default function AIChat(props: AIChatProps & { isFullScreen?: boolean }) {
  return (
    <ChatErrorBoundary>
      <AIChatComponent {...props} />
    </ChatErrorBoundary>
  );
}