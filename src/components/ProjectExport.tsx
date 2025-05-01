
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Project, Task } from "@/types/project";
import { toast } from "@/components/ui/use-toast";

interface ProjectExportProps {
  projects: Project[];
}

type ExportType = "all" | "employee" | "project";

const ProjectExport = ({ projects }: ProjectExportProps) => {
  const [exportType, setExportType] = useState<ExportType>("all");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Собираем уникальных сотрудников из всех задач
  const employees = new Set<string>();
  projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.assignedTo) {
        employees.add(task.assignedTo);
      }
    });
  });
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const handleExport = async () => {
    setIsLoading(true);
    
    try {
      // В реальном приложении здесь был бы код для генерации файла экспорта
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация экспорта
      
      let message = "Отчет успешно экспортирован";
      
      if (exportType === "employee" && selectedEmployee) {
        message = `Экспортирован отчет по сотруднику`;
      } else if (exportType === "project" && selectedProject) {
        const project = projects.find(p => p.id === selectedProject);
        message = `Экспортирован отчет по проекту "${project?.name}"`;
      }
      
      toast({
        title: "Экспорт завершен",
        description: message,
      });
      
      // В реальном приложении здесь был бы код для скачивания файла
      
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать отчет",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isExportDisabled = () => {
    if (isLoading) return true;
    if (exportType === "employee" && !selectedEmployee) return true;
    if (exportType === "project" && !selectedProject) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Тип отчета</Label>
        <RadioGroup 
          value={exportType} 
          onValueChange={(value) => setExportType(value as ExportType)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">Полный отчет по всем проектам</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="employee" id="employee" />
            <Label htmlFor="employee">Отчет по сотруднику</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="project" id="project" />
            <Label htmlFor="project">Отчет по проекту</Label>
          </div>
        </RadioGroup>
      </div>
      
      {exportType === "employee" && (
        <div className="space-y-2">
          <Label htmlFor="employee-select">Выберите сотрудника</Label>
          <Select 
            value={selectedEmployee} 
            onValueChange={setSelectedEmployee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите сотрудника" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(employees).map((id) => (
                <SelectItem key={id} value={id}>
                  {`Сотрудник ${id.substring(0, 5)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {exportType === "project" && (
        <div className="space-y-2">
          <Label htmlFor="project-select">Выберите проект</Label>
          <Select 
            value={selectedProject} 
            onValueChange={setSelectedProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите проект" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Период отчета</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date-from" className="text-xs mb-1 block">От</Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="date-to" className="text-xs mb-1 block">До</Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          className="w-full"
          onClick={handleExport}
          disabled={isExportDisabled()}
        >
          {isLoading ? "Экспорт..." : "Экспортировать отчет"}
        </Button>
      </div>
      
      <Card className="p-4 bg-slate-50">
        <h3 className="font-medium mb-2">Информация об отчетах:</h3>
        <p className="text-sm text-slate-700">
          Отчеты экспортируются в формате Excel (.xlsx) и содержат детальную информацию о проектах,
          задачах, назначенных исполнителях, сроках выполнения и текущем прогрессе.
        </p>
      </Card>
    </div>
  );
};

export default ProjectExport;
