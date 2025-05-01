
export interface Task {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  startDate: string | null;
  endDate: string | null;


  progress: number;

  assignedTo: string | string[] | null; // ID сотрудника или массив ID для нескольких исполнителей
  assignedToNames?: string[]; // Имена назначенных сотрудников
  actualStartDate: string | null;
  actualEndDate: string | null;
  comments?: string[]; // Комментарии к задаче
  assignedToNames?: string[]; // Имена назначенных сотрудников
  actualStartDate: string | null;
  actualEndDate: string | null;


}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  role: "manager" | "employee";
  isAuthenticated: boolean;
}

export type ProjectsState = {
  projects: Project[];
  loading: boolean;
  error: string | null;
};
