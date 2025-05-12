import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({
  children,
  userName,
  onLogout,
}) => {
  // Получаем отображаемое имя пользователя
  const displayName = userName || "Сотрудник";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold truncate">Личный кабинет</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-sm text-slate-600 flex items-center">
              <Icon name="User" className="mr-1 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">{displayName}</span>
              <span className="md:hidden">Сотрудник</span>
            </span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <Icon name="LogOut" className="md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Система управления проектами
        </div>
      </footer>
    </div>
  );
};

export default EmployeeLayout;
