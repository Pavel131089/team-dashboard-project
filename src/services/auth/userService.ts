
import { UserRole } from "@/hooks/useAuth";

export interface DefaultUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface User extends DefaultUser {
  id: string;
}

/**
 * Сервис для работы с пользователями
 */
export const userService = {
  /**
   * Ключ для хранения пользователей
   */
  USERS_STORAGE_KEY: 'users',
  
  /**
   * Возвращает список дефолтных пользователей
   */
  getDefaultUsers(): DefaultUser[] {
    return [
      { name: "Менеджер", email: "manager", password: "manager123", role: "manager" },
      { name: "Сотрудник", email: "employee", password: "employee123", role: "employee" }
    ];
  },
  
  /**
   * Создает пользователя с уникальным ID
   * 
   * @param user - Базовые данные пользователя
   * @returns Пользователь с присвоенным ID
   */
  createUser(user: DefaultUser): User {
    return {
      ...user,
      id: crypto.randomUUID()
    };
  },
  
  /**
   * Получает список пользователей из хранилища
   * 
   * @returns Массив пользователей
   */
  getUsersFromStorage(): User[] {
    try {
      const usersStr = localStorage.getItem(this.USERS_STORAGE_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
      return [];
    }
  },
  
  /**
   * Сохраняет пользователя в хранилище
   * 
   * @param user - Пользователь для сохранения
   */
  saveUser(user: User): void {
    const users = this.getUsersFromStorage();
    const updatedUsers = [...users, user];
    this.saveUsersToStorage(updatedUsers);
  },
  
  /**
   * Сохраняет список пользователей в хранилище
   * 
   * @param users - Список пользователей
   */
  saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
  },
  
  /**
   * Инициализирует дефолтных пользователей в системе
   */
  initializeDefaultUsers(): void {
    try {
      const users = this.getUsersFromStorage();
      
      // Если пользователей нет, создаем дефолтных
      if (users.length === 0) {
        const defaultUsers = this.getDefaultUsers();
        const initialUsers = defaultUsers.map(this.createUser);
        this.saveUsersToStorage(initialUsers);
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);
      
      // В случае ошибки пересоздаем хранилище
      const defaultUsers = this.getDefaultUsers();
      const initialUsers = defaultUsers.map(this.createUser);
      this.saveUsersToStorage(initialUsers);
    }
  }
};
