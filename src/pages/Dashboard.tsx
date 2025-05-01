
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project, User } from "@/types/project";
import ProjectList from "@/components/ProjectList";
import ProjectImport from "@/components/ProjectImport";

import ProjectExport from "@/components/ProjectExport";
import UserManagement from "@/components/UserManagement";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка авторизации
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(userStr) as User;
    if (!userData.isAuthenticated || userData.role !== "manager") {
      navigate("/login");
      return;
    }
    
    setUser(userData);
    
    // Загрузка проектов из localStorage (в реальном приложении будет API)
    const projectsStr = localStorage.getItem("projects");
    if (projectsStr) {
      setProjects(JSON.parse(projectsStr));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProjectsUpdated = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Панель руководителя</h1>
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

        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="import">Импорт данных</TabsTrigger>
            <TabsTrigger value="export">Экспорт отчетов</TabsTrigger>
          </TabsList>

          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Управление проектами</CardTitle>
                <CardDescription>
                  Просмотр и управление всеми проектами и задачами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList 
                  projects={projects} 
                  onProjectsUpdated={handleProjectsUpdated}
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
                  Загрузите данные проектов из Excel или CSV файла
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectImport onImportComplete={handleProjectsUpdated} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Экспорт отчетов</CardTitle>
                <CardDescription>
                  Выгрузите отчеты по проектам и сотрудникам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectExport projects={projects} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
