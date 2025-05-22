
/**
 * Сервис для работы с сессиями пользователей
 * Отвечает за сохранение и получение информации о текущей сессии
 */

// Тип для сессии пользователя
export interface UserSession {
  id: string;
  username: string;
  role: "manager" | "employee";
  isAuthenticated: boolean;
  loginTime: string;
}

// Ключ для хранения сессии в localStorage
const SESSION_KEY = "user";
// Ключ для хранения сообщения об ошибке
const ERROR_MESSAGE_KEY = "auth_message";

export const sessionService = {
  /**
   * Сохраняет сессию пользователя в localStorage
   * @param session - Сессия пользователя
   */
  saveSession(session: UserSession): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Ошибка при сохранении сессии:", error);
    }
  },

  /**
   * Получает текущую сессию пользователя из localStorage
   * @returns Сессия пользователя или null, если сессия не найдена
   */
  getCurrentSession(): UserSession | null {
    try {
      const sessionJson = localStorage.getItem(SESSION_KEY);
      if (sessionJson) {
        return JSON.parse(sessionJson);
      }
      return null;
    } catch (error) {
      console.error("Ошибка при получении сессии:", error);
      return null;
    }
  },

  /**
   * Очищает текущую сессию пользователя
   */
  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error("Ошибка при очистке сессии:", error);
    }
  },

  /**
   * Сохраняет сообщение об ошибке для отображения на странице входа
   * @param message - Сообщение об ошибке
   */
  saveErrorMessage(message: string): void {
    sessionStorage.setItem(ERROR_MESSAGE_KEY, message);
  },

  /**
   * Получает сообщение об ошибке и удаляет его из sessionStorage
   * @returns Сообщение об ошибке или null, если сообщение не найдено
   */
  getErrorMessage(): string | null {
    const message = sessionStorage.getItem(ERROR_MESSAGE_KEY);
    if (message) {
      sessionStorage.removeItem(ERROR_MESSAGE_KEY);
      return message;
    }
    return null;
  },
};
