import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Защищенные маршруты для менеджера */}
      <Route
        path="/dashboard/*"
        element={
          <AuthGuard requiredRole="manager">
            <Dashboard />
          </AuthGuard>
        }
      />

      {/* Защищенные маршруты для сотрудника */}
      <Route
        path="/employee/*"
        element={
          <AuthGuard requiredRole="employee">
            <Employee />
          </AuthGuard>
        }
      />

      {/* Маршрут для страницы 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
