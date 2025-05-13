
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Импорт выделенных компонентов
import ConnectionStatusAlert from "./parts/ConnectionStatusAlert";
import TestButtons from "./parts/TestButtons";
import TestResultsPanel, { TestResults } from "./parts/TestResultsPanel";

/**
 * Компонент для тестирования подключения к локальному хранилищу
 */
const DatabaseConnectionTester: React.FC = () => {
  // Состояния компонента
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResults>({
    write: null,
    read: null,
    update: null,
    delete: null,
    testData: null,
  });

  // Проверка соединения при загрузке компонента
  useEffect(() => {
    checkConnection();
  }, []);

  /**
   * Проверка доступности localStorage
   */
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      // Тест доступности localStorage
      const testKey = "test_connection";
      localStorage.setItem(testKey, "true");
      const testValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      // Если смогли прочитать то же значение, что записали - соединение работает
      const isAvailable = testValue === "true";
      setConnectionStatus(isAvailable);

      toast({
        title: isAvailable ? "Соединение установлено" : "Ошибка соединения",
        description: isAvailable 
          ? "Локальное хранилище данных доступно" 
          : "Локальное хранилище данных недоступно",
        variant: isAvailable ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Ошибка при проверке подключения:", error);
      setConnectionStatus(false);
      toast({
        title: "Ошибка соединения",
        description: "Локальное хранилище данных недоступно",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Тестирование операций с хранилищем данных
   */
  const runDatabaseTests = async () => {
    setIsLoading(true);
    const testId = "test_" + Date.now().toString();
    const testCollectionName = "database_tests";

    // Сбрасываем результаты предыдущих тестов
    resetTestResults();

    try {
      // Выполнение тестов последовательно
      await runWriteTest(testCollectionName, testId);
      await runReadTest(testCollectionName, testId);
      await runUpdateTest(testCollectionName, testId);
      await runDeleteTest(testCollectionName, testId);
    } catch (error) {
      console.error("Общая ошибка при тестировании хранилища:", error);
      toast({
        title: "Ошибка тестирования",
        description: "Произошла ошибка при выполнении тестов",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Сброс результатов тестов
   */
  const resetTestResults = () => {
    setTestResults({
      write: null,
      read: null,
      update: null,
      delete: null,
      testData: null,
    });
  };

  /**
   * Тест 1: Запись данных
   */
  const runWriteTest = async (collectionName: string, testId: string) => {
    try {
      const testData = {
        message: "Test data",
        timestamp: new Date().toISOString(),
        number: Math.floor(Math.random() * 1000),
      };

      // Получаем или создаем коллекцию для тестов
      const testsStr = localStorage.getItem(collectionName) || "{}";
      const tests = JSON.parse(testsStr);

      // Добавляем тестовые данные
      tests[testId] = testData;
      localStorage.setItem(collectionName, JSON.stringify(tests));

      setTestResults((prev) => ({ ...prev, write: true }));
      toast({
        title: "Запись успешна",
        description: "Тестовые данные успешно записаны в хранилище",
      });
      return true;
    } catch (error) {
      console.error("Ошибка при записи данных:", error);
      setTestResults((prev) => ({ ...prev, write: false }));
      toast({
        title: "Ошибка записи",
        description: "Не удалось записать данные в хранилище",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Тест 2: Чтение данных
   */
  const runReadTest = async (collectionName: string, testId: string) => {
    try {
      const testsStr = localStorage.getItem(collectionName) || "{}";
      const tests = JSON.parse(testsStr);

      if (tests[testId]) {
        setTestResults((prev) => ({
          ...prev,
          read: true,
          testData: {
            id: testId,
            ...tests[testId],
          },
        }));
        toast({
          title: "Чтение успешно",
          description: "Тестовые данные успешно прочитаны из хранилища",
        });
        return true;
      } else {
        throw new Error("Данные не найдены");
      }
    } catch (error) {
      console.error("Ошибка при чтении данных:", error);
      setTestResults((prev) => ({ ...prev, read: false }));
      toast({
        title: "Ошибка чтения",
        description: "Не удалось прочитать данные из хранилища",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Тест 3: Обновление данных
   */
  const runUpdateTest = async (collectionName: string, testId: string) => {
    try {
      const testsStr = localStorage.getItem(collectionName) || "{}";
      const tests = JSON.parse(testsStr);

      if (tests[testId]) {
        // Обновляем данные
        tests[testId] = {
          ...tests[testId],
          updated: true,
          updateTimestamp: new Date().toISOString(),
        };

        localStorage.setItem(collectionName, JSON.stringify(tests));

        setTestResults((prev) => ({
          ...prev,
          update: true,
          testData: {
            id: testId,
            ...tests[testId],
          },
        }));

        toast({
          title: "Обновление успешно",
          description: "Тестовые данные успешно обновлены в хранилище",
        });
        return true;
      } else {
        throw new Error("Данные не найдены");
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      setTestResults((prev) => ({ ...prev, update: false }));
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить данные в хранилище",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Тест 4: Удаление данных
   */
  const runDeleteTest = async (collectionName: string, testId: string) => {
    try {
      const testsStr = localStorage.getItem(collectionName) || "{}";
      const tests = JSON.parse(testsStr);

      if (tests[testId]) {
        // Удаляем данные
        delete tests[testId];
        localStorage.setItem(collectionName, JSON.stringify(tests));

        // Проверяем удаление
        const updatedTestsStr = localStorage.getItem(collectionName) || "{}";
        const updatedTests = JSON.parse(updatedTestsStr);

        if (!updatedTests[testId]) {
          setTestResults((prev) => ({ ...prev, delete: true }));
          toast({
            title: "Удаление успешно",
            description: "Тестовые данные успешно удалены из хранилища",
          });
          return true;
        } else {
          throw new Error("Данные не были удалены");
        }
      } else {
        throw new Error("Данные не найдены");
      }
    } catch (error) {
      console.error("Ошибка при удалении данных:", error);
      setTestResults((prev) => ({ ...prev, delete: false }));
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить данные из хранилища",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Статус подключения к хранилищу</CardTitle>
          {connectionStatus !== null && (
            <Badge
              variant="outline"
              className={
                connectionStatus
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }
            >
              {connectionStatus ? "Подключено" : "Отключено"}
            </Badge>
          )}
        </div>
        <CardDescription>
          Тестирование подключения к хранилищу данных и операций
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Оповещения о статусе подключения */}
        <ConnectionStatusAlert connectionStatus={connectionStatus} />

        {/* Кнопки для запуска тестов */}
        <TestButtons 
          isLoading={isLoading}
          onCheckConnection={checkConnection}
          onRunTests={runDatabaseTests}
          isTestButtonDisabled={!connectionStatus}
        />

        {/* Панель результатов тестирования */}
        <TestResultsPanel results={testResults} />
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 text-xs text-slate-500">
        <div>
          <p>Локальное хранилище (localStorage)</p>
          <p>
            Последняя проверка:{" "}
            {connectionStatus !== null ? new Date().toLocaleString() : "—"}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTester;
