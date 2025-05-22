import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";
import Icon from "@/components/ui/icon";

/**
 * Страница входа в систему
 */
const Login: React.FC = () => {
  // Используем хук авторизации
  const {
    formData,
    error,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    checkExistingSession,
    initializeDefaultUsers,
  } = useAuth();

  // При монтировании компонента
  useEffect(() => {
    // Проверяем существующую сессию и инициализируем пользователей
    initializeDefaultUsers();
    checkExistingSession();
  }, [initializeDefaultUsers, checkExistingSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Icon name="FileText" className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Система управления проектами
          </CardTitle>
          <CardDescription className="text-center">
            Войдите, используя ваши учетные данные
          </CardDescription>
        </CardHeader>

        <LoginForm
          formData={formData}
          error={error}
          onInputChange={handleInputChange}
          onRoleChange={handleRoleChange}
          onSubmit={handleSubmit}
        />

        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-center text-slate-500">
            © {new Date().getFullYear()} Система управления проектами
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
