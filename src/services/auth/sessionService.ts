
import { UserRole } from "@/hooks/useAuth";

export interface SessionData {
  id: string;
  username: string;
  role: UserRole;
  isAuthenticated: boolean;
  loginTime: string;
}

/**
 * Сервис для управления сессией пользователя
 */
export const sessionService = {
  /**
   * Ключ для хранения данных сессии
   */
  SESSION_KEY: 'user',
  
  /**
   * Ключ для хранения сообщений об ошибках
   */
  ERROR_MESSAGE_KEY: 'auth_message',
  
  /**
   * Сохраняет сессию пользователя
   * 
   * @param sessionData - Данные сессии
   */
  saveSession(sessionData: SessionData): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
  },
  
  /**
   * Получает текущую сессию пользователя
   * 
   * @returns Данные сессии или null, если сессия не найдена
   */
  getCurrentSession(): SessionData | null {
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;
      
      const session = JSON.parse(sessionStr) as SessionData;
      return session;
    } catch (error) {
      console.error("Ошибка при получении сессии:", error);
      return null;
    }
  },
  
  /**
   * Проверяет, авторизован ли пользователь
   * 
   * @returns true, если пользователь авторизован
   */
  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session !== null && session.isAuthenticated === true;
  },
  
  /**
   * Очищает сессию пользователя
   */
  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  },
  
  /**
   * Сохраняет сообщение об ошибке авторизации
   * 
   * @param message - Сообщение об ошибке
   */
  saveErrorMessage(message: string): void {
    sessionStorage.setItem(this.ERROR_MESSAGE_KEY, message);
  },
  
  /**
   * Получает и удаляет сообщение об ошибке авторизации
   * 
   * @returns Сообщение об ошибке или null
   */
  getErrorMessage(): string | null {
    const message = sessionStorage.getItem(this.ERROR_MESSAGE_KEY);
    
    if (message) {
      sessionStorage.removeItem(this.ERROR_MESSAGE_KEY);
    }
    
    return message;
  }
};
