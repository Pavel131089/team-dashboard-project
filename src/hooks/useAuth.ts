
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Типы
export type UserRole = "manager" | "employee";

export interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

interface User {
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
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const parsedUser = JSON.parse(userFromStorage);
        if (parsedUser.isAuthenticated) {
          redirectBasedOnRole(parsedUser.role);
          return true;
        }
      }
      
      // Проверяем сообщение об ошибке из sessionStorage
      const authMessage = sessionStorage.getItem('auth_message');
      if (authMessage) {
        setError(authMessage);
        sessionStorage.removeItem('auth_message');
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
    const user = findUserForLogin();
    
    if (user) {
      // Аутентификация пользователя
      authenticateUser(user);
      redirectBasedOnRole(user.role);
    } else {
      setError("Неверный логин или пароль");
    }
  };

  /**
   * Поиск пользователя по данным формы
   */
  const findUserForLogin = (): User | null => {
    // Получаем дефолтных пользователей
    const defaultUsers = getDefaultUsers();
    
    // Проверяем дефолтных пользователей
    const defaultUserMatch = defaultUsers.find(
      user => user.email === formData.username && 
              user.password === formData.password && 
              user.role === formData.role
    );
    
    if (defaultUserMatch) {
      // Проверяем наличие дефолтного пользователя в хранилище
      const storageUsers = getUsersFromStorage();
      let existingUser = storageUsers.find(u => u.email === formData.username);
      
      if (!existingUser) {
        // Создаем нового пользователя на основе дефолтного
        const newUser = createUserWithId(defaultUserMatch);
        storageUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(storageUsers));
        return newUser;
      }
      
      return existingUser;
    }
    
    // Поиск в пользователях из хранилища
    const storageUsers = getUsersFromStorage();
    const user = storageUsers.find(
      u => (u.email === formData.username || u.name === formData.username) && 
           u.password === formData.password &&
           u.role === formData.role
    );
    
    return user || null;
  };

  /**
   * Получает дефолтных пользователей для демо-доступа
   */
  const getDefaultUsers = () => [
    { name: "Менеджер", email: "manager", password: "manager123", role: "manager" as UserRole },
    { name: "Сотрудник", email: "employee", password: "employee123", role: "employee" as UserRole }
  ];

  /**
   * Создаёт пользователя с уникальным ID
   */
  const createUserWithId = (user: any): User => ({
    ...user,
    id: crypto.randomUUID()
  });

  /**
   * Получает пользователей из хранилища
   */
  const getUsersFromStorage = (): User[] => {
    try {
      const usersStr = localStorage.getItem("users");
      return usersStr ? JSON.parse(usersStr) : [];
    } catch (error) {
      console.error("Ошибка при получении пользователей:", error);
      return [];
    }
  };

  /**
   * Аутентифицирует пользователя и сохраняет сессию
   */
  const authenticateUser = (user: User) => {
    const sessionData = {
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
  };

  /**
   * Инициализирует дефолтных пользователей в системе
   */
  const initializeDefaultUsers = () => {
    try {
      const defaultUsersList = getDefaultUsers();
      const usersStr = localStorage.getItem("users");
      let users = usersStr ? JSON.parse(usersStr) : [];
      
      // Если пользователей нет, создаем дефолтных
      if (!users || users.length === 0) {
        const initialUsers = defaultUsersList.map(createUserWithId);
        localStorage.setItem("users", JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);
      // Сбрасываем данные пользователей если произошла ошибка
      const initialUsers = getDefaultUsers().map(createUserWithId);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  };

  return {
    formData,
    error,
    setError,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    checkExistingSession,
    initializeDefaultUsers
  };
}
