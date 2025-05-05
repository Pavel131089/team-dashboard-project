
import { Project, Task } from "@/types/project";

/**
 * Форматирует дату для отображения в CSV
 */
export const formatDate = (date: string | undefined): string => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("ru-RU");
  } catch (e) {
    return date;
  }
};

/**
 * Фильтрует и подготавливает данные для экспорта
 */
export const processExportData = (
  projects: Project[],
  exportType: "all" | "employee" | "project",
  selectedProject: string,
  selectedEmployee: string,
  dateFrom: string,
  dateTo: string
): Project[] => {
  let dataToExport: Project[] = [];
  
  // Фильтрация по типу экспорта
  if (exportType === "all") {
    dataToExport = [...projects];
  } else if (exportType === "project" && selectedProject) {
    const found = projects.find(p => p.id === selectedProject);
    if (found) {
      dataToExport = [found];
    }
  } else if (exportType === "employee" && selectedEmployee) {
    // Фильтруем задачи по сотруднику
    dataToExport = projects.map(project => ({
      ...project,
      tasks: project.tasks.filter(task => {
        if (Array.isArray(task.assignedTo)) {
          return task.assignedTo.includes(selectedEmployee);
        }
        return task.assignedTo === selectedEmployee;
      })
    })).filter(project => project.tasks.length > 0);
  }

  // Применяем фильтр по датам, если указаны
  if (dateFrom || dateTo) {
    dataToExport = dataToExport.map(project => ({
      ...project,
      tasks: project.tasks.filter(task => {
        const taskStartDate = task.startDate ? new Date(task.startDate) : null;
        const taskEndDate = task.endDate ? new Date(task.endDate) : null;
        const filterDateFrom = dateFrom ? new Date(dateFrom) : null;
        const filterDateTo = dateTo ? new Date(dateTo) : null;
        
        if (filterDateFrom && taskStartDate && taskStartDate < filterDateFrom) {
          return false;
        }
        if (filterDateTo && taskEndDate && taskEndDate > filterDateTo) {
          return false;
        }
        return true;
      })
    })).filter(project => project.tasks.length > 0);
  }

  return dataToExport;
};

/**
 * Генерирует CSV контент для экспорта
 */
export const generateCsvContent = (projects: Project[]): string => {
  // Добавляем BOM для корректной кодировки в Excel
  const BOM = "\ufeff";
  
  // Заголовки CSV файла
  const headers = "Проект;Задача;Описание;Стоимость;Время;Прогресс;Исполнитель;Дата начала;Дата окончания\n";
  
  // Формируем строки данных
  const rows = projects.flatMap(project => 
    project.tasks.map(task => {
      const projectName = project.name.replace(/"/g, '""');
      const taskName = task.name.replace(/"/g, '""');
      const taskDesc = (task.description || "").replace(/"/g, '""');
      
      let assignedTo = "";
      if (Array.isArray(task.assignedTo)) {
        assignedTo = task.assignedTo.join(", ");
      } else if (task.assignedToNames && task.assignedToNames.length > 0) {
        assignedTo = task.assignedToNames.join(", ");
      } else if (task.assignedTo) {
        assignedTo = String(task.assignedTo);
      }
      
      return `"${projectName}";"${taskName}";"${taskDesc}";"${task.price || 0}";"${task.estimatedTime || 0}";"${task.progress || 0}%;"${assignedTo}";"${formatDate(task.startDate)}";"${formatDate(task.endDate)}"`;
    })
  ).join('\n');
  
  const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(BOM + headers + rows)}`;
  return csvContent;
};
