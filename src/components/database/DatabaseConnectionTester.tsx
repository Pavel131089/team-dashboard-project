
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/services/firebase/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  Timestamp, 
  getDoc
} from "firebase/firestore";

/**
 * Компонент для тестирования подключения к базе данных Firebase
 */
const DatabaseConnectionTester: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    write: boolean | null;
    read: boolean | null;
    update: boolean | null;
    delete: boolean | null;
    testData: any | null;
  }>({
    write: null,
    read: null,
    update: null,
    delete: null,
    testData: null
  });

  // Проверка соединения при загрузке компонента
  useEffect(() => {
    checkConnection();
  }, []);

  /**
   * Проверка соединения с Firebase
   */
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      // Простой тест - попытка получить коллекцию
      const querySnapshot = await getDocs(collection(db, "connection_test"));
      
      // Если дошли до этой строки без ошибок - соединение работает
      setIsConnected(true);
      toast({
        title: "Соединение установлено",
        description: "Подключение к базе данных Firebase успешно",
      });
    } catch (error) {
      console.error("Ошибка при проверке подключения:", error);
      setIsConnected(false);
      toast({
        title: "Ошибка соединения",
        description: "Не удалось подключиться к базе данных",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Тестирование операций с базой данных
   */
  const runDatabaseTests = async () => {
    setIsLoading(true);
    const testId = "test_" + Date.now().toString();
    const testCollectionName = "database_tests";
    
    try {
      setTestResults({
        write: null,
        read: null,
        update: null,
        delete: null,
        testData: null
      });
      
      // Тест 1: Запись данных
      try {
        const testData = {
          message: "Test data",
          timestamp: serverTimestamp(),
          number: Math.floor(Math.random() * 1000)
        };
        
        await setDoc(doc(db, testCollectionName, testId), testData);
        setTestResults(prev => ({ ...prev, write: true }));
        toast({
          title: "Запись успешна",
          description: "Тестовые данные успешно записаны в базу данных",
        });
      } catch (error) {
        console.error("Ошибка при записи данных:", error);
        setTestResults(prev => ({ ...prev, write: false }));
        toast({
          title: "Ошибка записи",
          description: "Не удалось записать данные в базу",
          variant: "destructive",
        });
      }
      
      // Тест 2: Чтение данных
      try {
        const docRef = doc(db, testCollectionName, testId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTestResults(prev => ({ 
            ...prev, 
            read: true,
            testData: {
              id: docSnap.id,
              ...data,
              timestamp: data.timestamp instanceof Timestamp 
                ? data.timestamp.toDate().toISOString() 
                : "pending..."
            }
          }));
          toast({
            title: "Чтение успешно",
            description: "Тестовые данные успешно прочитаны из базы данных",
          });
        } else {
          throw new Error("Документ не найден");
        }
      } catch (error) {
        console.error("Ошибка при чтении данных:", error);
        setTestResults(prev => ({ ...prev, read: false }));
        toast({
          title: "Ошибка чтения",
          description: "Не удалось прочитать данные из базы",
          variant: "destructive",
        });
      }
      
      // Тест 3: Обновление данных
      try {
        const docRef = doc(db, testCollectionName, testId);
        await setDoc(docRef, { 
          updated: true,
          updateTimestamp: serverTimestamp()
        }, { merge: true });
        
        // Проверяем обновление
        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();
        
        setTestResults(prev => ({ 
          ...prev, 
          update: true,
          testData: {
            ...prev.testData,
            updated: updatedData?.updated,
            updateTimestamp: updatedData?.updateTimestamp instanceof Timestamp 
              ? updatedData.updateTimestamp.toDate().toISOString() 
              : "pending..."
          }
        }));
        
        toast({
          title: "Обновление успешно",
          description: "Тестовые данные успешно обновлены в базе данных",
        });
      } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
        setTestResults(prev => ({ ...prev, update: false }));
        toast({
          title: "Ошибка обновления",
          description: "Не удалось обновить данные в базе",
          variant: "destructive",
        });
      }
      
      // Тест 4: Удаление данных
      try {
        const docRef = doc(db, testCollectionName, testId);
        await deleteDoc(docRef);
        
        // Проверяем удаление
        const deletedDoc = await getDoc(docRef);
        if (!deletedDoc.exists()) {
          setTestResults(prev => ({ ...prev, delete: true }));
          toast({
            title: "Удаление успешно",
            description: "Тестовые данные успешно удалены из базы данных",
          });
        } else {
          throw new Error("Документ не был удален");
        }
      } catch (error) {
        console.error("Ошибка при удалении данных:", error);
        setTestResults(prev => ({ ...prev, delete: false }));
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить данные из базы",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error("Общая ошибка при тестировании базы данных:", error);
      toast({
        title: "Ошибка тестирования",
        description: "Произошла ошибка при выполнении тестов",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="outline">Не проверено</Badge>;
    return status ? 
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Успешно</Badge> : 
      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Ошибка</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Статус подключения к базе данных</CardTitle>
          {isConnected !== null && (
            <Badge 
              variant="outline" 
              className={isConnected ? 
                "bg-green-100 text-green-800 hover:bg-green-100" : 
                "bg-red-100 text-red-800 hover:bg-red-100"
              }
            >
              {isConnected ? "Подключено" : "Отключено"}
            </Badge>
          )}
        </div>
        <CardDescription>
          Тестирование подключения к Firebase и операций с базой данных
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isConnected === false && (
          <Alert variant="destructive">
            <Icon name="AlertTriangle" className="h-4 w-4" />
            <AlertTitle>Ошибка подключения</AlertTitle>
            <AlertDescription>
              Не удалось подключиться к базе данных Firebase. Проверьте подключение к интернету или конфигурацию.
            </AlertDescription>
          </Alert>
        )}
        
        {isConnected === true && (
          <Alert className="bg-green-50 border-green-200">
            <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Подключение установлено</AlertTitle>
            <AlertDescription className="text-green-600">
              Соединение с Firebase успешно установлено. Вы можете выполнить тесты операций с базой данных.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={checkConnection} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Проверка...
              </>
            ) : (
              <>
                <Icon name="RefreshCw" className="mr-2 h-4 w-4" />
                Проверить подключение
              </>
            )}
          </Button>
          
          <Button 
            onClick={runDatabaseTests}
            disabled={isLoading || !isConnected}
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Тестирование...
              </>
            ) : (
              <>
                <Icon name="Database" className="mr-2 h-4 w-4" />
                Тестировать базу данных
              </>
            )}
          </Button>
        </div>
        
        {(testResults.write !== null || testResults.read !== null || 
          testResults.update !== null || testResults.delete !== null) && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3">Результаты тестирования:</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Запись данных:</span> 
                {getStatusBadge(testResults.write)}
              </li>
              <li className="flex justify-between">
                <span>Чтение данных:</span> 
                {getStatusBadge(testResults.read)}
              </li>
              <li className="flex justify-between">
                <span>Обновление данных:</span> 
                {getStatusBadge(testResults.update)}
              </li>
              <li className="flex justify-between">
                <span>Удаление данных:</span> 
                {getStatusBadge(testResults.delete)}
              </li>
            </ul>
            
            {testResults.testData && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Тестовые данные:</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(testResults.testData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 text-xs text-slate-500">
        <div>
          <p>Подключение к Firebase Firestore</p>
          <p>Последняя проверка: {isConnected !== null ? new Date().toLocaleString() : "—"}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTester;
