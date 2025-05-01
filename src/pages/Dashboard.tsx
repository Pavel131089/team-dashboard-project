
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project, User } from "@/types/project";
import ProjectList from "@/components/ProjectList";
import ProjectImport from "@/components/ProjectImport";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import ProjectList from "@/components/ProjectList";
import ProjectImport from "@/components/ProjectImport";
import ProjectExport from "@/components/ProjectExport";
import UserManagement from "@/components/UserManagement";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ProjectTaskEditor from "@/components/ui/project-task-editor";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTasksEditorOpen, setIsTasksEditorOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Проверяем авторизацию
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser) as User;
      if (!user.isAuthenticated || user.role !== "manager") {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
    } catch (e) {
      navigate("/login");
      return;
    }

    // Загрузка проектов
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (e) {
        console.error("Ошибка загрузки проектов:", e);
      }
    }

    // Загрузка пользователей
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        console.error("Ошибка загрузки пользователей:", e);
      }
    }
  }, [navigate]);

  // Обработчик обновления проектов
  const handleProjectsUpdated = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Обработчик обновления пользователей
  const handleUsersUpdated = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // Обработчик обновления отдельного проекта
  const handleProjectUpdate = (updatedProject: Project) => {
    const updatedProjects = projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setSelectedProject(updatedProject);
    toast({
      title: "Проект обновлен",
      description: `Проект "${updatedProject.name}" успешно обновлен`,
    });
  };

  // Обработчик обновления задачи
  const handleTaskUpdate = (projectId: string, updatedTask: Task) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          ),
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  // Открыть редактор задач для проекта
  const openTasksEditor = (project: Project) => {
    setSelectedProject(project);
    setIsTasksEditorOpen(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Заголовок и кнопка выхода */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Панель управления</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600">
            {currentUser?.username} (Менеджер)
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <Icon name="LogOut" className="mr-1 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Основные вкладки */}
      <Tabs defaultValue="projects">
        <TabsList className="mb-4">
          <TabsTrigger value="projects">
            <Icon name="LayoutList" className="mr-1 h-4 w-4" />
            Управление проектами
          </TabsTrigger>
          <TabsTrigger value="import">
            <Icon name="Upload" className="mr-1 h-4 w-4" />
            Импорт данных
          </TabsTrigger>
          <TabsTrigger value="export">
            <Icon name="Download" className="mr-1 h-4 w-4" />
            Экспорт отчетов
          </TabsTrigger>
          <TabsTrigger value="users">
            <Icon name="Users" className="mr-1 h-4 w-4" />
            Пользователи
          </TabsTrigger>
        </TabsList>

        {/* Содержимое вкладок */}
        <TabsContent value="projects" className="space-y-4">
          <div className="bg-white p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Проекты и задачи</h2>
            {projects.length > 0 ? (
              <>
                <div className="mb-4">
                  {projects.map(project => (
                    <Button 
                      key={project.id} 
                      variant="outline" 
                      className="mr-2 mb-2"
                      onClick={() => openTasksEditor(project)}
                    >
                      <Icon name="FolderEdit" className="mr-1 h-4 w-4" />
                      {project.name}
                    </Button>
                  ))}
                </div>
                <ProjectList 
                  projects={projects} 
                  onProjectsUpdated={handleProjectsUpdated}
                  userRole="manager"
                />
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Проекты отсутствуют</p>
                <p className="text-slate-400 text-sm mt-2">
                  Импортируйте проекты через вкладку "Импорт данных"
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="import">
          <div className="bg-white p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Импорт данных</h2>
            <ProjectImport 
              projects={projects} 
              onProjectsUpdated={handleProjectsUpdated}
            />
          </div>
        </TabsContent>

        <TabsContent value="export">
          <div className="bg-white p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Экспорт отчетов</h2>
            <ProjectExport projects={projects} />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Управление пользователями</h2>
            <UserManagement 
              users={users} 
              onUsersUpdated={handleUsersUpdated}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Модальное окно для редактирования задач проекта */}
      {selectedProject && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isTasksEditorOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Управление задачами: {selectedProject.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsTasksEditorOpen(false)}>
                <Icon name="X" className="h-5 w-5" />
              </Button>
            </div>
            
            <ProjectTaskEditor 
              project={selectedProject} 
              onProjectUpdate={handleProjectUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

