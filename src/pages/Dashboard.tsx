import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import StorageDiagnostics from "@/components/dashboard/StorageDiagnostics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("projects");
  const [shouldShowError, setShouldShowError] = useState(false);

  // Получаем данные и функции из хука
  const {
    projects,
    user,
    isLoading,
    handleImportProject,
    handleUpdateProject,
    handleDeleteProject,
    handleLogout,
  } = useDashboardData(navigate);

  // Проверка и восстановление данных при монтировании
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "manager")) {
      setShouldShowError(true);
    }
  }, [user, isLoading]);

  // Отдельный useEffect для показа toast и перенаправления
  useEffect(() => {
    if (shouldShowError) {
      toast.error("Доступ запрещен. Перенаправление на страницу входа.");
      navigate("/login");
    }
  }, [shouldShowError, navigate]);

  // Если данные загружаются, показываем заглушку
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  // В случае ошибки показываем сообщение
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl mb-4">Доступ запрещен</h2>
          <p className="mb-4">
            У вас нет доступа к этой странице или произошла ошибка авторизации.
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate("/login")}
          >
            Вернуться на страницу входа
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Заголовок с именем пользователя и кнопкой выхода */}
      <DashboardHeader username={user?.name || ""} onLogout={handleLogout} />

      {/* Основное содержимое */}
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Панель руководителя</h1>

        {/* Вкладки с проектами, импортом, экспортом и пользователями */}
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          projects={projects}
          onImportProject={handleImportProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      </main>

      {/* Компонент диагностики для отладки */}
      <StorageDiagnostics onReloadProjects={() => window.location.reload()} />
    </div>
  );
};

export default Dashboard;
