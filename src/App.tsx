import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";
import DatabaseStatus from "./pages/DatabaseStatus";
import AuthGuard from "./components/auth/AuthGuard";
import { Toaster } from "sonner";
import { navigationManager } from "./utils/navigationManager";

function App() {
  // Инициализируем менеджер навигации при загрузке приложения
  useEffect(() => {
    navigationManager.initialize();

    // Добавляем метаданные для корректной работы в iframe
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);

    return () => {
      navigationManager.destroy();
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <Router>
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
    </Router>
  );
}

export default App;
