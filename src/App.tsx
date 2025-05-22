import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";
import DatabaseStatus from "./pages/DatabaseStatus";
import AuthGuard from "./components/auth/AuthGuard";
import { Toaster } from "sonner";
import { sessionService } from "./services/auth/sessionService";

function App() {
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Перехватчик ошибок
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Глобальная ошибка приложения:", event.error);
      setError(event.error);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Проверяем состояние сессии при загрузке приложения
  useEffect(() => {
    const checkSession = () => {
      try {
        console.log("Проверка сессии...");
        const session = sessionService.getCurrentSession();
        console.log("Результат проверки сессии:", session);

        if (session && session.isAuthenticated) {
          // Определяем начальный маршрут на основе роли
          if (session.role === "manager") {
            setInitialRoute("/dashboard");
          } else if (session.role === "employee") {
            setInitialRoute("/employee");
          }
        }
      } catch (error) {
        console.error("Ошибка при проверке сессии:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  // Выполняем навигацию только после проверки сессии
  useEffect(() => {
    if (sessionChecked && initialRoute) {
      // Проверяем, что текущий путь не совпадает с целевым,
      // чтобы избежать ненужных перенаправлений
      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath === "/login") {
        navigate(initialRoute, { replace: true });
      }
    }
  }, [sessionChecked, initialRoute, navigate]);

  // Если произошла ошибка, показываем информацию об ошибке
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Ошибка загрузки приложения
          </h1>
          <p className="text-gray-700 mb-4">
            Произошла ошибка при загрузке приложения. Пожалуйста, попробуйте
            обновить страницу.
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40 mb-4">
            {error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  // Если сессия еще не проверена, показываем пустой div или лоадер
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toaster компонент для уведомлений */}
      <Toaster position="top-right" closeButton richColors />

      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Защищенные маршруты для руководителей */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard requiredRole="manager">
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/database-status"
          element={
            <AuthGuard requiredRole="manager">
              <DatabaseStatus />
            </AuthGuard>
          }
        />

        {/* Защищенные маршруты для сотрудников */}
        <Route
          path="/employee"
          element={
            <AuthGuard requiredRole="employee">
              <Employee />
            </AuthGuard>
          }
        />

        {/* Маршрут для обработки 404 ошибок */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
