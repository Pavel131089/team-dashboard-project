import React, { useEffect } from "react";
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

  // Проверяем состояние сессии при загрузке приложения
  useEffect(() => {
    const checkSession = () => {
      const session = sessionService.getCurrentSession();
      if (session && session.isAuthenticated) {
        // Перенаправляем пользователя на нужную страницу в зависимости от роли
        if (session.role === "manager") {
          // Проверяем, что пользователь не уже на странице dashboard
          if (window.location.pathname !== "/dashboard") {
            navigate("/dashboard");
          }
        } else if (session.role === "employee") {
          // Проверяем, что пользователь не уже на странице employee
          if (window.location.pathname !== "/employee") {
            navigate("/employee");
          }
        }
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <>
      {/* Добавляем Toaster для уведомлений */}
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
