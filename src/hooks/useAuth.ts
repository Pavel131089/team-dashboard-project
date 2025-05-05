
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { UserService } from "@/services/userService";
import { StorageService } from "@/services/storageService";

// Типы
export type UserRole = "manager" | "employee";

export interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Хук для управления авторизацией пользователя
 */
export function useAuth() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    role: "employee"
  });
  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Обработчик изменения полей ввода
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Обработчик изменения роли
   */
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as UserRole }));
  };

  /**
   * Перенаправляет пользователя в зависимости от роли
   */
  const redirectBasedOnRole = (userRole: UserRole) => {
    navigate(userRole === "manager" ? "/dashboard" : "/employee");
  };

  /**
   * Проверяет существующую сессию пользователя
   */
  const checkExistingSession = () => {
    try {
      const session = AuthSessionManager.getCurrentSession();
      if (session && session.isAuthenticated) {
        redirectBasedOnRole(session.role);
        return true;
      }
      
      // Проверяем сообщение об ошибке из sessionStorage
      const authMessage = AuthSessionManager.getAuthErrorMessage();
      if (authMessage) {
        setError(authMessage);
      }
      
      return false;
    } catch (error) {
      console.error("Ошибка при проверке сессии:", error);
      localStorage.removeItem('user');
      return false;
    }
  };

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Валидация формы
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    // Поиск пользователя
    const user = AuthenticationManager.findUserForLogin(formData);
    
    if (user) {
      // Аутентификация пользователя
      AuthenticationManager.authenticateUser(user);
      redirectBasedOnRole(user.role);
    } else {
      setError("Неверный логин или пароль");
    }
  };

  /**
   * Инициализирует дефолтных пользователей в системе
   */
  const initializeDefaultUsers = () => {
    UserService.initializeDefaultUsers();
  };

  /**
   * Проверяет аутентификацию пользователя
   */
  const checkUserAuth = () => {
    return AuthSessionManager.getCurrentUser();
  };

  /**
   * Выход из системы
   */
  const logout = () => {
    AuthSessionManager.logout();
    navigate("/login");
  };

  return {
    formData,
    error,
    setError,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    checkExistingSession,
    initializeDefaultUsers,
    checkUserAuth,
    logout
  };
}

/**
 * Класс для управления аутентификацией пользователей
 */
const AuthenticationManager = {
  /**
   * Находит пользователя по учетным данным
   */
  findUserForLogin(formData: LoginFormData): User | null {
    // Получаем дефолтных пользователей
    const defaultUsers = UserService.getDefaultUsers();
    
    // Проверяем дефолтных пользователей
    const defaultUserMatch = defaultUsers.find(
      user => user.email === formData.username && 
              user.password === formData.password && 
              user.role === formData.role
    );
    
    if (defaultUserMatch) {
      // Проверяем наличие дефолтного пользователя в хранилище
      const storageUsers = UserService.getUsersFromStorage();
      let existingUser = storageUsers.find(u => u.email === formData.username);
      
      if (!existingUser) {
        // Создаем нового пользователя на основе дефолтного
        const newUser = UserService.createUserWithId(defaultUserMatch);
        storageUsers.push(newUser);
        UserService.saveUsersToStorage(storageUsers);
        return newUser;
      }
      
      return existingUser;
    }
    
    // Поиск в пользователях из хранилища
    const storageUsers = UserService.getUsersFromStorage();
    const user = storageUsers.find(
      u => (u.email === formData.username || u.name === formData.username) && 
           u.password === formData.password &&
           u.role === formData.role
    );
    
    return user || null;
  },

  /**
   * Аутентифицирует пользователя и сохраняет сессию
   */
  authenticateUser(user: User): void {
    const sessionData = {
      username: user.name,
      role: user.role,
      id: user.id,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("user", JSON.stringify(sessionData));
    
    // Инициализируем хранилище проектов, если оно не существует
    StorageService.initializeStorage("projects", []);
    
    toast({
      title: "Успешный вход",
      description: `Добро пожаловать в систему, ${user.name}!`,
    });
  }
};

/**
 * Класс для управления сессией пользователя
 */
const AuthSessionManager = {
  /**
   * Получает текущую сессию
   */
  getCurrentSession() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Ошибка при парсинге сессии:", e);
      return null;
    }
  },

  /**
   * Получает текущего пользователя
   */
  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session) return null;
    
    return {
      id: session.id,
      username: session.username,
      role: session.role,
      isAuthenticated: session.isAuthenticated
    };
  },

  /**
   * Выход из системы
   */
  logout() {
    localStorage.removeItem('user');
  },

  /**
   * Получает сообщение об ошибке аутентификации
   */
  getAuthErrorMessage() {
    const message = sessionStorage.getItem('auth_message');
    if (message) {
      sessionStorage.removeItem('auth_message');
    }
    return message;
  }
};
