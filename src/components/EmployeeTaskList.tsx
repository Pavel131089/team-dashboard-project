import { Task } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface EmployeeTaskListProps {
  tasks: {project: any, task: Task}[] | Task[];
  userId: string;
  onTaskUpdate?: (projectId: string, task: Task) => void;
}

const EmployeeTaskList = ({ tasks, userId, onTaskUpdate }: EmployeeTaskListProps) => {

  // Фильтрация задач, назначенных этому сотруднику
  const employeeTasks = tasks.map(item => {
    if ('task' in item) {
      return {
        task: item.task,
        project: item.project
      };
    }
    return {
      task: item,
      project: null
    };
  }).filter(({ task }) => {
    if (Array.isArray(task.assignedTo)) {
      return task.assignedTo.includes(userId);
    }
    return task.assignedTo === userId;
  });
  
  const handleDeleteTask = (projectId: string, taskId: string) => {
    if (onTaskUpdate) {
      // Вызываем обработчик с особым флагом для удаления
      const taskToDelete = employeeTasks.find(({ task }) => task.id === taskId)?.task;
      if (taskToDelete && projectId) {
        // Создаем копию задачи с флагом удаления
        const taskWithDeleteFlag = { ...taskToDelete, _deleted: true };
        onTaskUpdate(projectId, taskWithDeleteFlag);
      }
    }
  };

    if (task.projectName) return task.projectName;
    
    // Если задача пришла с проектом в объекте
    if (taskItem.project) {
      return taskItem.project.name || "—";
    }
    
    return "—";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (employeeTasks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-500">Нет назначенных задач для сотрудника</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Задачи сотрудника:</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Проект</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Даты</TableHead>
            <TableHead>Прогресс</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeTasks.map(({ task, project }, index) => (
            <TableRow key={task.id || index}>
              <TableCell className="font-medium">
                <div>{task.name || "—"}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {task.description || "—"}
                </div>
                {task.comments && task.comments.length > 0 && (
                  <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="font-medium text-gray-700 mb-1">Комментарии:</div>
                    <ul className="list-disc pl-4 space-y-1">
                      {task.comments.map((comment, index) => (
                        <li key={index} className="text-gray-600">{comment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {getProjectName(task, { project })}
              </TableCell>
              <TableCell>
                {task.progress === 100 ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Завершено
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    В работе
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  <div>План: {formatDate(task.startDate)} — {formatDate(task.endDate)}</div>
                  {task.actualStartDate && (
                    <div className="mt-1">
                      Факт: {formatDate(task.actualStartDate)} 
                      {task.actualEndDate ? ` — ${formatDate(task.actualEndDate)}` : ""}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-full flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={task.progress || 0} 
                      className="h-2 w-24"
                      indicatorClassName={getProgressColor(task.progress || 0)}
                    />
                    <span className="text-xs">{task.progress || 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={task.progress || 0}
                    onChange={(e) => {
                      if (onTaskUpdate && project) {
                        const updatedTask = {...task, progress: parseInt(e.target.value)};
                        onTaskUpdate(project.id, updatedTask);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTaskList;