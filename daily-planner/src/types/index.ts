export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  dueDate: string; // ISO date string
  dueTime?: string; // HH:mm format
  priority: Priority;
  completed: boolean;
  reminder?: string; // ISO datetime string
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  search?: string;
  priority?: Priority;
  date?: string;
  completed?: boolean;
}
