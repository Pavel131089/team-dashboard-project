// Типы данных для проектов и задач

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "manager" | "employee";
}

// Интерфейс для комментария к задаче
export interface TaskComment {
  id: string;
  text: string;
  author: string;
  date: string;
}

// Интерфейс для задачи проекта
export interface Task {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedTime: number;
  startDate: string;
  endDate: string;
  assignedTo: string;
  assignedToNames: string[];
  progress: number;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  comments?: TaskComment[];
}

// Интерфейс для проекта
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  updatedAt?: string;
}
