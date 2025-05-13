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
  USERS_STORAGE_KEY: "users",

  /**
   * Возвращает список дефолтных пользователей
   */
  getDefaultUsers(): DefaultUser[] {
    return [
      {
        name: "Менеджер",
        email: "manager",
        password: "manager123",
        role: "manager",
      },
      {
        name: "Сотрудник",
        email: "employee",
        password: "employee123",
        role: "employee",
      },
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
      id: crypto.randomUUID(),
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

      console.log("Проверка наличия дефолтных пользователей");

      // Проверяем наличие дефолтных пользователей
      let managerExists = false;
      let employeeExists = false;

      for (const user of users) {
        if (user.email === "manager" && user.password === "manager123") {
          managerExists = true;
        }
        if (user.email === "employee" && user.password === "employee123") {
          employeeExists = true;
        }
      }

      // Получаем дефолтных пользователей для добавления
      const defaultUsers = this.getDefaultUsers();
      let updatedUsers = [...users];
      let changed = false;

      // Добавляем дефолтного менеджера, если его нет
      if (!managerExists) {
        const managerUser = defaultUsers.find((u) => u.email === "manager");
        if (managerUser) {
          const newManager = this.createUser(managerUser);
          updatedUsers.push(newManager);
          changed = true;
          console.log("Добавлен дефолтный менеджер");
        }
      }

      // Добавляем дефолтного сотрудника, если его нет
      if (!employeeExists) {
        const employeeUser = defaultUsers.find((u) => u.email === "employee");
        if (employeeUser) {
          const newEmployee = this.createUser(employeeUser);
          updatedUsers.push(newEmployee);
          changed = true;
          console.log("Добавлен дефолтный сотрудник");
        }
      }

      // Сохраняем изменения, если они были
      if (changed) {
        this.saveUsersToStorage(updatedUsers);
        console.log("Дефолтные пользователи добавлены в хранилище");
      } else {
        console.log("Дефолтные пользователи уже существуют");
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);

      // В случае ошибки пересоздаем хранилище
      const defaultUsers = this.getDefaultUsers();
      const initialUsers = defaultUsers.map((user) => this.createUser(user));
      this.saveUsersToStorage(initialUsers);
      console.log("Хранилище пользователей переинициализировано");
    }
  },
};
