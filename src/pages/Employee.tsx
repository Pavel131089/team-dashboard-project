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
import { toast } from "sonner";

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

  // Инициализируем хранилище при монтировании - если оно пусто, просто создаем пустой массив
  useEffect(() => {
    const initStorage = async () => {
      try {
        // Инициализируем хранилище (пустой массив, если данных нет)
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

  // Обработчик для принятия задачи с последующим уведомлением
  const handleTaskTake = useCallback(
    (taskId: string, projectId: string) => {
      console.log("Попытка взять задачу в работу:", { taskId, projectId });
      const result = handleTakeTask(taskId, projectId);

      // Выводим в консоль результат для отладки
      console.log("Результат взятия задачи:", result);

      // Отложенное уведомление для предотвращения обновления состояния во время рендеринга
      setTimeout(() => {
        if (result) {
          toast.success("Задача принята в работу");
        } else {
          toast.error("Не удалось принять задачу");
        }
      }, 0);

      return result;
    },
    [handleTakeTask],
  );

  // Обработчик для обновления прогресса с последующим уведомлением
  const handleProgressUpdate = useCallback(
    (taskId: string, projectId: string, progress: number) => {
      const result = handleUpdateTaskProgress(taskId, projectId, progress);

      // Отложенное уведомление для предотвращения обновления состояния во время рендеринга
      setTimeout(() => {
        if (result) {
          toast.success(`Прогресс обновлен: ${progress}%`);
        } else {
          toast.error("Не удалось обновить прогресс");
        }
      }, 0);

      return result;
    },
    [handleUpdateTaskProgress],
  );

  // Обработчик для добавления комментария с последующим уведомлением
  const handleCommentAdd = useCallback(
    (taskId: string, projectId: string, comment: string) => {
      console.log("Добавление комментария:", { taskId, projectId, comment });
      const result = handleAddTaskComment(taskId, projectId, comment);

      // Отложенное уведомление для предотвращения обновления состояния во время рендеринга
      setTimeout(() => {
        if (result) {
          toast.success("Комментарий добавлен");
        } else {
          toast.error("Не удалось добавить комментарий");
        }
      }, 0);

      return result;
    },
    [handleAddTaskComment],
  );

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
            tasks={assignedTasks}
            onUpdateProgress={handleProgressUpdate}
            onAddComment={handleCommentAdd}
            projects={projects}
          />

          {/* Секция с доступными задачами */}
          <AvailableTasksSection
            tasks={availableTasks}
            onTakeTask={handleTaskTake}
            projects={projects}
          />
        </div>
      </EmployeeContent>
    </EmployeeLayout>
  );
};

export default Employee;
