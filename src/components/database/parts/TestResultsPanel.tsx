
import React from "react";
import TestResultItem from "./TestResultItem";

interface TestResult {
  name: string;
  status: "success" | "error" | "pending";
  message: string;
}

interface TestResultsPanelProps {
  results: TestResult[];
}

/**
 * Компонент для отображения панели с результатами тестов
 */
const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ results }) => {
  if (!results.length) {
    return null;
  }
  
  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-medium mb-2">Результаты тестирования:</h3>
      
      {results.map((result, index) => (
        <TestResultItem
          key={index}
          name={result.name}
          status={result.status}
          message={result.message}
        />
      ))}
    </div>
  );
};

export default TestResultsPanel;
