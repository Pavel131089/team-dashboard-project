
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

/**
 * Props для компонента статуса подключения
 */
interface ConnectionStatusAlertProps {
  /** Статус подключения (true - подключено, false - отключено, null - не проверено) */
  connectionStatus: boolean | null;
}

/**
 * Компонент для отображения статуса подключения к хранилищу
 */
const ConnectionStatusAlert: React.FC<ConnectionStatusAlertProps> = ({ 
  connectionStatus 
}) => {
  // Не отображаем, если статус не определен
  if (connectionStatus === null) return null;

  // Отображаем предупреждение при отсутствии подключения
  if (connectionStatus === false) {
    return (
      <Alert variant="destructive">
        <Icon name="AlertTriangle" className="h-4 w-4" />
        <AlertTitle>Ошибка подключения</AlertTitle>
        <AlertDescription>
          Не удалось подключиться к хранилищу данных. Проверьте настройки
          браузера и разрешения для localStorage.
        </AlertDescription>
      </Alert>
    );
  }

  // Отображаем успешное подключение
  return (
    <Alert className="bg-green-50 border-green-200">
      <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-700">
        Подключение установлено
      </AlertTitle>
      <AlertDescription className="text-green-600">
        Соединение с хранилищем успешно установлено. Вы можете выполнить
        тесты операций.
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatusAlert;
