
import * as React from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Панель руководителя</h1>
      <p>Добро пожаловать в панель управления!</p>
      
      <Routes>
        <Route index element={<DashboardIndex />} />
        <Route path="projects" element={<DashboardProjects />} />
        <Route path="users" element={<DashboardUsers />} />
      </Routes>
    </div>
  );
};

// Вспомогательные компоненты для подмаршрутов
const DashboardIndex = () => <div>Основная информация</div>;
const DashboardProjects = () => <div>Управление проектами</div>;
const DashboardUsers = () => <div>Управление пользователями</div>;

export default Dashboard;
