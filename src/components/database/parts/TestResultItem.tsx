
import React from "react";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface TestResultItemProps {
  name: string;
  status: "success" | "error" | "pending";
  message: string;
}

/**
 * Компонент для отображения результата отдельного теста
 */
const TestResultItem: React.FC<TestResultItemProps> = ({ 
  name, 
  status, 
  message 
}) => {
  // Определяем стили в зависимости от статуса
  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return { 
          icon: "CheckCircle", 
          iconClass: "text-green-500",
          badgeClass: "bg-green-100 text-green-800" 
        };
      case "error":
        return { 
          icon: "XCircle", 
          iconClass: "text-red-500",
          badgeClass: "bg-red-100 text-red-800" 
        };
      case "pending":
      default:
        return { 
          icon: "Clock", 
          iconClass: "text-blue-500",
          badgeClass: "bg-blue-100 text-blue-800" 
        };
    }
  };
  
  const { icon, iconClass, badgeClass } = getStatusStyles();
  
  return (
    <div className="flex items-start gap-3 p-3 border rounded-md">
      <Icon name={icon} className={`h-5 w-5 mt-0.5 ${iconClass}`} />
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium">{name}</h4>
          <Badge variant="outline" className={badgeClass}>
            {status === "success" ? "Успешно" : 
              status === "error" ? "Ошибка" : "В процессе"}
          </Badge>
        </div>
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
};

export default TestResultItem;
