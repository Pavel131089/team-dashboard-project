
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

// Типы
type UserRole = "manager" | "employee";

interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

interface DefaultUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface User extends DefaultUser {
  id: string;
}

/**
 * Компонент формы входа в систему
 */
const LoginForm = ({ 
  formData, 
  error, 
  onInputChange, 
  onRoleChange, 
  onSubmit 
}: {
  formData: LoginFormData;
  error: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        {error && <LoginError message={error} />}
        
        <div className="space-y-2">
          <Label htmlFor="username">Имя пользователя</Label>
          <Input
            id="username"
            name="username"
            placeholder="Введите имя пользователя"
            value={formData.username}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Введите пароль"
            value={formData.password}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Выберите роль</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={onRoleChange}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manager" id="manager" />
              <Label htmlFor="manager">Руководитель</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="employee" id="employee" />
              <Label htmlFor="employee">Сотрудник</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DemoCredentials />
      </CardContent>
      
      <CardFooter>
        <Button type="submit" className="w-full">Войти</Button>
      </CardFooter>
    </form>
  );
};

/**
 * Компонент отображения ошибки
 */
const LoginError = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive">
      <Icon name="AlertTriangle" className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

/**
 * Компонент с демонстрационными учетными данными
 */
const DemoCredentials = () => {
  return (
    <div className="pt-2 text-sm text-slate-500">
      <p>Для демо-доступа используйте:</p>
      <ul className="list-disc pl-5 mt-1 space-y-1">
        <li>Руководитель: <span className="font-medium">manager / manager123</span></li>
        <li>Сотрудник: <span className="font-medium">employee / employee123</span></li>
      </ul>
    </div>
  );
};

/**
 * Основной компонент страницы входа
 */
const Login = () => {
  // Состояние формы входа
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    role: "employee"
  });
  
  // Состояние для ошибок и дефолтных пользователей
  const [error, setError] = useState<string | null>(null);
  const [defaultUsers, setDefaultUsers] = useState<DefaultUser[]>([]);
  
  const navigate = useNavigate();
  
  // При загрузке компонента
  useEffect(() => {
    checkExistingSession();
    initializeDefaultUsers();
  }, []);

  /**
   * Инициализирует список дефолтных пользователей
   */
  const initializeDefaultUsers = () => {
    const defaultUsersList: DefaultUser[] = [
      { name: "Менеджер", email: "manager", password: "manager123", role: "manager" },
      { name: "Сотрудник", email: "employee", password: "employee123", role: "employee" }
    ];
    
    setDefaultUsers(defaultUsersList);
    ensureDefaultUsersExist(defaultUsersList);
  };

  /**
   * Гарантирует наличие дефолтных пользователей в хранилище
   */
  const ensureDefaultUsersExist = (defaultUsersList: DefaultUser[]) => {
    try {
      const usersStr = localStorage.getItem("users");
      let users: User[] = usersStr ? JSON.parse(usersStr) : [];
      
      // Если пользователей нет, создаем дефолтных
      if (!users || users.length === 0) {
        const initialUsers = defaultUsersList.map(createUserWithId);
        localStorage.setItem("users", JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Ошибка при инициализации пользователей:", error);
      // Сбрасываем данные пользователей если произошла ошибка
      const initialUsers = defaultUsersList.map(createUserWithId);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  };

  /**
   * Создаёт пользователя с уникальным ID
   */
  const createUserWithId = (user: DefaultUser): User => ({
    ...user,
    id: crypto.randomUUID()
  });

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
        }
      }
      
      // Проверяем сообщение об ошибке из sessionStorage
      const authMessage = sessionStorage.getItem('auth_message');
      if (authMessage) {
        setError(authMessage);
        sessionStorage.removeItem('auth_message');
      }
    } catch (error) {
      console.error("Ошибка при проверке сессии:", error);
      localStorage.removeItem('user');
    }
  };

  /**
   * Перенаправляет пользователя в зависимости от роли
   */
  const redirectBasedOnRole = (userRole: string) => {
    navigate(userRole === "manager" ? "/dashboard" : "/employee");
  };

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

    // Проверка авторизации
    const user = findUserForLogin();
    
    if (user) {
      authenticateUser(user);
    } else {
      setError("Неверный логин или пароль");
    }
  };

  /**
   * Поиск пользователя по данным формы
   */
  const findUserForLogin = (): User | null => {
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
    
    redirectBasedOnRole(user.role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
          <CardDescription>
            Войдите для доступа к управлению проектами
          </CardDescription>
        </CardHeader>
        
        <LoginForm 
          formData={formData}
          error={error}
          onInputChange={handleInputChange}
          onRoleChange={handleRoleChange}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
};

export default Login;
