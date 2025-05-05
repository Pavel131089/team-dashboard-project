import { useNavigate } from "react-router-dom";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import EmployeeStatusIndicator from "@/components/employee/EmployeeStatusIndicator";
import EmployeeContent from "@/components/employee/EmployeeContent";
import authService from "@/services/authService";

/**
 * Страница сотрудника
 * Отображает задачи сотрудника и доступные задачи, которые можно взять в работу
 */
const Employee = () => {
  const navigate = useNavigate();
  
  // Функция выхода из системы с использованием сервиса авторизации
  const logout = () => {
    authService.logout();
    navigate("/login");
  };
  
  // Получаем все данные и обработчики из хука
  const {
    user,
    projects,
    userTasks,
    isLoading,
    handleTaskUpdate,
  } = useEmployeeData(navigate);

  // Отображаем индикатор загрузки или ошибку, если нет данных пользователя
  const statusIndicator = (
    <EmployeeStatusIndicator isLoading={isLoading} hasUser={!!user} />
  );
  
  // Если загружаем или нет пользователя, показываем индикатор статуса
  if (isLoading || !user) {
    return statusIndicator;
  }

  // Отображаем основной контент страницы сотрудника
  return (
    <EmployeeContent
      user={user}
      projects={projects}
      userTasks={userTasks}
      onTaskUpdate={handleTaskUpdate}
      onLogout={logout}
    />
  );
};

export default Employee;