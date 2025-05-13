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

// Определяем дебаггер для localStorage
const logStorageState = () => {
  try {
    const users = localStorage.getItem("users")
      ? JSON.parse(localStorage.getItem("users")!)
      : [];

    console.log(`[App] Пользователей в хранилище: ${users.length}`);
    console.log(`[App] Все хранилище:`, localStorage);
  } catch (error) {
    console.error("[App] Ошибка при проверке хранилища:", error);
  }
};

function App() {
  // Вызываем дебаггер при каждом рендере
  React.useEffect(() => {
    logStorageState();

    // Проверяем наличие дефолтных пользователей
    const ensureDefaultUsers = () => {
      const defaultUsers = [
        {
          id: "default-manager",
          name: "Менеджер",
          email: "manager",
          password: "manager123",
          role: "manager",
        },
        {
          id: "default-employee",
          name: "Сотрудник",
          email: "employee",
          password: "employee123",
          role: "employee",
        },
      ];

      try {
        const storedUsers = localStorage.getItem("users");
        if (!storedUsers) {
          localStorage.setItem("users", JSON.stringify(defaultUsers));
          console.log("[App] Инициализированы дефолтные пользователи");
          return;
        }

        const users = JSON.parse(storedUsers);
        if (!Array.isArray(users) || users.length === 0) {
          localStorage.setItem("users", JSON.stringify(defaultUsers));
          console.log(
            "[App] Инициализированы дефолтные пользователи (пустой массив)",
          );
          return;
        }

        // Проверяем наличие дефолтных пользователей
        let hasManager = false;
        let hasEmployee = false;

        users.forEach((user) => {
          if (user.email === "manager") hasManager = true;
          if (user.email === "employee") hasEmployee = true;
        });

        if (!hasManager || !hasEmployee) {
          const updatedUsers = [...users];

          if (!hasManager) {
            updatedUsers.push(defaultUsers[0]);
          }

          if (!hasEmployee) {
            updatedUsers.push(defaultUsers[1]);
          }

          localStorage.setItem("users", JSON.stringify(updatedUsers));
          console.log("[App] Добавлены отсутствующие дефолтные пользователи");
        }
      } catch (error) {
        console.error("[App] Ошибка при проверке пользователей:", error);
        localStorage.setItem("users", JSON.stringify(defaultUsers));
      }
    };

    ensureDefaultUsers();
  }, []);

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
