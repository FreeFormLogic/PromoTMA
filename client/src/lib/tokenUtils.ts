// Утилиты для подсчета токенов и стоимости AI запросов

// Приблизительный подсчет токенов для текста (примерно 4 символа = 1 токен для английского, 2-3 символа для русского)
export function estimateTokens(text: string): number {
  // Для русского текста используем коэффициент 2.5 символа на токен
  return Math.ceil(text.length / 2.5);
}

// Стоимость токенов для разных моделей (в долларах за 1000 токенов)
const MODEL_COSTS = {
  'claude-sonnet-4-20250514': {
    input: 0.003,  // $3 за 1M входных токенов
    output: 0.015  // $15 за 1M выходных токенов
  },
  'claude-3-7-sonnet-20250219': {
    input: 0.003,
    output: 0.015
  }
};

export function calculateCost(inputTokens: number, outputTokens: number, model: string = 'claude-sonnet-4-20250514'): number {
  const costs = MODEL_COSTS[model as keyof typeof MODEL_COSTS] || MODEL_COSTS['claude-sonnet-4-20250514'];
  
  const inputCost = (inputTokens / 1000) * costs.input;
  const outputCost = (outputTokens / 1000) * costs.output;
  
  return inputCost + outputCost;
}

// Интерфейс для отслеживания сессий
export interface ChatSession {
  id: string;
  telegramId: string;
  startTime: number;
  totalTokens: number;
  totalCost: number;
  messageCount: number;
}

// Класс для управления AI чат сессиями
export class AiChatTracker {
  private currentSession: ChatSession | null = null;

  async startSession(telegramId: string): Promise<string> {
    try {
      const response = await fetch('/api/ai-chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telegramId,
          userAgent: navigator.userAgent,
          ipAddress: null // Будет определен на сервере
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const { sessionId } = await response.json();
      
      this.currentSession = {
        id: sessionId,
        telegramId,
        startTime: Date.now(),
        totalTokens: 0,
        totalCost: 0,
        messageCount: 0
      };

      return sessionId;
    } catch (error) {
      console.error('Failed to start AI chat session:', error);
      // Возвращаем fallback ID для локального отслеживания
      const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.currentSession = {
        id: fallbackId,
        telegramId,
        startTime: Date.now(),
        totalTokens: 0,
        totalCost: 0,
        messageCount: 0
      };
      return fallbackId;
    }
  }

  async trackMessage(
    role: 'user' | 'assistant',
    content: string,
    inputTokens?: number,
    outputTokens?: number,
    model: string = 'claude-sonnet-4-20250514'
  ): Promise<void> {
    if (!this.currentSession) {
      console.warn('No active session to track message');
      return;
    }

    // Оценка токенов если не переданы точные значения
    const estimatedTokens = estimateTokens(content);
    const actualInputTokens = inputTokens || (role === 'user' ? estimatedTokens : 0);
    const actualOutputTokens = outputTokens || (role === 'assistant' ? estimatedTokens : 0);
    
    const totalTokens = actualInputTokens + actualOutputTokens;
    const cost = calculateCost(actualInputTokens, actualOutputTokens, model);

    // Обновляем локальную сессию
    this.currentSession.totalTokens += totalTokens;
    this.currentSession.totalCost += cost;
    this.currentSession.messageCount++;

    // Отправляем на сервер
    try {
      await fetch('/api/ai-chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.currentSession.id,
          telegramId: this.currentSession.telegramId,
          role,
          content,
          tokensUsed: totalTokens,
          cost,
          model,
          metadata: {
            inputTokens: actualInputTokens,
            outputTokens: actualOutputTokens,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track message on server:', error);
      // Сохраняем локально для последующей отправки
      this.storeLocalMessage({
        sessionId: this.currentSession.id,
        telegramId: this.currentSession.telegramId,
        role,
        content,
        tokensUsed: totalTokens,
        cost,
        model
      });
    }
  }

  private storeLocalMessage(messageData: any): void {
    try {
      const stored = localStorage.getItem('pending_ai_messages') || '[]';
      const messages = JSON.parse(stored);
      messages.push(messageData);
      localStorage.setItem('pending_ai_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to store message locally:', error);
    }
  }

  async endSession(): Promise<void> {
    if (!this.currentSession) {
      return;
    }

    try {
      await fetch(`/api/ai-chat/session/${this.currentSession.id}/end`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to end session on server:', error);
    }

    this.currentSession = null;
  }

  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  // Синхронизация неотправленных сообщений
  async syncPendingMessages(): Promise<void> {
    try {
      const stored = localStorage.getItem('pending_ai_messages');
      if (!stored) return;

      const messages = JSON.parse(stored);
      if (messages.length === 0) return;

      // Отправляем по одному для избежания перегрузки
      for (const message of messages) {
        try {
          await fetch('/api/ai-chat/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
          });
        } catch (error) {
          console.error('Failed to sync message:', error);
          break; // Прекращаем синхронизацию при ошибке
        }
      }

      // Очищаем успешно отправленные сообщения
      localStorage.removeItem('pending_ai_messages');
    } catch (error) {
      console.error('Failed to sync pending messages:', error);
    }
  }
}

// Глобальный экземпляр трекера
export const aiChatTracker = new AiChatTracker();