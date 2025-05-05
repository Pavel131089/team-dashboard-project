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

type UserRole = "manager" | "employee";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [error, setError] = useState<string | null>(null);
  const [defaultUsers, setDefaultUsers] = useState<Array<{name: string, email: string, password: string, role: UserRole}>>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Проверяем активную сессию пользователя при загрузке компонента
    checkExistingSession();
    
    // Создаем дефолтных пользователей для демо-доступа
    initializeDefaultUsers();
  }, []);

  // Функция для инициализации дефолтных пользователей
  const initializeDefaultUsers = () => {
    const defaultUsersList = [
      { name: "Менеджер", email: "manager", password: "manager123", role: "manager" as UserRole },
      { name: "Сотрудник", email: "employee", password: "employee123", role: "employee" as UserRole }
    ];
    
    setDefaultUsers(defaultUsersList);
    
    // Проверяем существующих пользователей в системе
    const usersStr = localStorage.getItem("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    
    // Если пользователей нет, создаем дефолтных
    if (!users || users.length === 0) {
      const initialUsers = defaultUsersList.map(user => ({
        id: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      }));
      
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  };

  // Функция для проверки существующей сессии
  const checkExistingSession = () => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        if (parsedUser.isAuthenticated) {
          // Перенаправляем пользователя в зависимости от его роли
          redirectBasedOnRole(parsedUser.role);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        // Если возникне ошибка, удаляем повреждённые данные
        localStorage.removeItem('user');
      }
    }
    
    // Проверяем сообщение об ошибке из sessionStorage (если было перенаправление)
    const authMessage = sessionStorage.getItem('auth_message');
    if (authMessage) {
      setError(authMessage);
      sessionStorage.removeItem('auth_message');
    }
  };

  // Функция перенаправления в зависимости от роли
  const redirectBasedOnRole = (userRole: string) => {
    if (userRole === "manager") {
      navigate("/dashboard");
    } else {
      navigate("/employee");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    // Проверяем, есть ли пользователь среди дефолтных
    const isDefaultUser = defaultUsers.some(
      user => user.email === username && user.password === password && user.role === role
    );
    
    // Если это дефолтный пользователь, создаём его в localStorage если нужно
    if (isDefaultUser) {
      const defaultUser = defaultUsers.find(
        user => user.email === username && user.password === password
      );
      
      const usersStr = localStorage.getItem("users");
      let users = usersStr ? JSON.parse(usersStr) : [];
      
      // Проверяем, существует ли такой пользователь в списке
      const existingUser = users.find((u: any) => u.email === username);
      
      if (!existingUser) {
        // Добавляем дефолтного пользователя в список
        const newUser = {
          id: crypto.randomUUID(),
          name: defaultUser?.name || username,
          email: username,
          password: password,
          role: role
        };
        
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        
        // Успешная авторизация
        saveUserSession(newUser);
        return;
      }
    }
    
    // Проверяем пользователей в localStorage
    const usersStr = localStorage.getItem("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    
    // Поиск существующего пользователя
    const user = users.find((u: any) => u.email === username || u.name === username);
    
    if (!user || user.password !== password) {
      setError("Неверный логин или пароль");
      return;
    }
    
    if (user.role !== role) {
      setError(`Указана неверная роль для пользователя ${user.name}`);
      return;
    }
    
    // Успешная авторизация
    saveUserSession(user);
  };

  // Создание первого пользователя
  const createFirstUser = () => {
    const newUser = {
      id: crypto.randomUUID(),
      name: username,
      email: username,
      password: password,
      role: role
    };
    
    localStorage.setItem("users", JSON.stringify([newUser]));
    
    if (!localStorage.getItem("projects")) {
      localStorage.setItem("projects", JSON.stringify([]));
    }
    
    saveUserSession(newUser);
  };

  // Сохранение данных сессии пользователя
  const saveUserSession = (user: any) => {
    const sessionData = {
      username: user.name,
      role: user.role,
      id: user.id,
      isAuthenticated: true,
      // Добавляем время входа для отслеживания сессии
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem("user", JSON.stringify(sessionData));
    
    toast({
      title: "Успешный вход",
      description: `Добро пожаловать в систему, ${user.name}!`,
    });
    
    // Перенаправляем пользователя в зависимости от его роли
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
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <Icon name="AlertTriangle" className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                placeholder="Введите имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Выберите роль</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
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
            
            <div className="pt-2 text-sm text-slate-500">
              <p>Для демо-доступа используйте:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Руководитель: <span className="font-medium">manager / manager123</span></li>
                <li>Сотрудник: <span className="font-medium">employee / employee123</span></li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Войти</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;