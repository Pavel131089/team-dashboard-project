
// Типы данных для проектов и задач

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'manager' | 'employee';
}

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: string; // формат "YYYY-MM-DD"
  endDate: string; // формат "YYYY-MM-DD"
  actualStartDate: string | null; // формат "YYYY-MM-DD"
  actualEndDate: string | null; // формат "YYYY-MM-DD"
  estimatedTime: number; // в часах
  price: number; // в рублях
  progress: number; // процент выполнения от 0 до 100
  assignedTo: string | string[]; // ID пользователя или массив ID
  assignedToNames: string[]; // имена пользователей
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  manager: string;
  startDate: string; // формат "YYYY-MM-DD"
  endDate: string; // формат "YYYY-MM-DD"
  budget: number;
  tasks: Task[];
  createdAt: string; // ISO формат даты
  updatedAt: string; // ISO формат даты
}
