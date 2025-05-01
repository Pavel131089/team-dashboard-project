
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface DeleteConfirmationDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
  triggerElement?: React.ReactNode;
}

}

const DeleteConfirmationDialog = ({
  title,
  description,
  onConfirm,
  isOpen,
  onClose,
  triggerElement
}: DeleteConfirmationDialogProps) => {
  return (
    <>
      {triggerElement && (
        <AlertDialogTrigger asChild>
          {triggerElement}
        </AlertDialogTrigger>
      )}
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteConfirmationDialog;
