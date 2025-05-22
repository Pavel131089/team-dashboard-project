import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

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
    const sessionInfo = checkExistingSession();

    if (sessionInfo.authenticated && sessionInfo.role) {
      // Определяем цель перенаправления на основе роли
      const target =
        sessionInfo.role === "manager" ? "/dashboard" : "/employee";
      setRedirectTarget(target);
      setShouldRedirect(true);
    }
  }, [checkExistingSession]);

  // Отдельный useEffect для перенаправления
  useEffect(() => {
    if (shouldRedirect && redirectTarget) {
      navigate(redirectTarget);
    }
  }, [shouldRedirect, redirectTarget, navigate]);

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
