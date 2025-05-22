import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import EmployeeContent from "@/components/employee/EmployeeContent";

/**
 * Страница сотрудника
 */
const Employee: React.FC = () => {
  const navigate = useNavigate();

  // Используем хук для получения данных сотрудника
  const {
    user,
    projects,
    userTasks,
    isLoading,
    handleTaskUpdate,
    handleLogout,
  } = useEmployeeData(navigate);

  // Если данные загружаются, показываем скелетон
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Если пользователь не найден или не является сотрудником, перенаправляем на страницу входа
  if (!user) {
    // Используем setTimeout для предотвращения вызова toast во время рендеринга
    setTimeout(() => {
      toast.error("Необходимо войти в систему");
      navigate("/login");
    }, 0);

    return null;
  }

  return (
    <EmployeeContent
      user={user}
      projects={projects}
      userTasks={userTasks}
      onTaskUpdate={handleTaskUpdate}
      onLogout={handleLogout}
    />
  );
};

export default Employee;
