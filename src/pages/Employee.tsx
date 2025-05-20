
import * as React from "react";
import { Routes, Route } from "react-router-dom";

const Employee = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Панель сотрудника</h1>
      <p>Добро пожаловать в рабочую среду сотрудника!</p>
      
      <Routes>
        <Route index element={<EmployeeIndex />} />
        <Route path="tasks" element={<EmployeeTasks />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Routes>
    </div>
  );
};

// Вспомогательные компоненты для подмаршрутов
const EmployeeIndex = () => <div>Мои задачи</div>;
const EmployeeTasks = () => <div>Все задачи</div>;
const EmployeeProfile = () => <div>Мой профиль</div>;

export default Employee;
