
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ExportTypeSelectorProps {
  exportType: "all" | "employee" | "project";
  onExportTypeChange: (value: string) => void;
}

const ExportTypeSelector: React.FC<ExportTypeSelectorProps> = ({ 
  exportType, 
  onExportTypeChange 
}) => {
  return (
    <div className="space-y-3">
      <Label>Тип отчета</Label>
      <RadioGroup 
        value={exportType} 
        onValueChange={onExportTypeChange}
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
  );
};

export default ExportTypeSelector;
