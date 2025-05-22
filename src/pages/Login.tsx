import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

/**
 * Компонент для отображения ошибки
 */
const LoginError = ({ message }: { message: string }) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <Icon name="AlertTriangle" className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

/**
 * Компонент для демонстрационных учетных данных
 */
const DemoCredentials = () => {
  return (
    <div className="pt-2 text-sm text-slate-500">
      <p>Для демо-доступа используйте:</p>
      <ul className="list-disc pl-5 mt-1 space-y-1">
        <li>
          Руководитель:{" "}
          <span className="font-medium">manager / manager123</span>
        </li>
        <li>
          Сотрудник: <span className="font-medium">employee / employee123</span>
        </li>
      </ul>
    </div>
  );
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("manager");
  const [password, setPassword] = useState("manager123");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем при загрузке, авторизован ли пользователь
  useEffect(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user && user.isAuthenticated) {
          const route = user.role === "manager" ? "/dashboard" : "/employee";
          navigate(route);
        }
      }
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      // Если произошла ошибка, не перенаправляем пользователя и показываем страницу входа
    }
  }, [navigate]);

  // Обработчик входа - упрощенная версия для повышения надежности
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Простая проверка учетных данных для демо
      const isValidLogin =
        (username === "manager" &&
          password === "manager123" &&
          role === "manager") ||
        (username === "employee" &&
          password === "employee123" &&
          role === "employee");

      if (isValidLogin) {
        // Создаем объект пользователя
        const user = {
          id: role === "manager" ? "default-manager" : "default-employee",
          name: role === "manager" ? "Менеджер" : "Сотрудник",
          username: username,
          role: role,
          isAuthenticated: true,
        };

        // Сохраняем в localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Используем setTimeout для предотвращения обновления состояния во время рендеринга
        setTimeout(() => {
          toast.success(`Добро пожаловать, ${user.name}!`);
          // Перенаправляем на нужную страницу
          navigate(role === "manager" ? "/dashboard" : "/employee");
        }, 0);
      } else {
        setError("Неверное имя пользователя или пароль");
      }
    } catch (err) {
      console.error("Ошибка при входе:", err);
      setError("Произошла ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">
            Система управления проектами
          </CardTitle>
          <p className="text-muted-foreground">
            Добро пожаловать в систему управления проектами!
          </p>
        </CardHeader>

        <CardContent>
          {error && <LoginError message={error} />}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
                disabled={isLoading}
                autoComplete="username"
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
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <Label>Роль</Label>
              <RadioGroup
                value={role}
                onValueChange={setRole}
                className="flex space-x-4"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manager" id="role-manager" />
                  <Label htmlFor="role-manager" className="cursor-pointer">
                    Руководитель
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employee" id="role-employee" />
                  <Label htmlFor="role-employee" className="cursor-pointer">
                    Сотрудник
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти в систему"
              )}
            </Button>

            <DemoCredentials />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
