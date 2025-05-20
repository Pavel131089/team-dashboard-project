
import React from "react";
import { TaskFormData } from "@/components/tasks/TaskFormUtils";
import TaskNameField from "@/components/tasks/form-fields/TaskNameField";
import TaskDescriptionField from "@/components/tasks/form-fields/TaskDescriptionField";
import TaskAssigneesField from "@/components/tasks/form-fields/TaskAssigneesField";
import TaskMetadataFields from "@/components/tasks/form-fields/TaskMetadataFields";
import TaskDateFields from "@/components/tasks/form-fields/TaskDateFields";
import TaskProgressField from "@/components/tasks/form-fields/TaskProgressField";

interface DialogFormContentProps {
  formData: TaskFormData;
  assigneeInput: string;
  isReadOnly: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Компонент содержимого формы диалога редактирования задачи
 */
const DialogFormContent: React.FC<DialogFormContentProps> = ({
  formData,
  assigneeInput,
  isReadOnly,
  onInputChange
}) => {
  return (
    <div className="grid gap-4 py-4">
      <TaskNameField 
        value={formData.name || ""} 
        onChange={onInputChange}
        disabled={isReadOnly}
      />
      
      <TaskDescriptionField 
        value={formData.description || ""} 
        onChange={onInputChange}
        disabled={isReadOnly}
      />
      
      <TaskAssigneesField
        value={assigneeInput}
        onChange={onInputChange}
        disabled={isReadOnly}
      />
      
      <TaskMetadataFields 
        price={formData.price} 
        estimatedTime={formData.estimatedTime}
        onChange={onInputChange}
        disabled={isReadOnly}
      />
      
      <TaskDateFields 
        startDate={formData.startDate}
        endDate={formData.endDate}
        onChange={onInputChange}
        disabled={isReadOnly}
      />
      
      <TaskProgressField 
        progress={formData.progress || 0}
        onChange={onInputChange}
        disabled={isReadOnly}
      />
    </div>
  );
};

export default DialogFormContent;
