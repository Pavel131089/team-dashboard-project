
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";

interface ExportFilterFormProps {
  exportType: "all" | "employee" | "project";
  selectedProject: string;
  selectedEmployee: string;
  dateFrom: string;
  dateTo: string;
  projects: Project[];
  employees: string[];
  onSelectProject: (projectId: string) => void;
  onSelectEmployee: (employeeId: string) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
}

const ExportFilterForm: React.FC<ExportFilterFormProps> = ({
  exportType,
  selectedProject,
  selectedEmployee,
  dateFrom,
  dateTo,
  projects,
  employees,
  onSelectProject,
  onSelectEmployee,
  onDateFromChange,
  onDateToChange
}) => {
  return (
    <>
      {exportType === "employee" && (
        <div className="space-y-2">
          <Label htmlFor="employee-select">Выберите сотрудника</Label>
          <Select 
            value={selectedEmployee} 
            onValueChange={onSelectEmployee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите сотрудника" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((id) => (
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
            onValueChange={onSelectProject}
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
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="date-to" className="text-xs mb-1 block">До</Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportFilterForm;
