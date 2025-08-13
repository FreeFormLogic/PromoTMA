import { useState, useRef, useEffect, Component as ReactComponent } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2, X, Heart, Plus, Check, ArrowRight, Settings, Component } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
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
    content: 'Привет! Я помогу создать ваное собственное приложение для бизнеса.\n\n**Как это работает:**\n• Расскажите о вашем бизнесе\n• Я покажу подходящие модули\n• Нажимайте **плюсики** на модулях, чтобы добавить их в ваше приложение\n• Соберите 3-30 модулей для создания прототипа\n\nРасскажите, чем вы занимаетесь и какие задачи хотите решить?',
    timestamp: Date.now()
  }
];

// Error Boundary Component to handle external extension errors
class ChatErrorBoundary extends ReactComponent<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Check if it's a browser extension error and ignore it completely
    if (error?.stack?.includes('extension') || 
        error?.message?.includes('extension') ||
        error?.stack?.includes('chrome-extension') ||
        error?.stack?.includes('moz-extension') ||
        error?.stack?.includes('binance') ||
        error?.stack?.includes('egjidjbpglichdcondbcbdnbeeppgdph')) {
      console.log('Browser extension error ignored during render:', error);
      return { hasError: false }; // Don't show error UI for extensions
    }
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log error but don't break the app
    console.warn('AIChat Error Boundary caught error:', error, errorInfo);
    
    // Check if it's a browser extension error and ignore it
    if (error?.stack?.includes('extension') || 
        error?.message?.includes('extension') ||
        error?.stack?.includes('chrome-extension') ||
        error?.stack?.includes('moz-extension') ||
        error?.stack?.includes('binance') ||
        error?.stack?.includes('egjidjbpglichdcondbcbdnbeeppgdph')) {
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
  const [, setLocation] = useLocation();
  // Initialize from localStorage first
  const initializeFromStorage = () => {
    try {
      const savedMessages = localStorage.getItem('aiChatMessages');
      const savedSelectedModules = localStorage.getItem('selectedModules');
      
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        persistentMessages = parsed;
        return parsed;
      } else {
        const defaultMessage = [{
          id: '1',
          role: 'assistant' as const,
          content: 'Привет! Я помогу создать ваше собственное приложение для бизнеса.\n\n**Как это работает:**\n• Расскажите о вашем бизнесе\n• Я покажу подходящие модули\n• Нажимайте **плюсики** на модулях, чтобы добавить их в ваше приложение\n• Соберите 3-30 модулей для создания прототипа\n\nРасскажите, чем вы занимаетесь и какие задачи хотите решить?',
          timestamp: Date.now()
        }];
        persistentMessages = defaultMessage;
        localStorage.setItem('aiChatMessages', JSON.stringify(defaultMessage));
        return defaultMessage;
      }
    } catch (e) {
      console.error('Failed to load from storage:', e);
      return persistentMessages;
    }
  };

  const [messages, setMessages] = useState<Message[]>(() => initializeFromStorage());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [selectedModules, setSelectedModules] = useState<Module[]>(() => {
    try {
      const saved = localStorage.getItem('selectedModules');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
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
      // Prevent duplicates by double-checking
      const alreadyExists = selectedModules.find(m => m.id === module.id);
      if (!alreadyExists) {
        setSelectedModules(prev => [...prev, module]);
        // Save to localStorage for "Мое App" section
        const savedModules = JSON.parse(localStorage.getItem('selectedModules') || '[]');
        const moduleExists = savedModules.find((m: Module) => m.id === module.id);
        if (!moduleExists) {
          const updatedModules = [...savedModules, module];
          localStorage.setItem('selectedModules', JSON.stringify(updatedModules));
        }
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    persistentMessages = updatedMessages;
    localStorage.setItem('aiChatMessages', JSON.stringify(updatedMessages));
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
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      persistentMessages = finalMessages;
      localStorage.setItem('aiChatMessages', JSON.stringify(finalMessages));

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
        timestamp: Date.now()
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
    "ИНДОНЕЗИЯ": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "ИГРЫ": "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    "ДОПОЛНИТЕЛЬНЫЕ СЕРВИСЫ": "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    "АВТОМАТИЗАЦИЯ": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    "ОТРАСЛЕВЫЕ РЕШЕНИЯ": "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
    "АНАЛИТИКА": "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
    "БЕЗОПАСНОСТЬ": "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
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
          className={`group cursor-pointer transition-all duration-300 border mb-3 ${
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
                <div className="text-[10px] mt-1 font-normal text-gray-500 uppercase">
                  {module.category}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {module.description}
            </p>
            
            {/* Benefit and arrow */}
            <div className="flex items-center justify-between">
              <div 
                className="text-xs text-blue-600 dark:text-blue-400 font-medium flex-1"
                dangerouslySetInnerHTML={{
                  __html: module.benefits.replace(/\.\.\..*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
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

              <DialogDescription className="sr-only">
                Детальная информация о выбранном модуле
              </DialogDescription>
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
                      <div 
                        className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed text-left"
                        dangerouslySetInnerHTML={{
                          __html: module.benefits.replace(/\.\.\..*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        }}
                      />
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
                            <div key={index} className="mb-2">
                              • {feature.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  const boldText = part.slice(2, -2);
                                  return (
                                    <strong key={partIndex} className="font-semibold">
                                      {boldText}
                                    </strong>
                                  );
                                }
                                return <span key={partIndex}>{part}</span>;
                              })}
                            </div>
                          ))
                        : <div>• {typeof module.keyFeatures === 'string' 
                            ? module.keyFeatures.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  const boldText = part.slice(2, -2);
                                  return (
                                    <strong key={partIndex} className="font-semibold">
                                      {boldText}
                                    </strong>
                                  );
                                }
                                return <span key={partIndex}>{part}</span>;
                              })
                            : module.keyFeatures
                          }</div>
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
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, prototypeMessage]);
  };

  const renderMessageWithModules = (content: string, isAssistant: boolean, hasDisplayedModules: boolean = false) => {
    // Safety check for content
    if (!content || typeof content !== 'string') {
      console.warn('Error rendering message:', content);
      return <span>Ошибка отображения сообщения</span>;
    }

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
            
            {/* Reset button - not shown after first message */}
            {messages.length > 2 && (
              <span
                onClick={() => {
                  if (window.confirm('Вы действительно хотите сбросить весь чат?\n\n☑️ Также сбросить выбранные модули?')) {
                    // Reset chat
                    const welcomeMessage = {
                      id: '1',
                      role: 'assistant' as const,
                      content: 'Привет! Я помогу создать ваше собственное приложение для бизнеса.\n\n**Как это работает:**\n• Расскажите о вашем бизнесе\n• Я покажу подходящие модули\n• Нажимайте **плюсики** на модулях, чтобы добавить их в ваше приложение\n• Соберите 3-30 модулей для создания прототипа\n\nРасскажите, чем вы занимаетесь и какие задачи хотите решить?',
                      timestamp: new Date()
                    };
                    
                    setMessages([welcomeMessage]);
                    persistentMessages = [welcomeMessage];
                    setChatModules([]);
                    
                    // Clear selected modules too
                    setSelectedModules([]);
                    localStorage.removeItem('selectedModules');
                    localStorage.removeItem('aiChatMessages');
                    
                    onModulesUpdate([]);
                  }
                }}
                className="text-red-600 hover:text-red-700 cursor-pointer hover:underline font-medium"
              >
                Сбросить
              </span>
            )}
          </div>
        </div>
      );
    }
    
    return renderedParts;
  };

  // Function to format text with bold support, headers and preserve line breaks
  const formatText = (text: string) => {
    if (!text) return text;
    
    // First handle headers (## text) and bold (**text**)
    const lines = text.split('\n');
    
    return (
      <>
        {lines.map((line, lineIndex) => {
          // Handle headers
          if (line.startsWith('## ')) {
            const headerText = line.slice(3);
            return (
              <h3 key={lineIndex} className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                {headerText}
              </h3>
            );
          }
          
          // Handle bold text within the line
          const parts = line.split(/(\*\*.*?\*\*)/g);
          
          return (
            <span key={lineIndex}>
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  const boldText = part.slice(2, -2);
                  return (
                    <strong key={partIndex} className="font-semibold text-gray-900 dark:text-gray-100">
                      {boldText}
                    </strong>
                  );
                }
                return <span key={partIndex}>{part}</span>;
              })}
              {lineIndex < lines.length - 1 && <br />}
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
    <div className={`${isFullScreen ? 'h-full w-full' : 'h-full'} flex flex-col bg-gradient-to-br from-background via-background to-primary/5 ${isMinimized ? 'w-80' : ''}`}>

      {/* Header - only show for full screen */}
      {isFullScreen && (
        <div className="p-4 border-b bg-primary/5 backdrop-blur flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <h1 className="font-semibold text-lg">AI-конструктор приложений</h1>
            <p className="text-xs text-gray-500 mt-1">Создадим приложение вместе</p>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Chat close button clicked');
              setLocation('/');
            }}
            className="h-8 w-8 p-0"
            title="Закрыть"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 min-h-0">
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
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU', { 
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

      {/* Input area */}
      <div className="p-3 border-t bg-muted/30 flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
              }
            }}
            placeholder="Расскажите о бизнесе..."
            className="flex-1 min-h-[40px] max-h-[120px] text-xs resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="sm" 
            className="self-end"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
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