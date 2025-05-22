
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import Icon from "@/components/ui/icon";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);

  const {
    formData,
    error: authError,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
    checkExistingSession,
    initializeDefaultUsers,
  } = useAuth();

  // Проверяем localStorage
  useEffect(() => {
    try {
      const testKey = "test-storage-login";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      setIsStorageAvailable(true);
      console.log("LocalStorage доступен");
    } catch (e) {
      console.error("LocalStorage недоступен:", e);
      setIsStorageAvailable(false);
      setError("LocalStorage недоступен. Проверьте настройки браузера.");
    }
  }, []);

  // Инициализируем данные при монтировании
  useEffect(() => {
    try {
      console.log("Инициализация данных на странице входа");
      
      // Собираем диагностическую информацию
      const info = {
        url: window.location.href,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        time: new Date().toISOString(),
      };
      setDiagnosticInfo(info);
      console.log("Диагностическая информация:", info);

      // Инициализируем пользователей, если хранилище доступно
      if (isStorageAvailable) {
        initializeDefaultUsers();
      }
    } catch (e) {
      console.error("Ошибка при инициализации данных:", e);
      setError(`Ошибка инициализации: ${(e as Error).message}`);
    }
  }, [initializeDefaultUsers, isStorageAvailable]);

  // Проверяем существующую сессию
  useEffect(() => {
    if (!isStorageAvailable) return;

    try {
      console.log("Проверка существующей сессии...");
      const sessionInfo = checkExistingSession();
      console.log("Результат проверки сессии:", sessionInfo);

      if (sessionInfo.authenticated && sessionInfo.role) {
        setIsRedirecting(true);
        const target = sessionInfo.role === "manager" ? "/dashboard" : "/employee";
        
        console.log("Перенаправление на", target);
        setTimeout(() => {
          navigate(target, { replace: true });
        }, 10);
      } else {
        console.log("Активная сессия не найдена, показываем форму входа");
      }
    } catch (error) {
      console.error("Ошибка при проверке сессии:", error);
      setError(`Ошибка проверки сессии: ${(error as Error).message}`);
    }
  }, [checkExistingSession, navigate, isStorageAvailable]);

  // Обработчик формы входа с дополнительным логированием
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Отправка формы входа", formData);
    try {
      handleSubmit(e);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      setError(`Ошибка входа: ${(error as Error).message}`);
    }
  };

  // Резервный вход для отладки (только для разработки)
  const handleDebugLogin = (role: "manager" | "employee") => {
    console.log(`Отладочный вход с ролью: ${role}`);
    try {
      const testUser = {
        id: role === "manager" ? "debug-manager" : "debug-employee",
        username: role,
        role: role,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };
      
      // Сохраняем сессию напрямую
      localStorage.setItem("user", JSON.stringify(testUser));
      
      // Перенаправляем
      const target = role === "manager" ? "/dashboard" : "/employee";
      navigate(target, { replace: true });
    } catch (error) {
      console.error("Ошибка при отладочном входе:", error);
      setError(`Ошибка отладочного входа: ${(error as Error).message}`);
    }
  };

  // Если происходит перенаправление, показываем индикатор загрузки
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
          <div className="text-gray-500">Перенаправление...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Отображение ошибок */}
          {(error || authError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>
                {error || authError}
              </AlertDescription>
            </Alert>
          )}

          {/* Сообщение о недоступности localStorage */}
          {!isStorageAvailable && (
            <Alert className="mb-4">
              <AlertTitle>Проблема с хранилищем</AlertTitle>
              <AlertDescription>
                LocalStorage недоступен, что может вызвать проблемы с работой приложения.
                Проверьте настройки приватности браузера.
              </AlertDescription>
            </Alert>
          )}

          {/* Стандартная форма входа */}
          <LoginForm
            formData={formData}
            error={null} // Ошибки отображаются через Alert выше
            onInputChange={handleInputChange}
            onRoleChange={handleRoleChange}
            onSubmit={handleFormSubmit}
          />

          {/* Режим отладки - только в dev-среде */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 border-t pt-4">
              <div className="text-sm text-gray-500 mb-2">Режим отладки:</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" 
                  onClick={() => handleDebugLogin("manager")}>
                  Вход как руководитель
                </Button>
                <Button size="sm" variant="outline" className="flex-1"
                  onClick={() => handleDebugLogin("employee")}>
                  Вход как сотрудник
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
