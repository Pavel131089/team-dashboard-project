import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    formData,
    error,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    checkExistingSession,
  } = useAuth();

  // Проверяем существующую сессию при монтировании компонента
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionInfo = checkExistingSession();

        if (sessionInfo.authenticated && sessionInfo.role) {
          setIsRedirecting(true);
          // Определяем цель перенаправления на основе роли
          const target =
            sessionInfo.role === "manager" ? "/dashboard" : "/employee";
          // Используем setTimeout, чтобы избежать ошибок с обновлением состояния
          setTimeout(() => {
            navigate(target, { replace: true });
          }, 0);
        }
      } catch (error) {
        console.error("Ошибка при проверке сессии:", error);
      }
    };

    checkSession();
  }, [checkExistingSession, navigate]);

  // Если происходит перенаправление, показываем индикатор загрузки
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Перенаправление...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
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
