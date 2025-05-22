import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/project";
import Icon from "@/components/ui/icon";

interface ProjectImportProps {
  onImport: (project: Project) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onImport }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert("Название проекта обязательно");
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectName,
      description: projectDescription,
      startDate,
      endDate,
      tasks: [],
      progress: 0,
      createdAt: new Date().toISOString(),
    };

    onImport(newProject);

    // Сброс формы
    setProjectName("");
    setProjectDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Создать новый проект</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Название проекта *
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Введите название проекта"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Введите описание проекта"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Дата начала
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Дата окончания
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleCreateProject} className="w-full">
          <Icon name="Plus" className="mr-2 h-4 w-4" />
          Создать проект
        </Button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Импорт из файла</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Icon name="Upload" className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Перетащите файл проекта сюда или нажмите для выбора
          </p>
          <Button variant="outline" className="mt-4">
            Выбрать файл
          </Button>
          <p className="mt-2 text-xs text-gray-400">
            Поддерживаемые форматы: .json, .xlsx, .csv
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectImport;
