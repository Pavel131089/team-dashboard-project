
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (!user.isAuthenticated) {
      navigate("/login");
    } else if (user.role !== "manager") {
      navigate("/employee");
    }

    // Загрузка проектов из localStorage
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(savedProjects);

    // Загрузка пользователей из localStorage
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(savedUsers);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) {
      toast.error("Заполните название и описание проекта");
      return;
    }

    const projectToAdd: Project = {
      id: crypto.randomUUID(),
      name: newProject.name,
      description: newProject.description,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, projectToAdd];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setNewProject({
      name: "",
      description: "",
      tasks: [],
    });

    setIsDialogOpen(false);
    toast.success("Проект добавлен");
  };

  const handleAddTask = (projectId: string, task: Task) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: [...project.tasks, { ...task, id: crypto.randomUUID() }],
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
