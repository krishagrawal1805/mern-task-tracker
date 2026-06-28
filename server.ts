import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Debug middleware to add custom header
app.use((req, res, next) => {
  res.setHeader('x-backend', 'express-mern');
  next();
});

app.use(express.json());

// MongoDB connection setup
const MONGODB_URI = process.env.MONGODB_URI;
let isMongoDBConnected = false;
let dbErrorMessage: string | null = null;

if (MONGODB_URI) {
  console.log('Connecting to MongoDB...');
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB.');
      isMongoDBConnected = true;
      dbErrorMessage = null;
    })
    .catch((err) => {
      dbErrorMessage = err.message || 'Unknown database connection error';
      console.error('Error connecting to MongoDB:', dbErrorMessage);
      console.log('Falling back to local server-side in-memory store.');
    });
} else {
  dbErrorMessage = 'MONGODB_URI is not configured in environment variables.';
  console.warn('WARNING: MONGODB_URI environment variable is not defined.');
  console.log('Running TaskTracker with server-side in-memory fallback. (Real REST API is active)');
}

// Mongoose schema and model
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'completed', 'archived'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

// Avoid OverwriteModelError in case of hot-reloads
const TaskModel = (mongoose.models.Task || mongoose.model('Task', TaskSchema)) as mongoose.Model<any>;

// In-memory fallback database
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

let inMemoryTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review Design Prototype',
    description: 'Coordinate with the UI team to finalize the design tokens and accessibility contrast ratios for the mobile dashboard...',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-29',
    createdAt: '2026-06-28T00:19:33-07:00',
  },
  {
    id: 'task-2',
    title: 'API Documentation Draft',
    description: 'Complete the Swagger documentation for the authentication endpoints and task CRUD operations.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-06-28',
    createdAt: '2026-06-27T21:19:33-07:00',
  },
  {
    id: 'task-3',
    title: 'Q4 Infrastructure Audit',
    description: 'Review cloud resource allocation and optimize serverless function execution times for the production environment.',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-07-01',
    createdAt: '2026-06-27T02:19:33-07:00',
  },
];

// Helper to convert mongoose document to Task type
const formatMongoTask = (doc: any): Task => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  status: doc.status,
  priority: doc.priority,
  dueDate: doc.dueDate,
  createdAt: doc.createdAt
});

// REST API Endpoints

// 1. Get database connectivity status
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: isMongoDBConnected && mongoose.connection.readyState === 1,
    type: isMongoDBConnected ? 'MongoDB Cloud' : 'In-Memory Server-Side Fallback',
    uriDefined: !!MONGODB_URI,
    errorMessage: dbErrorMessage
  });
});

// 2. Read all tasks (GET /api/tasks)
app.get('/api/tasks', async (req, res) => {
  try {
    if (isMongoDBConnected && mongoose.connection.readyState === 1) {
      const dbTasks = await TaskModel.find().sort({ createdAt: -1 });
      res.json(dbTasks.map(formatMongoTask));
    } else {
      res.json([...inMemoryTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve tasks', message: error.message });
  }
});

// 3. Create a new task (POST /api/tasks)
app.post('/api/tasks', async (req, res) => {
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

    if (isMongoDBConnected && mongoose.connection.readyState === 1) {
      const createdTask = await TaskModel.create(newTaskData);
      res.status(201).json(formatMongoTask(createdTask));
    } else {
      const inMemoryNewTask: Task = {
        id: `task-${Date.now()}`,
        ...newTaskData as any
      };
      inMemoryTasks.unshift(inMemoryNewTask);
      res.status(201).json(inMemoryNewTask);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create task', message: error.message });
  }
});

// 4. Update an existing task (PUT /api/tasks/:id)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (isMongoDBConnected && mongoose.connection.readyState === 1) {
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
      
      inMemoryTasks[index] = updatedTask;
      res.json(updatedTask);
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update task', message: error.message });
  }
});

// 5. Delete a task (DELETE /api/tasks/:id)
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected && mongoose.connection.readyState === 1) {
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
});

async function startServer() {
  // Vite dev middleware for assets compiling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TaskTracker full-stack backend running on port ${PORT}`);
  });
}

startServer();
