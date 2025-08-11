import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  botName: string;
  onAuth: (user: TelegramUser) => void;
}

export function TelegramLoginWidget({ botName, onAuth }: TelegramLoginWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!ref.current) return;
    
    // Очищаем предыдущий контент
    ref.current.innerHTML = "";
    
    // Создаем уникальную функцию для этого виджета
    const authFunctionName = `telegramAuth_${Math.random().toString(36).substr(2, 9)}`;
    
    (window as any)[authFunctionName] = async (user: TelegramUser) => {
      console.log('Telegram auth data:', user);
      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user)
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('telegram_auth', JSON.stringify({
            user: data.user,
            timestamp: Date.now()
          }));
          
          toast({
            title: "Успешная авторизация",
            description: `Добро пожаловать, ${user.first_name}!`,
          });
          
          onAuth(user);
          setLocation("/");
        } else {
          const errorData = await response.json();
          console.error('Auth error:', errorData);
          toast({
            title: "Ошибка авторизации",
            description: errorData.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Network error:', error);
        toast({
          title: "Ошибка сети",
          description: "Не удалось подключиться к серверу",
          variant: "destructive",
        });
      }
    };

    // Создаем Telegram Login Widget
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", `${authFunctionName}(user)`);
    script.setAttribute("data-request-access", "write");
    script.async = true;
    
    script.onerror = () => {
      console.error('Failed to load Telegram widget');
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить виджет Telegram",
        variant: "destructive",
      });
    };

    ref.current.appendChild(script);

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
      // Удаляем функцию авторизации
      if ((window as any)[authFunctionName]) {
        delete (window as any)[authFunctionName];
      }
    };
  }, [botName, onAuth, setLocation, toast]);

  return <div ref={ref}></div>;
}