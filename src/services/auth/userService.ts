
import { User } from "@/types/project";

/**
 * Сервис для работы с пользователями
 * Отвечает за CRUD операции с пользователями
 */

// Ключ для хранения пользователей в localStorage
const USERS_STORAGE_KEY = "users";

export const userService = {
  /**
   * Инициализирует хранилище пользователей стандартными пользователями,
   * если они еще не созданы
   */
  initializeDefaultUsers(): void {
    try {
      // Проверяем, есть ли уже пользователи в хранилище
      const existingUsers = this.getUsersFromStorage();
      
      // Если пользователей нет или возникла ошибка при чтении, создаем стандартных пользователей
      if (!existingUsers || !Array.isArray(existingUsers) || existingUsers.length === 0) {
        const defaultUsers: User[] = [
          {
            id: "default-manager",
            name: "Менеджер",
            email: "manager",
            password: "manager123",
            role: "manager",
          },
          {
            id: "default-employee",
            name: "Сотрудник",
            email: "employee",
            password: "employee123",
            role: "employee",
          },
        ];
        
        // Сохраняем пользователей в хранилище
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
        console.log("Стандартные пользователи успешно созданы");
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);
      // В случае ошибки все равно пытаемся создать стандартных пользователей
      this.resetUsers();
    }
  },

  /**
   * Сбрасывает хранилище пользователей и создает стандартных пользователей
   */
  resetUsers(): void {
    try {
      const defaultUsers: User[] = [
        {
          id: "default-manager",
          name: "Менеджер",
          email: "manager",
          password: "manager123",
          role: "manager",
        },
        {
          id: "default-employee",
          name: "Сотрудник",
          email: "employee",
          password: "employee123",
          role: "employee",
        },
      ];
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
      console.log("Пользователи сброшены до стандартных значений");
    } catch (error) {
      console.error("Ошибка при сбросе пользователей:", error);
    }
  },

  /**
   * Получает список всех пользователей из хранилища
   * @returns Массив пользователей или пустой массив в случае ошибки
   */
  getUsersFromStorage(): User[] {
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        if (Array.isArray(users)) {
          return users;
        }
      }
      return [];
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
      return [];
    }
  },

  /**
   * Добавляет нового пользователя
   * @param user - Данные нового пользователя
   * @returns Добавленный пользователь или null в случае ошибки
   */
  addUser(user: User): User | null {
    try {
      const users = this.getUsersFromStorage();
      
      // Проверяем, что пользователь с таким email еще не существует
      const existingUser = users.find(u => u.email === user.email);
      if (existingUser) {
        console.error("Пользователь с таким email уже существует");
        return null;
      }
      
      // Добавляем нового пользователя
      users.push(user);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      return user;
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
      return null;
    }
  },

  /**
   * Получает пользователя по ID
   * @param id - ID пользователя
   * @returns Пользователь или null, если пользователь не найден
   */
  getUserById(id: string): User | null {
    try {
      const users = this.getUsersFromStorage();
      return users.find(user => user.id === id) || null;
    } catch (error) {
      console.error("Ошибка при получении пользователя по ID:", error);
      return null;
    }
  },

  /**
   * Обновляет данные пользователя
   * @param id - ID пользователя
   * @param userData - Новые данные пользователя
   * @returns Обновленный пользователь или null в случае ошибки
   */
  updateUser(id: string, userData: Partial<User>): User | null {
    try {
      const users = this.getUsersFromStorage();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        console.error("Пользователь не найден");
        return null;
      }
      
      // Обновляем данные пользователя
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      return users[userIndex];
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      return null;
    }
  },

  /**
   * Удаляет пользователя
   * @param id - ID пользователя
   * @returns true в случае успеха, false в случае ошибки
   */
  deleteUser(id: string): boolean {
    try {
      const users = this.getUsersFromStorage();
      const filteredUsers = users.filter(user => user.id !== id);
      
      if (filteredUsers.length === users.length) {
        console.error("Пользователь не найден");
        return false;
      }
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      return false;
    }
  },
};
