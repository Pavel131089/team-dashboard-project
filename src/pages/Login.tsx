
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

type UserRole = "manager" | "employee";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Проверяем активную сессию пользователя при загрузке компонента
    checkExistingSession();
  }, [navigate]);

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
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    const usersStr = localStorage.getItem("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.length === 0) {
      // Создаем первого пользователя, если пользователей ещё нет
      createFirstUser();
      return;
    }
    
    // Поиск существующего пользователя
    const user = users.find((u: any) => u.email === username);
    
    if (!user || user.password !== password) {
      toast({
        title: "Ошибка",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
      return;
    }
    
    if (user.role !== role) {
      toast({
        title: "Ошибка",
        description: "Указана неверная роль для данного пользователя",
        variant: "destructive",
      });
      return;
    }
    
    // Успешная авторизация
    saveUserSession(user);
  };

  // Создание первого пользователя
  const createFirstUser = () => {
    const newUser = {
      id: Math.random().toString(36).substring(2),
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
