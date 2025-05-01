
import React from "react";
import DeleteConfirmationDialog from "@/components/ui/delete-confirmation-dialog";

interface ProjectDialogsProps {
  isDeleteProjectDialogOpen: boolean;
  isDeleteTaskDialogOpen: boolean;
  onCloseProjectDialog: () => void;
  onCloseTaskDialog: () => void;
  onConfirmDeleteProject: () => void;
  onConfirmDeleteTask: () => void;
}

const ProjectDialogs: React.FC<ProjectDialogsProps> = ({
  isDeleteProjectDialogOpen,
  isDeleteTaskDialogOpen,
  onCloseProjectDialog,
  onCloseTaskDialog,
  onConfirmDeleteProject,
  onConfirmDeleteTask
}) => {
  return (
    <>
      {/* Диалог подтверждения удаления проекта */}
      <DeleteConfirmationDialog
        isOpen={isDeleteProjectDialogOpen}
        onClose={onCloseProjectDialog}
        onConfirm={onConfirmDeleteProject}
        title="Удалить проект"
        description="Вы уверены, что хотите удалить проект? Это действие нельзя отменить. Все задачи, связанные с этим проектом, также будут удалены."
      />

      {/* Диалог подтверждения удаления задачи */}
      <DeleteConfirmationDialog
        isOpen={isDeleteTaskDialogOpen}
        onClose={onCloseTaskDialog}
        onConfirm={onConfirmDeleteTask}
        title="Удалить задачу"
        description="Вы уверены, что хотите удалить задачу? Это действие нельзя отменить."
      />
    </>
  );
};

export default ProjectDialogs;
