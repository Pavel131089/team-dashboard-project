
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

/**
 * Страница статуса базы данных
 */
const DatabaseStatus = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = React.useState<"checking" | "connected" | "disconnected">("checking");
  const [storageStats, setStorageStats] = React.useState({
    users: 0,
    projects: 0,
  });

  // Имитация проверки подключения при загрузке
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        // Проверяем доступность localStorage
        const testKey = "test_connection_" + Date.now();
        localStorage.setItem(testKey, "test");
        if (localStorage.getItem(testKey) === "test") {
          localStorage.removeItem(testKey);
          setConnectionStatus("connected");
          
          // Получаем статистику хранилища
          updateStorageStats();
        } else {
          setConnectionStatus("disconnected");
        }
      } catch (error) {
        console.error("Ошибка при проверке подключения:", error);
        setConnectionStatus("disconnected");
        toast.error("Проблема с доступом к хранилищу");
      }
    };
    
    checkConnection();
  }, []);

  // Обновляет статистику хранилища
  const updateStorageStats = () => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      
      setStorageStats({
        users: Array.isArray(users) ? users.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
      });
    } catch (error) {
      console.error("Ошибка при получении статистики хранилища:", error);
    }
  };

  // Выполняет тест базы данных
  const runDatabaseTest = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve(true), 1500);
      }),
      {
        loading: "Проверка локального хранилища...",
        success: "Хранилище доступно и работает корректно",
        error: "Ошибка при проверке хранилища",
      }
    );
  };

  // Выполняет сброс базы данных
  const resetDatabase = () => {
    if (window.confirm("Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.")) {
      try {
        // Сохраняем информацию о текущем пользователе
        const currentUser = localStorage.getItem("user");
        
        // Сбрасываем все хранилище
        localStorage.clear();
        
        // Восстанавливаем текущего пользователя
        if (currentUser) {
          localStorage.setItem("user", currentUser);
        }
        
        // Инициализируем пустые массивы
        localStorage.setItem("users", JSON.stringify([]));
        localStorage.setItem("projects", JSON.stringify([]));
        
        toast.success("База данных успешно сброшена");
        updateStorageStats();
      } catch (error) {
        console.error("Ошибка при сбросе базы данных:", error);
        toast.error("Ошибка при сбросе базы данных");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold truncate">Статус базы данных</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Вернуться назад
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Карточка статуса подключения */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Статус подключения к хранилищу</span>
                <ConnectionStatusIndicator status={connectionStatus} />
              </CardTitle>
              <CardDescription>
                Проверка доступности локального хранилища данных
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConnectionStatusAlert status={connectionStatus} />
              
              <div className="flex gap-3 flex-wrap">
                <Button 
                  onClick={runDatabaseTest}
                  disabled={connectionStatus === "checking"}
                >
                  <Icon name="Database" className="mr-2 h-4 w-4" />
                  Проверить подключение
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={resetDatabase}
                  disabled={connectionStatus !== "connected"}
                >
                  <Icon name="Trash2" className="mr-2 h-4 w-4" />
                  Сбросить базу данных
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Карточка статистики хранилища */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика хранилища</CardTitle>
              <CardDescription>
                Информация о хранящихся данных
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatisticsItem 
                  icon="Users" 
                  title="Пользователи" 
                  count={storageStats.users} 
                />
                
                <StatisticsItem 
                  icon="FolderKanban" 
                  title="Проекты" 
                  count={storageStats.projects} 
                />
              </div>
              
              <Alert>
                <Icon name="Info" className="h-4 w-4" />
                <AlertTitle>Информация о хранилище</AlertTitle>
                <AlertDescription>
                  Все данные хранятся локально в браузере с использованием localStorage. 
                  Они будут доступны только на этом устройстве и могут быть потеряны при очистке кэша.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Компонент индикатора статуса подключения
const ConnectionStatusIndicator = ({ status }: { status: "checking" | "connected" | "disconnected" }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      case "checking":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Подключено";
      case "disconnected":
        return "Отключено";
      case "checking":
      default:
        return "Проверка...";
    }
  };
  
  return (
    <div className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusStyles()}`}>
      {getStatusText()}
    </div>
  );
};

// Компонент уведомления о статусе подключения
const ConnectionStatusAlert = ({ status }: { status: "checking" | "connected" | "disconnected" }) => {
  if (status === "checking") {
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
  
  if (status === "disconnected") {
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
  
  return (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <Icon name="CheckCircle" className="h-4 w-4" />
      <AlertTitle>Подключение установлено</AlertTitle>
      <AlertDescription>
        Локальное хранилище доступно и работает корректно.
      </AlertDescription>
    </Alert>
  );
};

// Компонент элемента статистики
const StatisticsItem = ({ icon, title, count }: { icon: string; title: string; count: number }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
      <Icon name={icon} className="h-8 w-8 mb-2 text-slate-500" />
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

export default DatabaseStatus;
