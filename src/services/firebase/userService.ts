
/**
 * Сервис для работы с пользователями (имитация Firebase Firestore)
 * Использует localStorage вместо Firestore
 */

import { User, UserRole } from "@/types/index";

export const firebaseUserService = {
  /**
   * Дефолтные пользователи для демо-доступа
   */
  defaultUsers: [
    {
      id: "default-manager",
      name: "Менеджер",
      email: "manager@example.com",
      password: "manager123",
      role: "manager" as UserRole
    },
    {
      id: "default-employee",
      name: "Сотрудник",
      email: "employee@example.com",
      password: "employee123",
      role: "employee" as UserRole
    }
  ],

  /**
   * Получение пользователя по ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Поиск пользователя
      const user = users.find((u: User) => u.id === userId);
      return user || null;
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
      return null;
    }
  },

  /**
   * Получение пользователя по email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Проверяем дефолтных пользователей
      if (email === "manager" || email === "manager@example.com") {
        return this.defaultUsers[0];
      }
      
      if (email === "employee" || email === "employee@example.com") {
        return this.defaultUsers[1];
      }

      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Поиск пользователя
      const user = users.find((u: User) => u.email === email);
      return user || null;
    } catch (error) {
      console.error("Ошибка при получении пользователя по email:", error);
      return null;
    }
  },

  /**
   * Получение всех пользователей
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const usersStr = localStorage.getItem("users") || "[]";
      let users = JSON.parse(usersStr);
      
      // Добавляем дефолтных пользователей, если их нет в списке
      const managerExists = users.some((user: User) => user.email === "manager@example.com");
      const employeeExists = users.some((user: User) => user.email === "employee@example.com");
      
      if (!managerExists) {
        users.push(this.defaultUsers[0]);
      }
      
      if (!employeeExists) {
        users.push(this.defaultUsers[1]);
      }
      
      return users;
    } catch (error) {
      console.error("Ошибка при получении всех пользователей:", error);
      return this.defaultUsers; // В случае ошибки возвращаем хотя бы дефолтных пользователей
    }
  },

  /**
   * Создание нового пользователя
   */
  async createUser(user: Omit<User, "id">): Promise<User | null> {
    try {
      // Получаем существующих пользователей
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Проверяем, существует ли пользователь с таким email
      const existingUser = users.find((u: User) => u.email === user.email);
      if (existingUser) {
        console.error("Пользователь с таким email уже существует");
        return null;
      }
      
      // Создаем нового пользователя
      const newUser = {
        id: crypto.randomUUID(),
        ...user
      };
      
      // Добавляем в список
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      return newUser;
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      return null;
    }
  },

  /**
   * Обновление пользователя
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    // Не позволяем обновлять дефолтных пользователей
    if (userId === "default-manager" || userId === "default-employee") {
      console.warn("Нельзя обновлять дефолтных пользователей");
      return false;
    }
    
    try {
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Обновляем пользователя
      const updatedUsers = users.map((u: User) => {
        if (u.id === userId) {
          return { ...u, ...userData };
        }
        return u;
      });
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      return false;
    }
  },

  /**
   * Удаление пользователя
   */
  async deleteUser(userId: string): Promise<boolean> {
    // Не позволяем удалять дефолтных пользователей
    if (userId === "default-manager" || userId === "default-employee") {
      console.warn("Нельзя удалять дефолтных пользователей");
      return false;
    }
    
    try {
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Фильтруем пользователей
      const updatedUsers = users.filter((u: User) => u.id !== userId);
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return true;
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      return false;
    }
  },

  /**
   * Проверка учетных данных пользователя
   */
  async validateCredentials(email: string, password: string, role: UserRole): Promise<User | null> {
    // Проверяем дефолтных пользователей
    if ((email === "manager" || email === "manager@example.com") && 
        password === "manager123" && 
        role === "manager") {
      return this.defaultUsers[0];
    }
    
    if ((email === "employee" || email === "employee@example.com") && 
        password === "employee123" && 
        role === "employee") {
      return this.defaultUsers[1];
    }
    
    try {
      const usersStr = localStorage.getItem("users") || "[]";
      const users = JSON.parse(usersStr);
      
      // Поиск пользователя
      const user = users.find((u: User) => 
        u.email === email && u.password === password && u.role === role
      );
      
      return user || null;
    } catch (error) {
      console.error("Ошибка при проверке учетных данных:", error);
      return null;
    }
  },

  /**
   * Инициализация дефолтных пользователей
   */
  async initializeDefaultUsers(): Promise<void> {
    try {
      const usersStr = localStorage.getItem("users") || "[]";
      let users = JSON.parse(usersStr);
      
      // Проверяем наличие дефолтных пользователей
      const managerExists = users.some((user: User) => user.email === "manager@example.com");
      const employeeExists = users.some((user: User) => user.email === "employee@example.com");
      
      if (!managerExists) {
        users.push(this.defaultUsers[0]);
      }
      
      if (!employeeExists) {
        users.push(this.defaultUsers[1]);
      }
      
      localStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
      console.error("Ошибка при инициализации дефолтных пользователей:", error);
      
      // В случае ошибки пересоздаем список
      localStorage.setItem("users", JSON.stringify(this.defaultUsers));
    }
  }
};

export default firebaseUserService;
