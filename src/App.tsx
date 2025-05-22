import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";
import DatabaseStatus from "./pages/DatabaseStatus";
import AuthGuard from "./components/auth/AuthGuard";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* Добавляем Toaster для уведомлений */}
      <Toaster position="top-right" closeButton />

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
