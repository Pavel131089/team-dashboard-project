
import { useState } from "react";
import { Project } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import ExportTypeSelector from "./export/ExportTypeSelector";
import ExportFilterForm from "./export/ExportFilterForm";
import ExportInformation from "./export/ExportInformation";
import { processExportData, generateCsvContent } from "./export/exportUtils";

interface ProjectExportProps {
  projects: Project[];
}

const ProjectExport = ({ projects }: ProjectExportProps) => {
  const [exportType, setExportType] = useState<"all" | "employee" | "project">("all");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Собираем уникальных сотрудников из всех задач
  const employees = new Set<string>();
  projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.assignedTo) {
        if (Array.isArray(task.assignedTo)) {
          task.assignedTo.forEach(emp => employees.add(emp));
        } else {
          employees.add(task.assignedTo);
        }
      }
    });
  });

  const handleExport = () => {
    setIsLoading(true);
    
    try {
      // Получение и форматирование данных для экспорта
      const dataToExport = processExportData(
        projects, 
        exportType, 
        selectedProject, 
        selectedEmployee, 
        dateFrom, 
        dateTo
      );

      // Формируем и скачиваем CSV файл
      const csvContent = generateCsvContent(dataToExport);
      
      // Создаем ссылку для скачивания
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      link.setAttribute("download", `project-report-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Экспорт завершен",
        description: "Отчет успешно скачан",
      });
    } catch (error) {
      console.error("Ошибка при экспорте:", error);
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
      <ExportTypeSelector 
        exportType={exportType}
        onExportTypeChange={(value) => setExportType(value as "all" | "employee" | "project")}
      />
      
      <ExportFilterForm
        exportType={exportType}
        selectedProject={selectedProject}
        selectedEmployee={selectedEmployee}
        dateFrom={dateFrom}
        dateTo={dateTo}
        projects={projects}
        employees={Array.from(employees)}
        onSelectProject={setSelectedProject}
        onSelectEmployee={setSelectedEmployee}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
      
      <div className="pt-2">
        <button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-50"
          onClick={handleExport}
          disabled={isExportDisabled()}
        >
          {isLoading ? "Экспорт..." : "Экспортировать отчет"}
        </button>
      </div>
      
      <ExportInformation />
    </div>
  );
};

export default ProjectExport;
