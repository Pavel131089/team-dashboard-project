
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

/**
 * Props для компонента с кнопками тестирования
 */
interface TestButtonsProps {
  /** Флаг загрузки/выполнения тестов */
  isLoading: boolean;
  /** Обработчик проверки подключения */
  onCheckConnection: () => void;
  /** Обработчик тестирования базы данных */
  onRunTests: () => void;
  /** Доступность кнопки запуска тестов */
  isTestButtonDisabled?: boolean;
}

/**
 * Компонент с кнопками для запуска тестов подключения
 */
const TestButtons: React.FC<TestButtonsProps> = ({
  isLoading,
  onCheckConnection,
  onRunTests,
  isTestButtonDisabled = false
}) => {
  return (
    <div className="flex gap-4 mt-4">
      <ConnectionButton 
        isLoading={isLoading} 
        onClick={onCheckConnection} 
      />
      
      <DatabaseTestButton 
        isLoading={isLoading} 
        onClick={onRunTests} 
        disabled={isTestButtonDisabled} 
      />
    </div>
  );
};

/**
 * Кнопка проверки подключения
 */
const ConnectionButton: React.FC<{ 
  isLoading: boolean; 
  onClick: () => void;
}> = ({ isLoading, onClick }) => (
  <Button
    onClick={onClick}
    disabled={isLoading}
    variant="outline"
  >
    {isLoading ? (
      <>
        <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
        Проверка...
      </>
    ) : (
      <>
        <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
        Проверить подключение
      </>
    )}
  </Button>
);

/**
 * Кнопка тестирования базы данных
 */
const DatabaseTestButton: React.FC<{ 
  isLoading: boolean; 
  onClick: () => void;
  disabled: boolean;
}> = ({ isLoading, onClick, disabled }) => (
  <Button
    onClick={onClick}
    disabled={isLoading || disabled}
  >
    {isLoading ? (
      <>
        <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
        Тестирование...
      </>
    ) : (
      <>
        <Icon name="Database" className="mr-2 h-4 w-4" />
        Тестировать базу данных
      </>
    )}
  </Button>
);

export default TestButtons;
