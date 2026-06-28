export type TaskStatus = 'pending' | 'completed' | 'archived';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string; // ISO String
}

export type ActiveTab = 'dashboard' | 'all' | 'pending' | 'completed' | 'archive';

export type SortOption = 'date-created' | 'priority' | 'due-date';
