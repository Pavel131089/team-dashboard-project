
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LoadingIndicatorProps {
  isLoading: boolean;
  hasUser: boolean;
}

const EmployeeStatusIndicator: React.FC<LoadingIndicatorProps> = ({ 
  isLoading, 
  hasUser 
}) => {
  const navigate = useNavigate();

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

  if (!hasUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          <p className="text-red-600 font-medium mb-2">Ошибка аутентификации</p>
          <p className="text-slate-600 mb-4">
            Не удалось получить информацию о пользователе. Пожалуйста, войдите в систему снова.
          </p>
          <Button onClick={() => navigate('/login')}>
            Вернуться на страницу входа
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default EmployeeStatusIndicator;
