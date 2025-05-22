import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Project, User } from "@/types/project";
import { toast } from "sonner";
import ProjectList from "@/components/ProjectList";
import ProjectImport from "@/components/ProjectImport";
import ProjectExport from "@/components/ProjectExport";
import UserManagement from "@/components/UserManagement";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователя и проекты при монтировании
  useEffect(() => {
    try {
      // Проверяем авторизацию
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        navigate("/login");
        return;
      }

      const userData = JSON.parse(userJson);

      // ИСПРАВЛЕНИЕ: Проверяем и корректируем роль
      if (
        userData &&
        userData.id === "default-manager" &&
        userData.role !== "manager"
      ) {
        console.warn("Исправление роли для руководителя");
        userData.role = "manager";
        localStorage.setItem("user", JSON.stringify(userData));
      }

      if (!userData || !userData.isAuthenticated) {
        navigate("/login");
        return;
      }

      // Проверяем роль пользователя
      if (userData.role !== "manager") {
        console.warn(
          `Обнаружена неверная роль: ${userData.role}, ожидается: manager`,
        );
        // Пробуем скорректировать сессию
        if (userData.id === "default-manager") {
          userData.role = "manager";
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("Роль пользователя скорректирована на manager");
        } else {
          navigate("/employee");
          return;
        }
      }

      setUser(userData);

      // Загружаем проекты
      const projectsJson = localStorage.getItem("projects");
      if (projectsJson) {
        const parsedProjects = JSON.parse(projectsJson);
        setProjects(Array.isArray(parsedProjects) ? parsedProjects : []);
      } else {
        // Если проектов нет, создаем пустой массив
        localStorage.setItem("projects", JSON.stringify([]));
        setProjects([]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      toast.error("Ошибка при загрузке данных");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Обработчик импорта проекта
  const handleImportProject = (newProject: Project) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success(`Проект "${newProject.name}" успешно импортирован`);
  };

  // Обработчик обновления проекта
  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project,
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success(`Проект "${updatedProject.name}" обновлен`);
  };

  // Обработчик удаления проекта
  const handleDeleteProject = (projectId: string) => {
    const projectToDelete = projects.find((p) => p.id === projectId);
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId,
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    if (projectToDelete) {
      toast.success(`Проект "${projectToDelete.name}" удален`);
    }
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Icon
            name="Loader2"
            className="mx-auto h-12 w-12 animate-spin text-primary"
          />
          <p className="mt-4 text-lg font-medium">
            Загрузка панели управления...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Панель руководителя</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.name || "Пользователь"}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="container mx-auto py-6 px-4">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Табы */}
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="projects">
              <Icon name="Layers" className="mr-2 h-4 w-4" />
              Проекты
            </TabsTrigger>
            <TabsTrigger value="import">
              <Icon name="FileInput" className="mr-2 h-4 w-4" />
              Импорт
            </TabsTrigger>
            <TabsTrigger value="export">
              <Icon name="FileOutput" className="mr-2 h-4 w-4" />
              Экспорт
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Пользователи
            </TabsTrigger>
          </TabsList>

          {/* Содержимое вкладок */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление проектами</CardTitle>
                <CardDescription>
                  Просмотр и редактирование проектов и задач
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList
                  projects={projects}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  userRole="manager"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Импорт проектов</CardTitle>
                <CardDescription>
                  Создайте новый проект или импортируйте существующий
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectImport onImport={handleImportProject} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Экспорт отчетов</CardTitle>
                <CardDescription>
                  Формирование и экспорт отчетов по проектам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectExport projects={projects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Добавление и управление пользователями системы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
