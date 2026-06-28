import { Task } from './types';

// API Client for the Express + MongoDB backend

export interface DBStatus {
  connected: boolean;
  type: string;
  uriDefined: boolean;
  errorMessage?: string | null;
}

export async function getDBStatus(): Promise<DBStatus> {
  try {
    const res = await fetch('/api/db-status');
    if (!res.ok) {
      throw new Error(`Failed to fetch DB status: Status ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response from DB status API (likely server is starting up)');
    }
    return await res.json();
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
    const res = await fetch('/api/tasks');
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: Status ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response from tasks API (likely server is starting up)');
    }
    return await res.json();
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
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create task');
    }
    throw new Error('Server returned an invalid response.');
  }
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned an invalid JSON response.');
  }
  return await res.json();
}

export async function updateTask(
  id: string,
  taskData: Partial<Task>
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update task');
    }
    throw new Error('Server returned an invalid response.');
  }
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned an invalid JSON response.');
  }
  return await res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to delete task');
    }
    throw new Error('Server returned an invalid response.');
  }
}
