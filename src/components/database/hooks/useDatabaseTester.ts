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
 * Константы для тестирования
 */
const TEST_CONFIG = {
  COLLECTION_NAME: "database_tests",
  TEST_KEY: "test_connection",
};

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
   * Сбрасывает все результаты тестов
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
   * Обновляет один результат теста
   */
  const updateTestResult = (
    operation: keyof Omit<TestResults, "testData">,
    success: boolean,
    data?: any,
  ) => {
    setTestResults((prev) => ({
      ...prev,
      [operation]: success,
      ...(data && { testData: data }),
    }));
  };

  /**
   * Показывает уведомление о результате операции
   */
  const showOperationNotification = (operation: string, success: boolean) => {
    toast({
      title: success
        ? `${operation} успешна`
        : `Ошибка ${operation.toLowerCase()}`,
      description: success
        ? `Операция ${operation.toLowerCase()} успешно выполнена`
        : `Не удалось выполнить операцию ${operation.toLowerCase()}`,
      variant: success ? "default" : "destructive",
    });
  };

  /**
   * Проверяет доступность localStorage
   */
  const checkConnection = async () => {
    setIsLoading(true);

    try {
      // Тест доступности localStorage
      localStorage.setItem(TEST_CONFIG.TEST_KEY, "true");
      const testValue = localStorage.getItem(TEST_CONFIG.TEST_KEY);
      localStorage.removeItem(TEST_CONFIG.TEST_KEY);

      // Если смогли прочитать то же значение, что записали - соединение работает
      const connectionStatus = testValue === "true";
      setIsConnected(connectionStatus);

      // Показываем уведомление о результате
      toast({
        title: connectionStatus
          ? "Соединение установлено"
          : "Ошибка соединения",
        description: connectionStatus
          ? "Локальное хранилище данных доступно"
          : "Локальное хранилище данных недоступно",
        variant: connectionStatus ? "default" : "destructive",
      });

      return connectionStatus;
    } catch (error) {
      console.error("Ошибка при проверке подключения:", error);
      setIsConnected(false);

      toast({
        title: "Ошибка соединения",
        description: "Локальное хранилище данных недоступно",
        variant: "destructive",
      });

      return false;
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

    // Сбрасываем предыдущие результаты
    resetTestResults();

    try {
      // Последовательно запускаем все тесты
      const writeSuccess = await testWriteOperation(testId);
      if (!writeSuccess) return;

      const readSuccess = await testReadOperation(testId);
      if (!readSuccess) return;

      const updateSuccess = await testUpdateOperation(testId);
      if (!updateSuccess) return;

      await testDeleteOperation(testId);
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
   * Получает коллекцию тестовых данных из хранилища
   */
  const getTestCollection = (): Record<string, any> => {
    try {
      const testsStr =
        localStorage.getItem(TEST_CONFIG.COLLECTION_NAME) || "{}";
      return JSON.parse(testsStr);
    } catch (error) {
      console.error("Ошибка при получении тестовой коллекции:", error);
      return {};
    }
  };

  /**
   * Сохраняет коллекцию тестовых данных в хранилище
   */
  const saveTestCollection = (collection: Record<string, any>): boolean => {
    try {
      localStorage.setItem(
        TEST_CONFIG.COLLECTION_NAME,
        JSON.stringify(collection),
      );
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении тестовой коллекции:", error);
      return false;
    }
  };

  /**
   * Выполняет тест операции записи
   */
  const testWriteOperation = async (testId: string): Promise<boolean> => {
    try {
      // Создаем тестовые данные
      const testData = {
        message: "Test data",
        timestamp: new Date().toISOString(),
        number: Math.floor(Math.random() * 1000),
      };

      // Получаем или создаем коллекцию для тестов
      const testCollection = getTestCollection();

      // Добавляем тестовые данные
      testCollection[testId] = testData;

      // Сохраняем обновленную коллекцию
      const saveSuccess = saveTestCollection(testCollection);

      if (!saveSuccess) {
        throw new Error("Не удалось сохранить данные");
      }

      // Обновляем результат теста
      updateTestResult("write", true);
      showOperationNotification("Запись", true);

      return true;
    } catch (error) {
      console.error("Ошибка при записи данных:", error);
      updateTestResult("write", false);
      showOperationNotification("Запись", false);

      return false;
    }
  };

  /**
   * Выполняет тест операции чтения
   */
  const testReadOperation = async (testId: string): Promise<boolean> => {
    try {
      // Получаем коллекцию тестов
      const testCollection = getTestCollection();

      // Проверяем наличие тестовых данных
      if (!testCollection[testId]) {
        throw new Error("Данные не найдены");
      }

      // Обновляем результат теста с прочитанными данными
      updateTestResult("read", true, {
        id: testId,
        ...testCollection[testId],
      });

      showOperationNotification("Чтение", true);
      return true;
    } catch (error) {
      console.error("Ошибка при чтении данных:", error);
      updateTestResult("read", false);
      showOperationNotification("Чтение", false);

      return false;
    }
  };

  /**
   * Выполняет тест операции обновления
   */
  const testUpdateOperation = async (testId: string): Promise<boolean> => {
    try {
      // Получаем коллекцию тестов
      const testCollection = getTestCollection();

      // Проверяем наличие тестовых данных
      if (!testCollection[testId]) {
        throw new Error("Данные не найдены");
      }

      // Обновляем данные
      testCollection[testId] = {
        ...testCollection[testId],
        updated: true,
        updateTimestamp: new Date().toISOString(),
      };

      // Сохраняем обновленную коллекцию
      const saveSuccess = saveTestCollection(testCollection);

      if (!saveSuccess) {
        throw new Error("Не удалось обновить данные");
      }

      // Обновляем результат теста с обновленными данными
      updateTestResult("update", true, {
        id: testId,
        ...testCollection[testId],
      });

      showOperationNotification("Обновление", true);
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
      updateTestResult("update", false);
      showOperationNotification("Обновление", false);

      return false;
    }
  };

  /**
   * Выполняет тест операции удаления
   */
  const testDeleteOperation = async (testId: string): Promise<boolean> => {
    try {
      // Получаем коллекцию тестов
      const testCollection = getTestCollection();

      // Проверяем наличие тестовых данных
      if (!testCollection[testId]) {
        throw new Error("Данные не найдены");
      }

      // Удаляем данные
      delete testCollection[testId];

      // Сохраняем обновленную коллекцию
      const saveSuccess = saveTestCollection(testCollection);

      if (!saveSuccess) {
        throw new Error("Не удалось удалить данные");
      }

      // Проверяем удаление
      const updatedCollection = getTestCollection();

      if (updatedCollection[testId]) {
        throw new Error("Данные не были удалены");
      }

      // Обновляем результат теста
      updateTestResult("delete", true);
      showOperationNotification("Удаление", true);

      return true;
    } catch (error) {
      console.error("Ошибка при удалении данных:", error);
      updateTestResult("delete", false);
      showOperationNotification("Удаление", false);

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
