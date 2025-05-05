
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import Icon from '../ui/icon';
import { toast } from 'sonner';
import { Project } from '@/types/project';

interface ManualProjectFormProps {
  onImport: (project: Project) => void;
}

export const ManualProjectForm: React.FC<ManualProjectFormProps> = ({ onImport }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!projectName) {
      setError('Введите название проекта');
      return;
    }

    // Создаем проект с минимальными данными
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName,
      description: projectDescription || 'Новый проект',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onImport(newProject);
    toast.success(`Проект "${projectName}" успешно создан`);
    resetForm();
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Создать новый проект</CardTitle>
        <CardDescription>
          Заполните форму для создания нового проекта
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectName" className="block text-sm font-medium mb-1">
              Название проекта *
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Введите название проекта"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="projectDescription" className="block text-sm font-medium mb-1">
              Описание проекта
            </Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Введите описание проекта"
              className="w-full"
              rows={3}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleCreateProject}>
              <Icon name="PlusCircle" className="mr-2 h-4 w-4" />
              Создать проект
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
