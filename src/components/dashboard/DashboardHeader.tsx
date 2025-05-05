
import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  username: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Панель управления проектами</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {username} (Руководитель)
          </span>
          <Button variant="outline" onClick={onLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
