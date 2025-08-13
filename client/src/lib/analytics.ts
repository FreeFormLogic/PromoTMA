// Yandex.Metrika analytics helper functions
declare global {
  interface Window {
    ym: (counterId: number, method: string, ...params: any[]) => void;
  }
}

const YANDEX_METRIKA_ID = 103742841;

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'hit', url, {
      title: title,
      referer: document.referrer
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', eventName, params);
  }
};

// Track user interactions for webvisor
export const trackUserInteraction = (action: string, element?: string, data?: any) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', 'user_interaction', {
      action,
      element,
      data,
      timestamp: new Date().toISOString()
    });
  }
};

// Track text input for webvisor visibility
export const trackTextInput = (inputType: string, value: string, field?: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', 'text_input', {
      inputType,
      field,
      textLength: value.length,
      hasContent: value.length > 0,
      timestamp: new Date().toISOString()
    });
  }
};

// Track AI chat interactions specifically
export const trackAIChat = (action: 'send_message' | 'receive_response' | 'open_chat' | 'close_chat', data?: any) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', 'ai_chat_interaction', {
      action,
      data,
      timestamp: new Date().toISOString()
    });
  }
};

// Track module interactions
export const trackModule = (action: string, moduleId?: string, moduleName?: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', 'module_interaction', {
      action,
      moduleId,
      moduleName,
      timestamp: new Date().toISOString()
    });
  }
};