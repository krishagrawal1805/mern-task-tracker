import { Request, Response } from 'express';
import { getIsConnected, getDBStatusInfo } from '../config/db.ts';
import { TaskModel, inMemoryTasks, formatMongoTask, ITask, SAMPLE_TASKS } from '../models/Task.ts';

// 1. Get database connectivity status
export const getDBStatus = (req: Request, res: Response) => {
  res.json(getDBStatusInfo());
};

// 2. Read all tasks (with automatic seeding if empty)
export const getTasks = async (req: Request, res: Response) => {
  try {
    if (getIsConnected()) {
      const count = await TaskModel.countDocuments();
      if (count === 0) {
        console.log('MongoDB Atlas is empty. Auto-seeding 6 sample tasks...');
        await TaskModel.insertMany(SAMPLE_TASKS);
      }
      const dbTasks = await TaskModel.find().sort({ createdAt: -1 });
      res.json(dbTasks.map(formatMongoTask));
    } else {
      res.json([...inMemoryTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve tasks', message: error.message });
  }
};

// 3. Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    // Server-side validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTaskData = {
      title: title.trim(),
      description: description || '',
      status: 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || '',
      createdAt: new Date().toISOString()
    };

    if (getIsConnected()) {
      const createdTask = await TaskModel.create(newTaskData);
      res.status(201).json(formatMongoTask(createdTask));
    } else {
      const inMemoryNewTask: ITask = {
        id: `task-${Date.now()}`,
        ...newTaskData as any
      };
      inMemoryTasks.unshift(inMemoryNewTask);
      res.status(201).json(inMemoryNewTask);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create task', message: error.message });
  }
};

// 4. Update an existing task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (getIsConnected()) {
      const updated = await TaskModel.findByIdAndUpdate(
        id,
        { title, description, status, priority, dueDate },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(formatMongoTask(updated));
    } else {
      const index = inMemoryTasks.findIndex((t) => t.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      const updatedTask = {
        ...inMemoryTasks[index],
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
      };
      
      inMemoryTasks[index] = updatedTask as ITask;
      res.json(updatedTask);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update task', message: error.message });
  }
};

// 5. Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await TaskModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', id });
    } else {
      const index = inMemoryTasks.findIndex((t) => t.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }
      inMemoryTasks.splice(index, 1);
      res.json({ message: 'Task deleted successfully', id });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete task', message: error.message });
  }
};
