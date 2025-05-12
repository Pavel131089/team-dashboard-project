import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthGuard from "./components/auth/AuthGuard";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";
import UserImportHandler from "./components/users/UserImportHandler";

// Создаем инстанс Query Client с настройками для мобильных устройств
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем повторные запросы при фокусе окна
      retry: 1, // Ограничиваем количество повторных попыток
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            </Route>

            {/* Защищенные маршруты для сотрудников */}
            <Route element={<AuthGuard requiredRole="employee" />}>
              <Route path="/employee" element={<Employee />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
