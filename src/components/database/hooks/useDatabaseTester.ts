
import { useState, useCallback } from "react";

/**
 * Интерфейс для результатов тестирования базы данных
 */
interface TestResult {
  name: string;
  status: "success" | "error" | "pending";
  message: string;
}

/**
 * Хук для тестирования подключения к базе данных
 */
export function useDatabaseTester() {
  // Состояние подключения: null - неизвестно, true - подключено, false - отключено
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // Состояние загрузки при выполнении операций
  const [isLoading, setIsLoading] = useState(false);
  
  // Результаты тестов
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  /**
   * Проверка подключения к хранилищу данных
   */
  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Проверяем доступность localStorage
      const testKey = "test_connection_" + Date.now();
      localStorage.setItem(testKey, "test");
      
      if (localStorage.getItem(testKey) === "test") {
        localStorage.removeItem(testKey);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Ошибка при проверке подключения:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Запуск тестов базы данных
   */
  const runDatabaseTests = useCallback(async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    setTestResults([
      { name: "Чтение данных", status: "pending", message: "Выполняется..." },
      { name: "Запись данных", status: "pending", message: "Выполняется..." },
      { name: "Удаление данных", status: "pending", message: "Выполняется..." }
    ]);
    
    // Имитация тестов
    setTimeout(() => {
      try {
        // Тест чтения
        const readTest = testReadOperation();
        
        // Тест записи
        const writeTest = testWriteOperation();
        
        // Тест удаления
        const deleteTest = testDeleteOperation();
        
        setTestResults([
          { name: "Чтение данных", ...readTest },
          { name: "Запись данных", ...writeTest },
          { name: "Удаление данных", ...deleteTest }
        ]);
      } catch (error) {
        console.error("Ошибка при выполнении тестов:", error);
        setTestResults([
          { name: "Чтение данных", status: "error", message: "Произошла ошибка" },
          { name: "Запись данных", status: "error", message: "Произошла ошибка" },
          { name: "Удаление данных", status: "error", message: "Произошла ошибка" }
        ]);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  }, [isConnected]);

  /**
   * Тест операции чтения
   */
  const testReadOperation = () => {
    try {
      localStorage.getItem("test_read");
      return { status: "success" as const, message: "Операция чтения выполнена успешно" };
    } catch (error) {
      return { status: "error" as const, message: "Ошибка при чтении данных" };
    }
  };

  /**
   * Тест операции записи
   */
  const testWriteOperation = () => {
    try {
      const testKey = "test_write_" + Date.now();
      localStorage.setItem(testKey, "test_data");
      const result = localStorage.getItem(testKey) === "test_data";
      return { 
        status: result ? "success" as const : "error" as const, 
        message: result ? "Операция записи выполнена успешно" : "Данные записаны некорректно" 
      };
    } catch (error) {
      return { status: "error" as const, message: "Ошибка при записи данных" };
    }
  };

  /**
   * Тест операции удаления
   */
  const testDeleteOperation = () => {
    try {
      const testKey = "test_delete_" + Date.now();
      localStorage.setItem(testKey, "test_data");
      localStorage.removeItem(testKey);
      const result = localStorage.getItem(testKey) === null;
      return { 
        status: result ? "success" as const : "error" as const, 
        message: result ? "Операция удаления выполнена успешно" : "Данные не были удалены" 
      };
    } catch (error) {
      return { status: "error" as const, message: "Ошибка при удалении данных" };
    }
  };

  return {
    isConnected,
    isLoading,
    testResults,
    checkConnection,
    runDatabaseTests
  };
}
