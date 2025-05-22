import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/ui/icon";
import { sessionService } from "@/services/auth/sessionService";
import { toast } from "sonner";

const Employee: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Обработчик выхода из системы
  const handleLogout = useCallback(() => {
    sessionService.clearSession();
    // Используем setTimeout для предотвращения вызова toast во время рендеринга
    setTimeout(() => {
      toast.success("Вы вышли из системы");
      navigate("/login");
    }, 0);
  }, [navigate]);

  // Проверка авторизации при загрузке страницы
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const session = sessionService.getCurrentSession();

      if (!session || !session.isAuthenticated) {
        // Перенос вызова toast в useEffect
        setTimeout(() => {
          toast.error("Необходимо войти в систему");
          navigate("/login");
        }, 0);
        return;
      }

      // Если пользователь менеджер, перенаправляем на панель руководителя
      if (session.role === "manager") {
        // Перенос вызова toast в useEffect
        setTimeout(() => {
          toast.info("Перенаправление на панель руководителя");
          navigate("/dashboard");
        }, 0);
        return;
      }

      setUser(session);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Пока загружаются данные, показываем скелетон
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Заголовок */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Панель сотрудника</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              <Icon name="User" className="mr-2 inline-block h-4 w-4" />
              {user?.username || "Сотрудник"}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Панель сотрудника</h1>

        {/* Карточка с задачами */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Мои задачи</CardTitle>
            <CardDescription>Список назначенных вам задач</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-gray-500">
              <Icon
                name="ClipboardList"
                className="mx-auto mb-4 h-12 w-12 opacity-50"
              />
              <p className="mb-2">У вас пока нет назначенных задач</p>
              <p className="text-sm">
                Задачи появятся здесь, когда руководитель назначит их вам
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Карточка с доступными проектами */}
        <Card>
          <CardHeader>
            <CardTitle>Доступные проекты</CardTitle>
            <CardDescription>
              Проекты, в которых вы можете принять участие
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-gray-500">
              <Icon
                name="Briefcase"
                className="mx-auto mb-4 h-12 w-12 opacity-50"
              />
              <p className="mb-2">Нет доступных проектов</p>
              <p className="text-sm">
                Здесь будут отображаться проекты, требующие вашего участия
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Employee;
