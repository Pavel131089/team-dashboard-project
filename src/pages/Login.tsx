
import { useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

/**
 * Компонент страницы входа в систему
 * Позволяет пользователям авторизоваться с указанной ролью
 */
const Login = () => {
  // Получаем состояние и обработчики из хука авторизации
  const {
    formData,
    error,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    checkExistingSession,
    initializeDefaultUsers
  } = useAuth();
  
  // При загрузке компонента
  useEffect(() => {
    // Инициализируем дефолтных пользователей
    initializeDefaultUsers();
    
    // Проверяем текущую сессию
    checkExistingSession();
  }, []);

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
