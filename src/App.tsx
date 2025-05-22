
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
  // Добавляем состояние для отслеживания инициализации сессии
  const [sessionChecked, setSessionChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Проверяем состояние сессии при загрузке приложения
  useEffect(() => {
    const checkSession = () => {
      try {
        const session = sessionService.getCurrentSession();
        if (session && session.isAuthenticated) {
          // Определяем начальный маршрут на основе роли
          if (session.role === "manager") {
            setInitialRoute("/dashboard");
          } else if (session.role === "employee") {
            setInitialRoute("/employee");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
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
      if (currentPath !== initialRoute && 
          currentPath === "/" || 
          currentPath === "/login") {
        navigate(initialRoute);
      }
    }
  }, [sessionChecked, initialRoute, navigate]);

  // Если сессия еще не проверена, показываем пустой div или лоадер
  if (!sessionChecked) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <>
      {/* Определяем Toaster вне маршрутов */}
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
