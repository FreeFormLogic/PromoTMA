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
    if (ref.current === null) return;
    
    // Создаем глобальную функцию для обработки авторизации
    (window as any).onTelegramAuth = async (user: TelegramUser) => {
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
          toast({
            title: "Ошибка авторизации",
            description: errorData.message,
            variant: "destructive",
          });
        }
      } catch (error) {
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
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    ref.current.appendChild(script);

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
      // Удаляем глобальную функцию
      delete (window as any).onTelegramAuth;
    };
  }, [botName, onAuth, setLocation, toast]);

  return <div ref={ref}></div>;
}