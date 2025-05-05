
import React, { useState } from "react";
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
    handleImportProject,
    handleUpdateProject,
    handleDeleteProject,
    handleLogout,
  } = useDashboardData(navigate);

  // Показываем загрузку, если пользователь еще не загружен
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
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
