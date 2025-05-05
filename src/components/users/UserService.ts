
import { User } from "@/types/index";

/**
 * Сервис для работы с пользователями
 */
export const UserService = {
  /**
   * Получает список пользователей из localStorage
   */
  getUsers: (): User[] => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error("Ошибка при парсинге пользователей:", error);
        return [];
      }
    }
    return [];
  },

  /**
   * Сохраняет список пользователей в localStorage
   */
  saveUsers: (users: User[]): void => {
    localStorage.setItem("users", JSON.stringify(users));
  },

  /**
   * Создает нового пользователя
   */
  createUser: (newUser: Omit<User, "id">): User => {
    const user: User = {
      ...newUser,
      id: Math.random().toString(36).substring(2),
    };
    return user;
  },

  /**
   * Проверяет, существует ли пользователь с заданным email
   */
  isEmailExists: (users: User[], email: string): boolean => {
    return users.some(user => user.email === email);
  }
};
