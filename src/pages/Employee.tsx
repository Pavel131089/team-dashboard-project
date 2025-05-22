
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "@/components/employee/EmployeeLayout";
import EmployeeContent from "@/components/employee/EmployeeContent";
import AvailableTasksSection from "@/components/employee/AvailableTasksSection";
import EmployeeTasksCard from "@/components/employee/EmployeeTasksCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { initializeProjectsStorage } from "@/utils/storageUtils";

const Employee: React.FC = () => {
  const navigate = useNavigate();

  // Инициализируем хранилище проектов при первой загрузке
  useEffect(() => {
    initializeProjectsStorage();
  }, []);

  // Получаем данные из хука
  const {
    assignedTasks,
    availableTasks,
    user,
    isLoading,
    handleTakeTask,
    handleUpdateTaskProgress,
    handleAddTaskComment,
    handleLogout
  } = useEmployeeData(navigate);

  // Если данные загружаются, показываем заглушку
  if (isLoading) {
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

  return (
    <EmployeeLayout
      userName={user?.name || ""}
      onLogout={handleLogout}
    >
      <EmployeeContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Карточка с назначенными задачами */}
          <EmployeeTasksCard
            tasks={assignedTasks || []}
            onUpdateProgress={handleUpdateTaskProgress}
            onAddComment={handleAddTaskComment}
          />

          {/* Секция с доступными задачами */}
          <AvailableTasksSection
            tasks={availableTasks || []}
            onTakeTask={handleTakeTask}
          />
        </div>
      </EmployeeContent>
    </EmployeeLayout>
  );
};

export default Employee;
