
import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Типы возможных результатов тестов
 */
export type TestResultStatus = boolean | null;

/**
 * Props для компонента отображения результата теста
 */
interface TestResultItemProps {
  /** Название теста */
  label: string;
  /** Статус выполнения теста */
  status: TestResultStatus;
}

/**
 * Компонент для отображения результата отдельного теста
 */
const TestResultItem: React.FC<TestResultItemProps> = ({ label, status }) => {
  return (
    <li className="flex justify-between">
      <span>{label}:</span>
      <StatusBadge status={status} />
    </li>
  );
};

/**
 * Компонент для отображения статуса теста в виде бейджа
 */
export const StatusBadge: React.FC<{ status: TestResultStatus }> = ({ status }) => {
  if (status === null) return <Badge variant="outline">Не проверено</Badge>;
  
  return status ? (
    <Badge
      variant="outline"
      className="bg-green-100 text-green-800 hover:bg-green-100"
    >
      Успешно
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-red-100 text-red-800 hover:bg-red-100"
    >
      Ошибка
    </Badge>
  );
};

export default TestResultItem;
