
import React from "react";
import { Button } from "@/components/ui/button";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ 
  children, 
  userName, 
  onLogout 
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Личный кабинет сотрудника</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {userName} (Сотрудник)
            </span>
            <Button variant="outline" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default EmployeeLayout;
