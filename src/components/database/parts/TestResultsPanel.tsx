
import React from "react";
import TestResultItem from "./TestResultItem";

/**
 * Тип для результатов тестирования
 */
export interface TestResults {
  write: boolean | null;
  read: boolean | null;
  update: boolean | null;
  delete: boolean | null;
  testData: any | null;
}

/**
 * Props для компонента отображения результатов тестов
 */
interface TestResultsPanelProps {
  /** Результаты тестов */
  results: TestResults;
}

/**
 * Компонент для отображения панели результатов тестирования
 */
const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ results }) => {
  // Не отображаем, если нет результатов тестов
  const hasResults = results.write !== null || 
                     results.read !== null || 
                     results.update !== null || 
                     results.delete !== null;
  
  if (!hasResults) return null;

  return (
    <div className="mt-6 border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium mb-3">Результаты тестирования:</h3>
      <ul className="space-y-2">
        <TestResultItem label="Запись данных" status={results.write} />
        <TestResultItem label="Чтение данных" status={results.read} />
        <TestResultItem label="Обновление данных" status={results.update} />
        <TestResultItem label="Удаление данных" status={results.delete} />
      </ul>

      {results.testData && <TestDataDisplay data={results.testData} />}
    </div>
  );
};

/**
 * Компонент для отображения тестовых данных
 */
const TestDataDisplay: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Тестовые данные:</h4>
      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default TestResultsPanel;
