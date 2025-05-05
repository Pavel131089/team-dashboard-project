
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectList from "@/components/ProjectList";
import ProjectImport from "@/components/ProjectImport";
import ProjectExport from "@/components/ProjectExport";
import UserManagement from "@/components/UserManagement";
import { Project } from "@/types/project";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  projects: Project[];
  onImportProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  projects,
  onImportProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="space-y-6">
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
              onUpdateProject={onUpdateProject}
              onDeleteProject={onDeleteProject}
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
            <ProjectImport onImport={onImportProject} />
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
  );
};

export default DashboardTabs;
