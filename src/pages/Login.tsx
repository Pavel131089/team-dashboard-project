
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("manager");
  const [password, setPassword] = useState("manager123");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Простая проверка - если логин/пароль правильные, создаем сессию
      if (username === "manager" && password === "manager123") {
        // Сохраняем данные пользователя
        localStorage.setItem("user", JSON.stringify({
          id: "default-manager",
          name: "Менеджер",
          username: "manager",
          role: "manager",
          isAuthenticated: true
        }));
        
        // Перенаправляем на панель управления
        navigate("/dashboard");
        return;
      }
      
      if (username === "employee" && password === "employee123") {
        // Сохраняем данные пользователя
        localStorage.setItem("user", JSON.stringify({
          id: "default-employee",
          name: "Сотрудник",
          username: "employee",
          role: "employee",
          isAuthenticated: true
        }));
        
        // Перенаправляем на страницу сотрудника
        navigate("/employee");
        return;
      }
      
      // Если учетные данные неверны
      setError("Неверное имя пользователя или пароль");
    } catch (err) {
      console.error("Ошибка при входе:", err);
      setError("Произошла ошибка при входе");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-900 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </div>
            
            <div className="pt-2 text-sm text-slate-500">
              <p>Для демо-доступа используйте:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>
                  Руководитель: <span className="font-medium">manager / manager123</span>
                </li>
                <li>
                  Сотрудник: <span className="font-medium">employee / employee123</span>
                </li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
