
import { LoginFormData } from "@/hooks/useAuth";
import { User, userService } from "./userService";
import { sessionService } from "./sessionService";
import { storageUtils } from "@/utils/storage";

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
    const { username, password, role } = credentials;
    
    // Проверяем сначала дефолтных пользователей
    const defaultUsers = userService.getDefaultUsers();
    const defaultUser = defaultUsers.find(
      user => user.email === username && 
              user.password === password && 
              user.role === role
    );
    
    // Если нашли совпадение среди дефолтных, проверяем наличие в хранилище
    if (defaultUser) {
      const storageUsers = userService.getUsersFromStorage();
      let existingUser = storageUsers.find(u => u.email === username);
      
      // Если пользователя еще нет в хранилище, добавляем его
      if (!existingUser) {
        existingUser = userService.createUser(defaultUser);
        userService.saveUser(existingUser);
      }
      
      return existingUser;
    }
    
    // Ищем среди пользователей в хранилище
    const storageUsers = userService.getUsersFromStorage();
    const user = storageUsers.find(
      u => (u.email === username || u.name === username) && 
           u.password === password &&
           u.role === role
    );
    
    return user || null;
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
  }
};
