import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const { authenticated, role } = checkExistingSession();

    if (authenticated && role) {
      // Определяем цель перенаправления на основе роли
      const target = role === "manager" ? "/dashboard" : "/employee";
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
      <LoginForm
        formData={formData}
        error={error}
        handleInputChange={handleInputChange}
        handleRoleChange={handleRoleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Login;
