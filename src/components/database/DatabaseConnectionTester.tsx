
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useDatabaseTester } from "./hooks/useDatabaseTester";
import ConnectionStatusAlert from "./parts/ConnectionStatusAlert";
import TestButtons from "./parts/TestButtons";
import TestResultsPanel from "./parts/TestResultsPanel";

/**
 * Компонент для тестирования подключения к локальному хранилищу
 * Позволяет проверить доступность localStorage и выполнить базовые операции
 */
const DatabaseConnectionTester: React.FC = () => {
  // Используем хук с логикой тестирования
  const {
    isConnected,
    isLoading,
    testResults,
    checkConnection,
    runDatabaseTests
  } = useDatabaseTester();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Статус подключения к хранилищу</span>
          <ConnectionStatusIndicator isConnected={isConnected} />
        </CardTitle>
        <CardDescription>
          Тестирование подключения к хранилищу данных и операций
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Оповещение о статусе подключения */}
        <ConnectionStatusAlert connectionStatus={isConnected} />

        {/* Кнопки для тестирования */}
        <TestButtons
          isLoading={isLoading}
          onCheckConnection={checkConnection}
          onRunTests={runDatabaseTests}
          isTestButtonDisabled={isConnected !== true}
        />

        {/* Отображение результатов тестов */}
        <TestResultsPanel results={testResults} />
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 text-xs text-slate-500">
        <FooterInfo isConnected={isConnected} />
      </CardFooter>
    </Card>
  );
};

/**
 * Отображает индикатор статуса подключения в заголовке
 */
const ConnectionStatusIndicator: React.FC<{ isConnected: boolean | null }> = ({ 
  isConnected 
}) => {
  if (isConnected === null) return null;
  
  const statusClasses = isConnected
    ? "bg-green-100 text-green-800 hover:bg-green-100"
    : "bg-red-100 text-red-800 hover:bg-red-100";
  
  return (
    <div
      className={`px-2 py-1 text-xs font-medium rounded-md ${statusClasses}`}
    >
      {isConnected ? "Подключено" : "Отключено"}
    </div>
  );
};

/**
 * Отображает информацию в футере карточки
 */
const FooterInfo: React.FC<{ isConnected: boolean | null }> = ({ 
  isConnected 
}) => {
  return (
    <div>
      <p>Локальное хранилище (localStorage)</p>
      <p>
        Последняя проверка:{" "}
        {isConnected !== null ? new Date().toLocaleString() : "—"}
      </p>
    </div>
  );
};

export default DatabaseConnectionTester;
