
import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface TestButtonsProps {
  isLoading: boolean;
  onCheckConnection: () => void;
  onRunTests: () => void;
  isTestButtonDisabled: boolean;
}

/**
 * Компонент с кнопками для тестирования базы данных
 */
const TestButtons: React.FC<TestButtonsProps> = ({
  isLoading,
  onCheckConnection,
  onRunTests,
  isTestButtonDisabled
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={onCheckConnection}
      >
        <Icon 
          name={isLoading ? "Loader2" : "Database"} 
          className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} 
        />
        Проверить подключение
      </Button>
      
      <Button
        onClick={onRunTests}
        disabled={isTestButtonDisabled || isLoading}
      >
        <Icon 
          name={isLoading ? "Loader2" : "Play"} 
          className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} 
        />
        Запустить тесты
      </Button>
    </div>
  );
};

export default TestButtons;
