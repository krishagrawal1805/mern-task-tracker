import axios from 'axios';
import { Task } from './types';

// API Client for the Express + MongoDB backend using Axios

export interface DBStatus {
  connected: boolean;
  type: string;
  uriDefined: boolean;
  errorMessage?: string | null;
}

// Set up default axios instance with standard configuration
const api = axios.create({
  baseURL: '', // Relative paths are handled by the Vite server proxying to port 3000
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getDBStatus(): Promise<DBStatus> {
  try {
    const res = await api.get<DBStatus>('/api/db-status');
    return res.data;
  } catch (error: any) {
    console.warn('DB Status API temporary warning:', error.message || error);
    return {
      connected: false,
      type: 'Starting...',
      uriDefined: false
    };
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await api.get<Task[]>('/api/tasks');
    return res.data;
  } catch (error: any) {
    console.warn('Tasks API temporary warning:', error.message || error);
    return [];
  }
}

export async function createTask(taskData: {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}): Promise<Task> {
  try {
    const res = await api.post<Task>('/api/tasks', taskData);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to create task');
  }
}

export async function updateTask(
  id: string,
  taskData: Partial<Task>
): Promise<Task> {
  try {
    const res = await api.put<Task>(`/api/tasks/${id}`, taskData);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to update task');
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await api.delete(`/api/tasks/${id}`);
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Failed to delete task');
  }
}
