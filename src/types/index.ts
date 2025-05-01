
export interface User {
  id: string;
  name: string;
  role: 'manager' | 'employee';
  email: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  price: number;
  estimatedTime: number; // в часах
  startDate: string;
  endDate: string;
  completionPercentage: number;
  assignedTo?: string; // ID сотрудника
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}
