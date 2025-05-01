
export interface Task {
  id: string;
  name: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  price: number;
  estimatedTime: number;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  assignedTo: string[] | null;
  assignedToNames?: string[];
  actualStartDate: string | null;
  actualEndDate: string | null;
  comments?: string[];
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
