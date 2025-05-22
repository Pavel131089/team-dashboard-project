
import React, { ReactNode } from "react";

interface EmployeeContentProps {
  children: ReactNode;
}

/**
 * Контейнер для содержимого страницы сотрудника
 */
const EmployeeContent: React.FC<EmployeeContentProps> = ({ children }) => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Мои задачи</h1>
      {children}
    </div>
  );
};

export default EmployeeContent;
