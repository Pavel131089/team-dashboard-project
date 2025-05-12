
/**
 * @deprecated Этот файл сохранен для обратной совместимости.
 * Используйте модули из директории auth/ для новой разработки.
 */

import { authService as authServiceImpl } from "./auth/authService";
import { sessionService } from "./auth/sessionService";
import { userService } from "./auth/userService";

// Реэкспорт типов для обратной совместимости
export type UserRole = "manager" | "employee";

export interface UserCredentials {
  username: string;
  password: string;
  role: UserRole;
}

export interface DefaultUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface User extends DefaultUser {
  id: string;
}

export interface SessionData {
  username: string;
  role: UserRole;
  id: string;
  isAuthenticated: boolean;
  loginTime: string;
}

/**
 * Сервис авторизации для работы с пользователями
 * Использует новую реализацию из модулей auth/
 */
const authService = {
  /**
   * Вызывает login из новой реализации
   */
  login: authServiceImpl.login.bind(authServiceImpl),
  
  /**
   * Возвращает дефолтных пользователей
   */
  getDefaultUsers(): DefaultUser[] {
    return userService.getDefaultUsers();
  },

  /**
   * Создает пользователя с уникальным ID
   */
  createUserWithId(user: DefaultUser): User {
    return userService.createUser(user);
  },

  /**
   * Получает пользователей из хранилища
   */
  getUsersFromStorage(): User[] {
    return userService.getUsersFromStorage();
  },

  /**
   * Сохраняет пользователей в хранилище
   */
  saveUsersToStorage(users: User[]): void {
    userService.saveUsersToStorage(users);
  },

  /**
   * Инициализирует хранилище с дефолтными пользователями
   */
  initializeDefaultUsers(): void {
    userService.initializeDefaultUsers();
  },

  /**
   * Находит пользователя по учетным данным
   */
  findUserByCredentials(credentials: UserCredentials): User | null {
    return authServiceImpl.findUserByCredentials(credentials);
  },

  /**
   * Аутентифицирует пользователя и сохраняет сессию
   */
  authenticateUser(user: User): void {
    authServiceImpl.createUserSession(user);
  },

  /**
   * Получает текущую сессию пользователя
   */
  getCurrentSession(): SessionData | null {
    return sessionService.getCurrentSession();
  },

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    return sessionService.isAuthenticated();
  },

  /**
   * Выход из системы
   */
  logout(): void {
    sessionService.clearSession();
  },

  /**
   * Сохраняет сообщение об ошибке аутентификации
   */
  saveAuthErrorMessage(message: string): void {
    sessionService.saveErrorMessage(message);
  },

  /**
   * Получает сообщение об ошибке аутентификации
   */
  getAuthErrorMessage(): string | null {
    return sessionService.getErrorMessage();
  }
};

export default authService;
