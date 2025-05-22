import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmployeeLayout from "@/components/employee/EmployeeLayout";
import EmployeeContent from "@/components/employee/EmployeeContent";
import AvailableTasksSection from "@/components/employee/AvailableTasksSection";
import EmployeeTasksCard from "@/components/employee/EmployeeTasksCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { initializeProjectsStorage } from "@/utils/storageUtils";

const Employee: React.FC = () => {
  // Важно! Все хуки должны быть на верхнем уровне компонента
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Получаем данные из хука - всегда вызываем в том же порядке
  const {
    assignedTasks,
    availableTasks,
    projects,
    user,
    isLoading,
    handleTakeTask,
    handleUpdateTaskProgress,
    handleAddTaskComment,
    handleLogout,
  } = useEmployeeData(navigate);

  // Безопасно получаем массивы - используем useMemo
  const safeData = useMemo(() => {
    return {
      assignedTasks: Array.isArray(assignedTasks) ? assignedTasks : [],
      availableTasks: Array.isArray(availableTasks) ? availableTasks : [],
      projects: Array.isArray(projects) ? projects : [],
    };
  }, [assignedTasks, availableTasks, projects]);

  // Инициализируем хранилище проектов при первой загрузке - без условий
  useEffect(() => {
    const initStorage = async () => {
      try {
        await initializeProjectsStorage();
        setInitialized(true);
      } catch (error) {
        console.error("Ошибка при инициализации хранилища:", error);
        setInitialized(true); // Все равно устанавливаем true, чтобы не блокировать UI
      }
    };

    initStorage();
  }, []);

  // Обработка перенаправления - без условий
  useEffect(() => {
    if (!isLoading && !user) {
      setShouldRedirect(true);
    }
  }, [isLoading, user]);

  // Отдельный useEffect для навигации - без условий
  useEffect(() => {
    if (shouldRedirect) {
      navigate("/login");
    }
  }, [shouldRedirect, navigate]);

  // Если данные загружаются или хранилище еще не инициализировано, показываем заглушку
  if (isLoading || !initialized) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Проверяем, что у нас есть пользователь перед рендерингом основного контента
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl">Ошибка авторизации</h2>
          <p className="mt-2">Пожалуйста, войдите в систему</p>
          <Button className="mt-4" onClick={() => navigate("/login")}>
            Перейти на страницу входа
          </Button>
        </div>
      </div>
    );
  }

  // Рендерим основной контент только если все проверки пройдены
  return (
    <EmployeeLayout userName={user.name || ""} onLogout={handleLogout}>
      <EmployeeContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Карточка с назначенными задачами */}
          <EmployeeTasksCard
            tasks={safeData.assignedTasks}
            onUpdateProgress={handleUpdateTaskProgress}
            onAddComment={handleAddTaskComment}
            projects={safeData.projects}
          />

          {/* Секция с доступными задачами */}
          <AvailableTasksSection
            tasks={safeData.availableTasks}
            onTakeTask={handleTakeTask}
            projects={safeData.projects}
          />
        </div>
      </EmployeeContent>
    </EmployeeLayout>
  );
};

export default Employee;
