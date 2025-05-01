
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Project, Task, User } from "@/types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProjectList from "@/components/ProjectList";
import UserManagement from "@/components/UserManagement";
import ProjectExport from "@/components/ProjectExport";
import ProjectImport from "@/components/ProjectImport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    tasks: [],
  });
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Загрузка данных пользователя из localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Загрузка проектов из localStorage
    const projectsFromStorage = localStorage.getItem('projects');
    if (projectsFromStorage) {
      try {
        setProjects(JSON.parse(projectsFromStorage));
      } catch (error) {
        console.error("Failed to parse projects data:", error);
      }
    }
  }, []);

    
    // Загрузка пользователей
    const usersData = localStorage.getItem("users");
    
    if (usersData) {
      try {
        const loadedUsers = JSON.parse(usersData);
        setUsers(loadedUsers);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        setUsers([]);
      }
    } else {
      // Создаем дефолтного пользователя, если не существует
      const defaultUser: User = {
        id: "user1",
        username: "manager",
        role: "manager",
        isAuthenticated: true
      };
      const defaultUsers = [defaultUser];
      setUsers(defaultUsers);
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, [navigate]);

  useEffect(() => {
    // Загрузка проектов из localStorage
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem("projects");
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        }
      } catch (error) {
        console.error("Ошибка загрузки проектов:", error);
      }
    };
    
    // Загрузка пользователя из localStorage
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
      }
    };
    
    loadProjects();
    loadUser();
  }, []);

  const handleLogout = () => {
    if (user) {
      const updatedUser = { ...user, isAuthenticated: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    navigate("/login");
  };

  const handleAddProject = () => {
    if (!newProject.name) {
      toast.error("Введите название проекта");
      return;
    }

    const project: Project = {
      id: crypto.randomUUID(),
      name: newProject.name,
      description: newProject.description || "",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    
    setNewProject({
      name: "",
      description: "",
      tasks: [],
    });
    
    setIsDialogOpen(false);
    toast.success("Проект создан");
  };

  const handleAddTask = (projectId: string, task: Partial<Task>) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: [...project.tasks, { ...task, id: crypto.randomUUID() } as Task],
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Задача добавлена");
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    );
    
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Проект обновлен");
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Проект удален");
  };

  const handleAddUser = (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast.success("Пользователь добавлен");
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast.success("Пользователь обновлен");
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast.success("Пользователь удален");
  };

  const handleImportProjects = (importedProjects: Project[]) => {
    const updatedProjects = [...projects, ...importedProjects];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success(`Импортировано ${importedProjects.length} проектов`);
  };

  const handleUpdateTask = (projectId: string, updatedTask: Task) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Задача обновлена");
  };

  const handleDeleteTask = (projectId: string, taskId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId),
          updatedAt: new Date().toISOString(),
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Задача удалена");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <Button variant="outline" onClick={handleLogout}>
          <Icon name="LogOut" className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Управление проектами</TabsTrigger>
          <TabsTrigger value="users">Управление пользователями</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Проекты</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Добавить проект
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый проект</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Название проекта</label>
                    <input
                      id="name"
                      type="text"
                      className="border p-2 rounded-md"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description">Описание проекта</label>
                    <textarea
                      id="description"
                      className="border p-2 rounded-md"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleAddProject}>
                    Создать проект
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ProjectList 
            projects={projects} 
            onAddTask={handleAddTask} 
            onUpdateProject={handleUpdateProject} 
            onDeleteProject={handleDeleteProject} 
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            users={users}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <UserManagement 
            users={users} 
            onAddUser={handleAddUser} 
            onUpdateUser={handleUpdateUser} 
            onDeleteUser={handleDeleteUser} 
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Экспорт отчетов</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectExport projects={projects} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Импорт проектов</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectImport onImport={handleImportProjects} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
