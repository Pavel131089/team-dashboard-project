
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";
import ProjectList from "@/components/ProjectList";
import ProjectImport from "@/components/ProjectImport";
import ProjectExport from "@/components/ProjectExport";
import UserManagement from "@/components/UserManagement";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Загрузка данных при первом рендере
  useEffect(() => {
    // Загрузка пользователя из localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);

        // Если пользователь не руководитель, перенаправляем на страницу сотрудника
        if (parsedUser.role !== 'manager') {
          navigate('/employee');
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }

    // Загрузка проектов из localStorage
    const projectsFromStorage = localStorage.getItem('projects');
    if (projectsFromStorage) {
      try {
        const parsedProjects = JSON.parse(projectsFromStorage);
        setProjects(parsedProjects);
      } catch (error) {
        console.error("Failed to parse projects data:", error);
      }
    }
  }, [navigate]);

  const handleImportProjects = (importedProject: Project) => {
    // Обрабатываем как одиночный проект, а не как массив
    const updatedProjects = [...projects, importedProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success(`Проект "${importedProject.name}" успешно импортирован`);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Если пользователь не загружен, показываем загрузку
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Панель управления проектами</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user.username} (Руководитель)
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                <ProjectImport onImport={handleImportProjects} />
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
