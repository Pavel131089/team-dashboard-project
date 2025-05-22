import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import NotFound from "./pages/NotFound";
import { storageUtils } from "@/services/storageUtils";

// Компонент для отображения ошибок загрузки
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Добавляем обработчик ошибок
    const errorHandler = (error: ErrorEvent) => {
      console.error("Перехвачена ошибка:", error);
      setHasError(true);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Произошла ошибка
          </h2>
          <p className="mb-4">
            Приложение столкнулось с ошибкой при загрузке. Пожалуйста,
            попробуйте обновить страницу.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация данных при запуске приложения
  useEffect(() => {
    try {
      // Инициализируем хранилище пользователей
      storageUtils.initializeStorage("users", [
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
      ]);

      // Инициализируем хранилище проектов, если оно пустое
      if (!localStorage.getItem("projects")) {
        const demoProjects = [
          {
            id: "project-1",
            name: "Тестовый проект",
            description: "Описание тестового проекта",
            createdAt: new Date().toISOString(),
            createdBy: "default-manager",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            tasks: [
              {
                id: "task-1",
                name: "Задача 1",
                description: "Описание задачи 1",
                price: 5000,
                estimatedTime: 10,
                startDate: new Date().toISOString(),
                endDate: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                assignedTo: "",
                assignedToNames: [],
                progress: 30,
              },
            ],
          },
          {
            id: "project-2",
            name: "Разработка мобильного приложения",
            description: "Разработка мобильного приложения для iOS и Android",
            createdAt: new Date().toISOString(),
            createdBy: "default-manager",
            startDate: new Date().toISOString(),
            endDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            tasks: [
              {
                id: "task-2",
                name: "Дизайн интерфейса",
                description: "Создание дизайна мобильного приложения",
                price: 15000,
                estimatedTime: 20,
                startDate: new Date().toISOString(),
                endDate: new Date(
                  Date.now() + 10 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                assignedTo: "",
                assignedToNames: [],
                progress: 70,
              },
            ],
          },
        ];

        localStorage.setItem("projects", JSON.stringify(demoProjects));
      }
    } catch (error) {
      console.error("Ошибка при инициализации данных:", error);
    } finally {
      // Небольшая задержка для предотвращения мерцания
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, []);

  // Пока идет загрузка, показываем индикатор
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
