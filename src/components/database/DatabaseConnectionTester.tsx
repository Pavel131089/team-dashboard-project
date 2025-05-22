
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

/**
 * Компонент для тестирования подключения к локальному хранилищу
 */
const DatabaseConnectionTester: React.FC = () => {
  // Состояние подключения
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Array<{name: string; success: boolean; message: string}>>([]);

  // Проверяем соединение при загрузке компонента
  useEffect(() => {
    checkConnection();
  }, []);

  /**
   * Проверяет доступность локального хранилища
   */
  const checkConnection = async () => {
    setIsLoading(true);
    
    try {
      // Простой тест доступности localStorage
      const testKey = "test_connection_" + Date.now();
      localStorage.setItem(testKey, "test");
      
      if (localStorage.getItem(testKey) === "test") {
        localStorage.removeItem(testKey);
        setConnectionStatus(true);
      } else {
        setConnectionStatus(false);
      }
    } catch (error) {
      console.error("Ошибка при проверке подключения:", error);
      setConnectionStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Выполняет полное тестирование базы данных
   */
  const runDatabaseTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    // Уведомляем пользователя о начале тестирования
    toast.info("Запуск тестов базы данных...");
    
    // Тест 1: Запись данных
    let writeTestSuccess = false;
    try {
      const testKey = "db_test_write_" + Date.now();
      localStorage.setItem(testKey, JSON.stringify({ test: true, timestamp: Date.now() }));
      writeTestSuccess = true;
      
      // Добавляем результат теста
      setTestResults(prev => [...prev, {
        name: "Запись данных",
        success: true,
        message: "Запись в хранилище выполнена успешно"
      }]);
    } catch (error) {
      console.error("Ошибка при тесте записи:", error);
      setTestResults(prev => [...prev, {
        name: "Запись данных",
        success: false,
        message: "Не удалось записать данные в хранилище"
      }]);
    }
    
    // Небольшая задержка для наглядности
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Тест 2: Чтение данных
    try {
      const usersStr = localStorage.getItem("users");
      const projectsStr = localStorage.getItem("projects");
      
      const usersResult = usersStr ? JSON.parse(usersStr) : null;
      const projectsResult = projectsStr ? JSON.parse(projectsStr) : null;
      
      setTestResults(prev => [...prev, {
        name: "Чтение данных",
        success: true,
        message: `Успешно прочитаны данные: пользователи (${usersResult ? Array.isArray(usersResult) ? usersResult.length : 'не массив' : 'нет'}), проекты (${projectsResult ? Array.isArray(projectsResult) ? projectsResult.length : 'не массив' : 'нет'})`
      }]);
    } catch (error) {
      console.error("Ошибка при тесте чтения:", error);
      setTestResults(prev => [...prev, {
        name: "Чтение данных",
        success: false,
        message: "Не удалось прочитать данные из хранилища"
      }]);
    }
    
    // Небольшая задержка для наглядности
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Тест 3: Удаление данных
    if (writeTestSuccess) {
      try {
        const testKeys = Object.keys(localStorage).filter(key => key.startsWith("db_test_"));
        testKeys.forEach(key => localStorage.removeItem(key));
        
        setTestResults(prev => [...prev, {
          name: "Удаление данных",
          success: true,
          message: `Успешно удалены тестовые данные (${testKeys.length} ключей)`
        }]);
      } catch (error) {
        console.error("Ошибка при тесте удаления:", error);
        setTestResults(prev => [...prev, {
          name: "Удаление данных",
          success: false,
          message: "Не удалось удалить данные из хранилища"
        }]);
      }
    }
    
    setIsLoading(false);
    
    // Общий результат
    const allSuccess = testResults.every(test => test.success);
    if (allSuccess) {
      toast.success("Все тесты базы данных пройдены успешно");
    } else {
      toast.error("Некоторые тесты базы данных не пройдены");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Статус подключения к хранилищу</span>
          <ConnectionStatusIndicator isConnected={connectionStatus} />
        </CardTitle>
        <CardDescription>
          Тестирование подключения к хранилищу данных и операций
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Оповещение о статусе подключения */}
        <ConnectionStatusAlert connectionStatus={connectionStatus} isLoading={isLoading} />

        {/* Кнопки для тестирования */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={checkConnection} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
            )}
            Проверить подключение
          </Button>
          
          <Button 
            onClick={runDatabaseTests} 
            disabled={isLoading || connectionStatus !== true}
          >
            <Icon name="Database" className="mr-2 h-4 w-4" />
            Запустить тесты базы данных
          </Button>
        </div>

        {/* Результаты тестов */}
        {testResults.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Результаты тестирования:</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <TestResultItem key={index} result={result} />
              ))}
            </div>
          </div>
        )}
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

/**
 * Компонент для отображения статуса подключения
 */
const ConnectionStatusIndicator: React.FC<{ isConnected: boolean | null }> = ({ 
  isConnected 
}) => {
  if (isConnected === null) {
    return (
      <div className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
        Проверка...
      </div>
    );
  }
  
  const statusClasses = isConnected
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
  
  return (
    <div className={`px-2 py-1 text-xs font-medium rounded-md ${statusClasses}`}>
      {isConnected ? "Подключено" : "Отключено"}
    </div>
  );
};

/**
 * Компонент для отображения уведомления о статусе подключения
 */
const ConnectionStatusAlert: React.FC<{
  connectionStatus: boolean | null;
  isLoading: boolean;
}> = ({ connectionStatus, isLoading }) => {
  if (isLoading) {
    return (
      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
        <Icon name="Loader2" className="h-4 w-4 animate-spin" />
        <AlertTitle>Проверка подключения</AlertTitle>
        <AlertDescription>
          Выполняется проверка доступности локального хранилища...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (connectionStatus === false) {
    return (
      <Alert variant="destructive">
        <Icon name="AlertTriangle" className="h-4 w-4" />
        <AlertTitle>Проблема с подключением</AlertTitle>
        <AlertDescription>
          Локальное хранилище недоступно. Возможно, браузер блокирует доступ к localStorage 
          или включен режим приватного просмотра.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (connectionStatus === true) {
    return (
      <Alert className="bg-green-50 text-green-800 border-green-200">
        <Icon name="CheckCircle" className="h-4 w-4" />
        <AlertTitle>Подключение установлено</AlertTitle>
        <AlertDescription>
          Локальное хранилище доступно и работает корректно.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

/**
 * Компонент для отображения результата теста
 */
const TestResultItem: React.FC<{
  result: { name: string; success: boolean; message: string };
}> = ({ result }) => {
  const { name, success, message } = result;
  
  return (
    <div className={`p-2 rounded-md ${success ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-center">
        {success ? (
          <Icon name="CheckCircle" className="h-4 w-4 text-green-600 mr-2" />
        ) : (
          <Icon name="XCircle" className="h-4 w-4 text-red-600 mr-2" />
        )}
        <span className="font-medium">{name}</span>
      </div>
      <p className={`text-xs mt-1 ${success ? 'text-green-800' : 'text-red-800'}`}>
        {message}
      </p>
    </div>
  );
};

export default DatabaseConnectionTester;
