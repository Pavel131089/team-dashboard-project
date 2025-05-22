
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import StorageDiagnostics from "@/components/dashboard/StorageDiagnostics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  
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
      toast.error("Доступ запрещен. Перенаправление на страницу входа.");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Если данные загружаются, показываем заглушку
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Заголовок с именем пользователя и кнопкой выхода */}
      <DashboardHeader 
        username={user?.name || ""} 
        onLogout={handleLogout} 
      />
      
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
