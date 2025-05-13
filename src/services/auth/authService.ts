import { LoginFormData } from "@/hooks/useAuth";
import { User, userService } from "./userService";
import { sessionService } from "./sessionService";
import { storageUtils } from "@/utils/storage";
import { toast } from "sonner";

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Сервис авторизации
 * Отвечает за процессы входа, проверки учетных данных
 */
export const authService = {
  /**
   * Авторизация пользователя
   *
   * @param credentials - Учетные данные для входа
   * @returns Результат авторизации
   */
  login(credentials: LoginFormData): LoginResult {
    try {
      console.log("Попытка входа:", credentials);

      // Инициализируем пользователей при каждой попытке входа
      userService.initializeDefaultUsers();

      // Поиск пользователя по учетным данным
      const user = this.findUserByCredentials(credentials);

      if (!user) {
        return {
          success: false,
          error: "Неверное имя пользователя или пароль",
        };
      }

      // Создаем сессию пользователя
      this.createUserSession(user);

      // Записываем данные об успешном входе в лог
      console.log("Успешный вход:", user.name, user.role);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      return {
        success: false,
        error: "Произошла ошибка при входе в систему",
      };
    }
  },

  /**
   * Поиск пользователя по учетным данным
   *
   * @param credentials - Учетные данные пользователя
   * @returns Найденный пользователь или null
   */
  findUserByCredentials(credentials: LoginFormData): User | null {
    console.log("Поиск пользователя по учетным данным:", credentials);

    const { username, password, role } = credentials;

    // Получаем всех пользователей из хранилища
    const users = userService.getUsersFromStorage();
    console.log("Пользователи в хранилище:", users.length);

    // Проверка на случай, если хранилище повреждено
    if (!Array.isArray(users)) {
      console.warn("Хранилище пользователей повреждено, инициализируем заново");
      userService.initializeDefaultUsers();
      const defaultUsers = userService.getDefaultUsers();

      // Проверяем дефолтные учетные данные
      for (const user of defaultUsers) {
        if (
          user.email === username &&
          user.password === password &&
          user.role === role
        ) {
          const newUser = userService.createUser(user);
          return newUser;
        }
      }
      return null;
    }

    // Ищем пользователя по email/имени, паролю и роли
    for (const user of users) {
      const emailMatch =
        user.email && user.email.toLowerCase() === username.toLowerCase();
      const nameMatch =
        user.name && user.name.toLowerCase() === username.toLowerCase();

      if (
        (emailMatch || nameMatch) &&
        user.password === password &&
        user.role === role
      ) {
        console.log("Найден пользователь:", user.name);
        return user;
      }
    }

    // Проверяем стандартные учетные данные менеджера и сотрудника
    if (
      (username === "manager" || username === "employee") &&
      ((username === "manager" &&
        password === "manager123" &&
        role === "manager") ||
        (username === "employee" &&
          password === "employee123" &&
          role === "employee"))
    ) {
      console.log("Используются стандартные учетные данные:", username);

      // Создаем стандартного пользователя
      const defaultUser = {
        id: username === "manager" ? "default-manager" : "default-employee",
        name: username === "manager" ? "Менеджер" : "Сотрудник",
        email: username,
        password: password,
        role: role,
      };

      // Проверяем, существует ли уже такой пользователь в хранилище
      const existingUser = users.find((u) => u.id === defaultUser.id);
      if (existingUser) {
        return existingUser;
      }

      // Добавляем пользователя в хранилище
      users.push(defaultUser);
      userService.saveUsersToStorage(users);

      return defaultUser;
    }

    console.log("Пользователь не найден");
    return null;
  },

  /**
   * Создание сессии пользователя
   *
   * @param user - Пользователь для создания сессии
   */
  createUserSession(user: User): void {
    // Создаем объект сессии
    const sessionData = {
      id: user.id,
      username: user.name,
      role: user.role,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };

    // Сохраняем сессию
    sessionService.saveSession(sessionData);

    // Инициализируем хранилище проектов, если оно не существует
    storageUtils.initializeStorage("projects", []);

    // Выводим информацию в консоль
    console.log("Создана сессия пользователя:", sessionData);
  },
};
