
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

/**
 * Интерфейс для результатов тестирования
 */
export interface TestResults {
  write: boolean | null;
  read: boolean | null;
  update: boolean | null;
  delete: boolean | null;
  testData: any | null;
}

/**
 * Хук для логики тестирования подключения к базе данных
 * @returns Объект с состоянием и методами для тестирования хранилища
 */
export function useDatabaseTester() {
  // Состояние подключения (true - подключено, false - отключено, null - не проверено)
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // Состояние загрузки во время операций
  const [isLoading, setIsLoading] = useState(false);
  
  // Результаты тестирования
  const [testResults, setTestResults] = useState<TestResults>({
    write: null,
    read: null,
    update: null,
    delete: null,
    testData: null,
  });

  /**
   * Проверяет доступность localStorage
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
      const connectionStatus = testValue === "true";
      setIsConnected(connectionStatus);

      if (connectionStatus) {
        toast({
          title: "Соединение установлено",
          description: "Локальное хранилище данных доступно",
        });
      } else {
        toast({
          title: "Ошибка соединения",
          description: "Локальное хранилище данных недоступно",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при проверке подключения:", error);
      setIsConnected(false);
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
   * Запускает серию тестов операций с хранилищем
   */
  const runDatabaseTests = async () => {
    if (isConnected !== true) {
      toast({
        title: "Невозможно выполнить тесты",
        description: "Сначала проверьте подключение к хранилищу",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Уникальный идентификатор для текущего теста
    const testId = "test_" + Date.now().toString();
    const testCollectionName = "database_tests";

    // Сбрасываем предыдущие результаты
    setTestResults({
      write: null,
      read: null,
      update: null,
      delete: null,
      testData: null,
    });

    try {
      // Последовательно запускаем все тесты
      await testWriteOperation(testId, testCollectionName);
      await testReadOperation(testId, testCollectionName);
      await testUpdateOperation(testId, testCollectionName);
      await testDeleteOperation(testId, testCollectionName);
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
   * Выполняет тест операции записи
   */
  const testWriteOperation = async (testId: string, testCollectionName: string) => {
    try {
      const testData = {
        message: "Test data",
        timestamp: new Date().toISOString(),
        number: Math.floor(Math.random() * 1000),
      };

      // Получаем или создаем коллекцию для тестов
      const testsStr = localStorage.getItem(testCollectionName) || "{}";
      const tests = JSON.parse(testsStr);

      // Добавляем тестовые данные
      tests[testId] = testData;
      localStorage.setItem(testCollectionName, JSON.stringify(tests));

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
   * Выполняет тест операции чтения
   */
  const testReadOperation = async (testId: string, testCollectionName: string) => {
    try {
      const testsStr = localStorage.getItem(testCollectionName) || "{}";
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
   * Выполняет тест операции обновления
   */
  const testUpdateOperation = async (testId: string, testCollectionName: string) => {
    try {
      const testsStr = localStorage.getItem(testCollectionName) || "{}";
      const tests = JSON.parse(testsStr);

      if (tests[testId]) {
        // Обновляем данные
        tests[testId] = {
          ...tests[testId],
          updated: true,
          updateTimestamp: new Date().toISOString(),
        };

        localStorage.setItem(testCollectionName, JSON.stringify(tests));

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
   * Выполняет тест операции удаления
   */
  const testDeleteOperation = async (testId: string, testCollectionName: string) => {
    try {
      const testsStr = localStorage.getItem(testCollectionName) || "{}";
      const tests = JSON.parse(testsStr);

      if (tests[testId]) {
        // Удаляем данные
        delete tests[testId];
        localStorage.setItem(testCollectionName, JSON.stringify(tests));

        // Проверяем удаление
        const updatedTestsStr =
          localStorage.getItem(testCollectionName) || "{}";
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

  return {
    isConnected,
    isLoading,
    testResults,
    checkConnection,
    runDatabaseTests,
  };
}
