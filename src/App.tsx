import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthGuard from "./components/auth/AuthGuard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";
import DatabaseStatus from "./pages/DatabaseStatus";
import UserImportHandler from "./components/users/UserImportHandler";

// Убедитесь, что BrowserRouter не содержит неправильный basename,
// если вы не используете подпапку для деплоя
const App = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Компонент для обработки импорта пользователей из URL */}
        <UserImportHandler />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Защищенные маршруты для руководителей */}
          <Route element={<AuthGuard requiredRole="manager" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/database-status" element={<DatabaseStatus />} />
          </Route>

          {/* Защищенные маршруты для сотрудников */}
          <Route element={<AuthGuard requiredRole="employee" />}>
            <Route path="/employee" element={<Employee />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
