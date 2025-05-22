import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Инициализируем хранилище проектов при первой загрузке
  useEffect(() => {
    try {
      initializeProjectsStorage();
      setInitialized(true);

      // Проверяем, что проекты имеют корректные даты
      const storedProjects = localStorage.getItem("projects");
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        console.log(
          "Stored projects with dates:",
          parsedProjects.map((p: any) => ({
            id: p.id,
            name: p.name,
            startDate: p.startDate,
            endDate: p.endDate,
            tasksCount: p.tasks?.length || 0,
          })),
        );
      }
    } catch (error) {
      console.error("Ошибка при инициализации хранилища:", error);
    }
  }, []);

  // Получаем данные из хука
  const {
    assignedTasks,
    availableTasks,
    projects, // Получаем проекты из хука
    user,
    isLoading,
    handleTakeTask,
    handleUpdateTaskProgress,
    handleAddTaskComment,
    handleLogout,
  } = useEmployeeData(navigate);

  // Обработка перенаправления, если нет пользователя
  useEffect(() => {
    if (!isLoading && !user) {
      setShouldRedirect(true);
    }
  }, [isLoading, user]);

  // Отдельный useEffect для навигации, чтобы избежать обновления состояния во время рендеринга
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

  // Безопасно получаем массивы задач и проектов
  const safeAssignedTasks = Array.isArray(assignedTasks) ? assignedTasks : [];
  const safeAvailableTasks = Array.isArray(availableTasks)
    ? availableTasks
    : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Отладка данных перед рендерингом
  console.log("Employee page data:", {
    projectsCount: safeProjects.length,
    projects: safeProjects.map((p) => ({
      id: p.id,
      name: p.name,
      startDate: p.startDate,
      endDate: p.endDate,
    })),
    assignedTasksCount: safeAssignedTasks.length,
    availableTasksCount: safeAvailableTasks.length,

    // Проверяем даты в доступных задачах
    availableTasks: safeAvailableTasks.slice(0, 3).map((t) => ({
      id: t.id,
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate,
      projectId: t.projectId,
      projectName: t.projectName,
      projectStartDate: t.projectStartDate,
      projectEndDate: t.projectEndDate,
    })),
  });

  return (
    <EmployeeLayout userName={user.name || ""} onLogout={handleLogout}>
      <EmployeeContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Карточка с назначенными задачами */}
          <EmployeeTasksCard
            tasks={safeAssignedTasks}
            onUpdateProgress={handleUpdateTaskProgress}
            onAddComment={handleAddTaskComment}
            projects={safeProjects}
          />

          {/* Секция с доступными задачами */}
          <AvailableTasksSection
            tasks={safeAvailableTasks}
            onTakeTask={handleTakeTask}
            projects={safeProjects}
          />
        </div>
      </EmployeeContent>
    </EmployeeLayout>
  );
};

export default Employee;
