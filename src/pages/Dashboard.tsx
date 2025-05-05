import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { useDashboardData } from "@/hooks/useDashboardData";

/**
 * Компонент Dashboard - главная страница руководителя
 * Позволяет управлять проектами, задачами, пользователями и экспортом/импортом данных
 */
const Dashboard: React.FC = () => {
  // Состояние активной вкладки
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();
  
  // Получаем данные и обработчики из хука
  const {
    projects,
    user,
    isLoading,
    handleImportProject,
    handleUpdateProject,
    handleDeleteProject,
    handleLogout,
  } = useDashboardData(navigate);

  useEffect(() => {
    // Логируем состояние проектов для отладки
    console.log("Текущее состояние проектов:", projects);
  }, [projects]);

  // Показываем загрузку, если данные еще загружаются
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-slate-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  // Показываем ошибку, если пользователь не загружен
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-lg text-red-600 font-medium mb-2">Ошибка аутентификации</h2>
          <p className="text-slate-700 mb-4">
            Не удалось загрузить данные пользователя. Пожалуйста, войдите снова.
          </p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate('/login')}
          >
            Вернуться на страницу входа
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Шапка страницы с именем пользователя и кнопкой выхода */}
      <DashboardHeader
        username={user.username || ""}
        onLogout={handleLogout}
      />

      {/* Основное содержимое с вкладками */}
      <main className="container mx-auto px-4 py-6">
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          projects={projects}
          onImportProject={handleImportProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      </main>
    </div>
  );
};

export default Dashboard;