import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  username,
  onLogout,
}) => {
  // Получаем отображаемое имя пользователя
  const displayName = username || "Пользователь";

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold truncate">Панель управления</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-sm text-slate-600 flex items-center">
            <Icon name="User" className="mr-1 md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">{displayName}</span>
            <span className="md:hidden">Руководитель</span>
          </span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <Icon name="LogOut" className="md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Выйти</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
