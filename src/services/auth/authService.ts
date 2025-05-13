
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
          error: "Неверное имя пользователя или пароль"
        };
      }
      
      // Создаем сессию пользователя
      this.createUserSession(user);

      // Записываем данные об успешном входе в лог
      console.log("Успешный вход:", user.name, user.role);
      
      return {
        success: true,
        user
      };
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      return {
        success: false,
        error: "Произошла ошибка при входе в систему"
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
    const storageUsers = userService.getUsersFromStorage();
    console.log("Пользователи в хранилище:", storageUsers);
    
    // Проверяем дефолтных пользователей
    const defaultUsers = userService.getDefaultUsers();
    
    // Если есть пользователи в хранилище
    if (storageUsers && storageUsers.length > 0) {
      // Ищем среди пользователей в хранилище с учетом регистра и без
      const user = storageUsers.find(
        u => ((u.email && u.email.toLowerCase() === username.toLowerCase()) || 
             (u.name && u.name.toLowerCase() === username.toLowerCase()) ||
             (username === "manager" && u.email === "manager") ||
             (username === "employee" && u.email === "employee")) && 
             u.password === password &&
             u.role === role
      );
      
      if (user) {
        console.log("Найден пользователь в хранилище:", user);
        return user;
      }
    }
    
    // Проверяем дефолтных пользователей как запасной вариант
    const defaultUser = defaultUsers.find(
      user => user.email === username && 
              user.password === password && 
              user.role === role
    );
    
    if (defaultUser) {
      console.log("Найден дефолтный пользователь:", defaultUser);
      
      // Создаем нового пользователя и добавляем в хранилище
      const newUser = userService.createUser(defaultUser);
      userService.saveUser(newUser);
      
      return newUser;
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
      loginTime: new Date().toISOString()
    };
    
    // Сохраняем сессию
    sessionService.saveSession(sessionData);
    
    // Инициализируем хранилище проектов, если оно не существует
    storageUtils.initializeStorage('projects', []);
    
    // Выводим информацию в консоль
    console.log("Создана сессия пользователя:", sessionData);
  }
};
