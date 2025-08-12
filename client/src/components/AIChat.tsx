import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Minimize2, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

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

interface AIChatProps {
  onAnalysisUpdate: (analysis: BusinessAnalysis | null) => void;
  onModulesUpdate: (modules: any[]) => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function AIChat({ onAnalysisUpdate, onModulesUpdate, isMinimized = false, onToggleMinimize }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я помогу подобрать идеальные модули для вашего бизнеса. Расскажите, чем вы занимаетесь и какие задачи хотите решить с помощью Telegram Mini Apps?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      
      // Get relevant modules
      const modulesResponse = await apiRequest('POST', '/api/ai/modules/relevant', { 
        analysis: analysisData 
      });
      const modulesData = await modulesResponse.json();
      
      onModulesUpdate(modulesData);
    } catch (error) {
      console.error('Error analyzing business:', error);
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

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare message history for AI
      const messageHistory = [...messages, userMessage].map(m => m.content);
      
      // Analyze business context and update modules
      await analyzeAndUpdateModules(messageHistory);
      
      // Get AI response
      const response = await apiRequest('POST', '/api/ai/chat', {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      });
      const responseData = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-12 h-12 shadow-lg"
          size="sm"
        >
          <Bot className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`h-[600px] flex flex-col bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/10 ${isMinimized ? 'w-80' : ''}`}>
      {/* Header */}
      <div className="p-3 border-b bg-primary/5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-6 w-6 text-primary" />
              <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Консультант</h3>
              <p className="text-xs text-muted-foreground">Подбор модулей</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onToggleMinimize && (
              <Button size="sm" variant="ghost" onClick={onToggleMinimize} className="h-6 w-6 p-0">
                <Minimize2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted shadow-sm border border-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Анализирую ваш бизнес...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-background/50 backdrop-blur">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Опишите ваш бизнес или задайте вопрос..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Нажмите Enter для отправки, Shift+Enter для новой строки
        </p>
      </div>
    </Card>
  );
}