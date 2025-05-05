
import { toast } from "@/components/ui/use-toast";

export type UserRole = "manager" | "employee";

export interface UserCredentials {
  username: string;
  password: string;
  role: UserRole;
}

export interface DefaultUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface User extends DefaultUser {
  id: string;
}

export interface SessionData {
  username: string;
  role: UserRole;
  id: string;
  isAuthenticated: boolean;
  loginTime: string;
}

/**
 * Сервис авторизации для работы с пользователями
 */
const authService = {
  /**
   * Дефолтные пользователи для демо-доступа
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
   * Инициализирует хранилище с дефолтными пользователями
   */
  initializeDefaultUsers(): void {
    try {
      const defaultUsers = this.getDefaultUsers();
      const users = this.getUsersFromStorage();
      
      // Если пользователей нет, создаем дефолтных
      if (!users || users.length === 0) {
        const initialUsers = defaultUsers.map(user => this.createUserWithId(user));
        this.saveUsersToStorage(initialUsers);
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);
      
      // Если возникла ошибка, пересоздаем хранилище
      const defaultUsers = this.getDefaultUsers();
      const initialUsers = defaultUsers.map(user => this.createUserWithId(user));
      this.saveUsersToStorage(initialUsers);
    }
  },

  /**
   * Находит пользователя по учетным данным
   */
  findUserByCredentials(credentials: UserCredentials): User | null {
    const { username, password, role } = credentials;
    
    // Сначала проверяем дефолтных пользователей
    const defaultUsers = this.getDefaultUsers();
    const defaultUserMatch = defaultUsers.find(
      user => user.email === username && 
              user.password === password && 
              user.role === role
    );
    
    if (defaultUserMatch) {
      // Проверяем наличие дефолтного пользователя в хранилище
      const storageUsers = this.getUsersFromStorage();
      let existingUser = storageUsers.find(u => u.email === username);
      
      if (!existingUser) {
        // Создаем нового пользователя на основе дефолтного
        const newUser = this.createUserWithId(defaultUserMatch);
        storageUsers.push(newUser);
        this.saveUsersToStorage(storageUsers);
        return newUser;
      }
      
      return existingUser;
    }
    
    // Поиск в пользователях из хранилища
    const storageUsers = this.getUsersFromStorage();
    const user = storageUsers.find(
      u => (u.email === username || u.name === username) && 
           u.password === password &&
           u.role === role
    );
    
    return user || null;
  },

  /**
   * Аутентифицирует пользователя и сохраняет сессию
   */
  authenticateUser(user: User): void {
    const sessionData: SessionData = {
      username: user.name,
      role: user.role,
      id: user.id,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("user", JSON.stringify(sessionData));
    
    // Инициализируем хранилище проектов, если оно не существует
    if (!localStorage.getItem("projects")) {
      localStorage.setItem("projects", JSON.stringify([]));
    }
    
    toast({
      title: "Успешный вход",
      description: `Добро пожаловать в систему, ${user.name}!`,
    });
  },

  /**
   * Получает текущую сессию пользователя
   */
  getCurrentSession(): SessionData | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      return JSON.parse(userStr) as SessionData;
    } catch (error) {
      console.error("Ошибка при получении сессии:", error);
      return null;
    }
  },

  /**
   * Проверяет, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session !== null && session.isAuthenticated === true;
  },

  /**
   * Выход из системы
   */
  logout(): void {
    localStorage.removeItem('user');
  },

  /**
   * Сохраняет сообщение об ошибке аутентификации
   */
  saveAuthErrorMessage(message: string): void {
    sessionStorage.setItem('auth_message', message);
  },

  /**
   * Получает сообщение об ошибке аутентификации
   */
  getAuthErrorMessage(): string | null {
    const message = sessionStorage.getItem('auth_message');
    if (message) {
      sessionStorage.removeItem('auth_message');
    }
    return message;
  }
};

export default authService;
