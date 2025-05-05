
/**
 * Сервис для управления сессиями пользователей
 * @module storage/session
 */

import JsonStorage from './json';
import StorageCore from './core';
import STORAGE_KEYS from './keys';

/**
 * Тип для данных сессии пользователя
 */
export interface SessionData {
  id: string;
  username: string;
  role: 'manager' | 'employee';
  isAuthenticated: boolean;
  loginTime: string;
}

/**
 * Модуль для управления сессиями пользователей
 */
export const SessionStorage = {
  /**
   * Сохраняет сообщение об ошибке аутентификации
   * @param {string} message - Сообщение для сохранения
   */
  saveAuthMessage(message: string): void {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_MESSAGE, message);
  },

  /**
   * Получает и удаляет сообщение об ошибке аутентификации
   * @returns {string|null} Сообщение или null
   */
  getAuthErrorMessage(): string | null {
    const message = sessionStorage.getItem(STORAGE_KEYS.AUTH_MESSAGE);
    if (message) {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_MESSAGE);
    }
    return message;
  },

  /**
   * Сохраняет данные пользовательской сессии
   * @param {SessionData} sessionData - Данные сессии
   * @returns {boolean} Результат операции
   */
  saveUserSession(sessionData: SessionData): boolean {
    return JsonStorage.setItem(STORAGE_KEYS.SESSION, sessionData);
  },

  /**
   * Получает данные текущей сессии
   * @returns {SessionData|null} Данные сессии или null
   */
  getUserSession(): SessionData | null {
    return JsonStorage.getItem<SessionData | null>(STORAGE_KEYS.SESSION, null);
  },

  /**
   * Удаляет текущую сессию
   * @returns {boolean} Результат операции
   */
  clearUserSession(): boolean {
    return StorageCore.removeItem(STORAGE_KEYS.SESSION);
  }
};

export default SessionStorage;
