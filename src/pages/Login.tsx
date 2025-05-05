import { useState } from "react");
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";

type UserRole = "manager" | "employee";

const Login = () => {
  const [username, setUsername] = useState(""");
  const [password, setPassword] = useState(""");
  const [role, setRole] = useState<UserRole>("employee");
  const navigate = useNavigate();

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

    // Получаем список пользователей из localStorage
    const usersStr = localStorage.getItem("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    
    // Для демо-режима: если пользователей нет, разрешаем любой вход
    if (users.length === 0) {
      // Создаем первого пользователя с указанными данными
      const newUser = {
        id: Math.random().toString(36).substring(2),
        name: username,
        email: username,
        password: password,
        role: role
      };
      
      localStorage.setItem("users", JSON.stringify([newUser]));
      
      // Авторизуем пользователя
      localStorage.setItem("user", JSON.stringify({
        username,
        role,
        id: newUser.id,
        isAuthenticated: true
      }));
      
      // Перенаправляем на соответствующую страницу
      if (role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/employee");
      }
      
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать в систему, ${username}!`,
      });
      return;
    }
    
    // Найдем пользователя по имени пользователя (email)
    const user = users.find((u: any) => u.email === username);
    
    if (!user || user.password !== password) {
      toast({
        title: "Ошибка",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
      return;
    }
    
    // Проверяем соответствие роли
    if (user.role !== role) {
      toast({
        title: "Ошибка",
        description: "Указана неверная роль для данного пользователя",
        variant: "destructive",
      });
      return;
    }
    
    // Авторизуем пользователя
    localStorage.setItem("user", JSON.stringify({
      username: user.name,
      role: user.role,
      id: user.id,
      isAuthenticated: true
    }));
    
    if (role === "manager") {
      navigate("/dashboard");
    } else {
      navigate("/employee");
    }
    
    toast({
      title: "Успешный вход",
      description: `Добро пожаловать в систему, ${user.name}!`,
    });
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