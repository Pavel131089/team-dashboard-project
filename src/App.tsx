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
  // Импорт пользователей из URL при первом запуске
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedUsers = params.get("users");

      if (encodedUsers) {
        const decodedUsers = JSON.parse(atob(decodeURIComponent(encodedUsers)));
        if (Array.isArray(decodedUsers) && decodedUsers.length > 0) {
          // Объединяем с существующими пользователями, избегая дубликатов
          const existingUsers = localStorage.getItem("users")
            ? JSON.parse(localStorage.getItem("users")!)
            : [];

          // Создаем Set из ID существующих пользователей
          const existingIds = new Set(
            existingUsers.map((user: any) => user.id),
          );

          // Фильтруем новых пользователей, исключая дубликаты
          const newUsers = decodedUsers.filter(
            (user: any) => !existingIds.has(user.id),
          );

          // Объединяем массивы
          const mergedUsers = [...existingUsers, ...newUsers];

          // Сохраняем в localStorage
          localStorage.setItem("users", JSON.stringify(mergedUsers));

          // Очищаем URL, чтобы избежать повторного импорта при обновлении страницы
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      }
    } catch (error) {
      console.error("Ошибка при импорте пользователей из URL:", error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
