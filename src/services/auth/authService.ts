import { LoginFormData } from "@/hooks/useAuth";
import { User, userService } from "./userService";
import { sessionService } from "./sessionService";
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

      // Проверяем стандартные учетные данные напрямую
      if (this.isDefaultUser(credentials)) {
        console.log("Обнаружен вход со стандартными учетными данными");

        const defaultUser = this.createDefaultUserFromCredentials(credentials);
        // Создаем сессию для стандартного пользователя
        this.createUserSession(defaultUser);

        return {
          success: true,
          user: defaultUser,
        };
      }

      // Поиск пользователя по учетным данным если это не стандартный пользователь
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
   * Проверяет, являются ли учетные данные стандартными
   */
  isDefaultUser(credentials: LoginFormData): boolean {
    const { username, password, role } = credentials;

    return (
      (username === "manager" &&
        password === "manager123" &&
        role === "manager") ||
      (username === "employee" &&
        password === "employee123" &&
        role === "employee")
    );
  },

  /**
   * Создает объект пользователя из стандартных учетных данных
   */
  createDefaultUserFromCredentials(credentials: LoginFormData): User {
    const { username, password, role } = credentials;

    return {
      id: username === "manager" ? "default-manager" : "default-employee",
      name: username === "manager" ? "Менеджер" : "Сотрудник",
      email: username,
      password: password,
      role: role,
    };
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
    if (!localStorage.getItem("projects")) {
      localStorage.setItem("projects", JSON.stringify([]));
    }

    // Выводим информацию в консоль
    console.log("Создана сессия пользователя:", sessionData);
  },
};

/**
 * Выполняет вход пользователя
 * @param credentials Учетные данные пользователя
 * @returns Результат входа
 */
export const login = (credentials: LoginCredentials): LoginResult => {
  try {
    // Получаем пользователей из localStorage
    const users = userService.getUsers();

    // Ищем пользователя по логину
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === credentials.username.toLowerCase() ||
        u.username?.toLowerCase() === credentials.username.toLowerCase(),
    );

    // Если пользователь не найден или пароль неверный, возвращаем ошибку
    if (!user) {
      return {
        success: false,
        error: "Пользователь не найден",
      };
    }

    if (user.password !== credentials.password) {
      return {
        success: false,
        error: "Неверный пароль",
      };
    }

    // Проверяем соответствие роли
    if (user.role !== credentials.role) {
      return {
        success: false,
        error: `Пользователь не имеет роли "${
          credentials.role === "manager" ? "Руководитель" : "Сотрудник"
        }"`,
      };
    }

    // Создаем объект сессии
    const session: UserSession = {
      id: user.id,
      username: user.name || user.email,
      role: user.role,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };

    // Сохраняем сессию в localStorage
    sessionService.saveSession(session);

    return {
      success: true,
      user: session,
    };
  } catch (error) {
    console.error("Ошибка при входе:", error);
    return {
      success: false,
      error: "Произошла ошибка при входе",
    };
  }
};
