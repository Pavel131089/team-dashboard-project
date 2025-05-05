
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
export const UserService = {
  /**
   * Получает дефолтных пользователей для демо-доступа
   */
  getDefaultUsers(): DefaultUser[] {
    return [
      { name: "Менеджер", email: "manager", password: "manager123", role: "manager" },
      { name: "Сотрудник", email: "employee", password: "employee123", role: "employee" }
    ];
  },

  /**
   * Создает пользователя с уникальным ID
   */
  createUserWithId(user: DefaultUser): User {
    return {
      ...user,
      id: crypto.randomUUID()
    };
  },

  /**
   * Получает пользователей из хранилища
   */
  getUsersFromStorage(): User[] {
    try {
      const usersStr = localStorage.getItem("users");
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
      return [];
    }
  },

  /**
   * Сохраняет пользователей в хранилище
   */
  saveUsersToStorage(users: User[]): void {
    localStorage.setItem("users", JSON.stringify(users));
  },

  /**
   * Проверяет, существует ли пользователь с такими данными
   */
  userExists(users: User[], email: string, password: string, role: UserRole): boolean {
    return users.some(user => 
      (user.email === email || user.name === email) && 
      user.password === password && 
      user.role === role
    );
  },

  /**
   * Инициализирует дефолтных пользователей в системе
   */
  initializeDefaultUsers(): void {
    try {
      const defaultUsersList = this.getDefaultUsers();
      const usersStr = localStorage.getItem("users");
      let users = usersStr ? JSON.parse(usersStr) : [];
      
      // Если пользователей нет, создаем дефолтных
      if (!users || users.length === 0) {
        const initialUsers = defaultUsersList.map(this.createUserWithId);
        localStorage.setItem("users", JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);
      // Сбрасываем данные пользователей если произошла ошибка
      const initialUsers = this.getDefaultUsers().map(this.createUserWithId);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }
};
