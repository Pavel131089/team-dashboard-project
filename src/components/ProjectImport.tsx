
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Project, Task } from '../types/project';
import Icon from './ui/icon';

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    if (!projectName) {
      setError('Введите название проекта');
      return;
    }

    // Создаем тестовый проект с минимальными данными
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      description: 'Тестовый проект',
      tasks: [
        {
          id: crypto.randomUUID(),
          name: 'Задача 1',
          description: 'Описание задачи 1',
          status: 'TODO',
          priority: 'MEDIUM',
          price: 0,
          estimatedTime: 0,
          startDate: null,
          endDate: null,
          progress: 0,
          assignedTo: [],
          actualStartDate: null,
          actualEndDate: null,
          comments: []
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onImport(newProject);
    toast.success(`Проект "${projectName}" успешно создан`);
    setProjectName('');
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Импорт проекта</CardTitle>
        <CardDescription>
          Создайте новый тестовый проект
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium mb-1">
              Название проекта
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Введите название проекта"
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleImport}>
              <Icon name="PlusCircle" className="mr-2 h-4 w-4" />
              Создать проект
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectImport;
