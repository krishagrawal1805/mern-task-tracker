import mongoose from 'mongoose';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'completed', 'archived'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

export const TaskModel = (mongoose.models.Task || mongoose.model('Task', TaskSchema)) as mongoose.Model<any>;

// In-memory fallback database
export let inMemoryTasks: ITask[] = [
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

export const formatMongoTask = (doc: any): ITask => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  status: doc.status,
  priority: doc.priority,
  dueDate: doc.dueDate,
  createdAt: doc.createdAt
});
