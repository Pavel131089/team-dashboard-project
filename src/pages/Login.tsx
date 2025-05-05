
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import authService, { UserCredentials, UserRole } from "@/services/authService";

/**
 * Компонент отображения ошибки авторизации
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
 * Компонент формы входа в систему
 */
const LoginForm = ({ 
  credentials, 
  error, 
  onInputChange, 
  onRoleChange, 
  onSubmit 
}: {
  credentials: UserCredentials;
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
            value={credentials.username}
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
            value={credentials.password}
            onChange={onInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Выберите роль</Label>
          <RadioGroup
            value={credentials.role}
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
 * Основной компонент страницы входа
 */
const Login = () => {
  // Состояние учетных данных
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: "",
    password: "",
    role: "employee"
  });
  
  // Состояние для ошибок
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // При загрузке компонента
  useEffect(() => {
    // Инициализируем дефолтных пользователей
    authService.initializeDefaultUsers();
    
    // Проверяем текущую сессию
    checkExistingSession();
    
    // Проверяем наличие сообщения об ошибке
    const errorMessage = authService.getAuthErrorMessage();
    if (errorMessage) {
      setError(errorMessage);
    }
  }, []);

  /**
   * Проверяет существующую сессию пользователя
   */
  const checkExistingSession = () => {
    if (authService.isAuthenticated()) {
      const session = authService.getCurrentSession();
      if (session) {
        redirectBasedOnRole(session.role);
      }
    }
  };

  /**
   * Перенаправляет пользователя в зависимости от роли
   */
  const redirectBasedOnRole = (userRole: UserRole) => {
    navigate(userRole === "manager" ? "/dashboard" : "/employee");
  };

  /**
   * Обработчик изменения полей ввода
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Обработчик изменения роли
   */
  const handleRoleChange = (value: string) => {
    setCredentials(prev => ({ ...prev, role: value as UserRole }));
  };

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Валидация формы
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    // Поиск пользователя
    const user = authService.findUserByCredentials(credentials);
    
    if (user) {
      // Аутентификация пользователя
      authService.authenticateUser(user);
      redirectBasedOnRole(user.role);
    } else {
      setError("Неверный логин или пароль");
    }
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
          credentials={credentials}
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
