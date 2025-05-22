
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

interface ConnectionStatusAlertProps {
  connectionStatus: boolean | null;
}

/**
 * Компонент для отображения уведомления о статусе подключения
 */
const ConnectionStatusAlert: React.FC<ConnectionStatusAlertProps> = ({ 
  connectionStatus 
}) => {
  if (connectionStatus === null) {
    return (
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Icon name="Loader2" className="h-4 w-4 animate-spin" />
        <AlertTitle>Проверка подключения</AlertTitle>
        <AlertDescription>
          Выполняется проверка доступности локального хранилища...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (connectionStatus === false) {
    return (
      <Alert variant="destructive">
        <Icon name="AlertTriangle" className="h-4 w-4" />
        <AlertTitle>Проблема с подключением</AlertTitle>
        <AlertDescription>
          Локальное хранилище недоступно. Возможно, браузер блокирует доступ к localStorage 
          или включен режим приватного просмотра.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <Icon name="CheckCircle" className="h-4 w-4" />
      <AlertTitle>Подключение установлено</AlertTitle>
      <AlertDescription>
        Локальное хранилище доступно и работает корректно.
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatusAlert;
