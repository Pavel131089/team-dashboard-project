import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import { sessionService } from "./services/auth/sessionService";

// Используем lazy для отложенной загрузки компонентов
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employee = lazy(() => import("./pages/Employee"));
const DatabaseStatus = lazy(() => import("./pages/DatabaseStatus"));
const AuthGuard = lazy(() => import("./components/auth/AuthGuard"));

// Компонент-заглушка для отображения во время загрузки
const Fallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-4 text-gray-600">Загрузка...</p>
    </div>
  </div>
);

// Компонент для диагностики
const DiagnosticInfo = ({ error }: { error?: Error }) => (
  <div className="min-h-screen bg-red-50 p-4">
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-red-200">
      <h1 className="text-xl font-bold text-red-600 mb-4">
        Диагностическая информация
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
          <h2 className="font-semibold">Ошибка:</h2>
          <p className="font-mono text-sm break-all">{error.message}</p>
          <p className="font-mono text-xs mt-2 break-all">{error.stack}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Окружение:</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>URL: {window.location.href}</li>
          <li>User Agent: {navigator.userAgent}</li>
          <li>LocalStorage доступен: {String(checkLocalStorageAvailable())}</li>
          <li>Время: {new Date().toISOString()}</li>
        </ul>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Перезагрузить страницу
        </button>

        <button
          onClick={resetStorage}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
        >
          Сбросить хранилище
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  </div>
);

// Проверка доступности localStorage
function checkLocalStorageAvailable() {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Сброс хранилища
function resetStorage() {
  try {
    localStorage.clear();
    alert("Хранилище очищено. Страница будет перезагружена.");
    window.location.reload();
  } catch (e) {
    alert("Ошибка при очистке хранилища: " + (e as Error).message);
  }
}

function App() {
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Проверяем состояние сессии при загрузке приложения
  useEffect(() => {
    const checkSession = () => {
      try {
        console.log("App: проверка сессии...");
        const session = sessionService.getCurrentSession();
        console.log("App: результат проверки сессии:", session);

        if (session && session.isAuthenticated) {
          // Определяем начальный маршрут на основе роли
          if (session.role === "manager") {
            setInitialRoute("/dashboard");
          } else if (session.role === "employee") {
            setInitialRoute("/employee");
          }
        } else {
          console.log("App: активная сессия не найдена");
        }
      } catch (error) {
        console.error("App: ошибка при проверке сессии:", error);
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
      console.log("App: перенаправление на", initialRoute);
      const currentPath = window.location.pathname;
      if (currentPath === "/" || currentPath === "/login") {
        navigate(initialRoute, { replace: true });
      }
    }
  }, [sessionChecked, initialRoute, navigate]);

  // Если произошла ошибка, показываем сообщение
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-md p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Произошла ошибка
          </h2>
          <p className="text-gray-700 mb-4">
            При загрузке приложения произошла ошибка. Пожалуйста, перезагрузите
            страницу.
          </p>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto mb-4">
            {error.message}
          </pre>
          <Button onClick={() => window.location.reload()} className="w-full">
            Перезагрузить страницу
          </Button>
        </div>
      </div>
    );
  }

  // Если сессия еще не проверена, показываем пустой div или лоадер
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="h-12 w-12 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="text-gray-500">Загрузка приложения...</div>
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
