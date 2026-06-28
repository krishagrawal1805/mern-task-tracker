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

// In-memory fallback database and sample seeds
export const SAMPLE_TASKS = [
  {
    title: 'Complete MERN Internship Assignment',
    description: 'Ensure the project satisfies all functional requirements: React frontend, Express backend, MongoDB Atlas with Mongoose, form validation, sorting/filtering, and responsive layout.',
    status: 'pending' as const,
    priority: 'high' as const,
    dueDate: '2026-06-30',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
  },
  {
    title: 'Update Resume and LinkedIn Profile',
    description: 'Add the completed full-stack Task Tracker to the projects list and highlight MERN, TypeScript, Tailwind CSS, and Axios proficiency.',
    status: 'completed' as const,
    priority: 'medium' as const,
    dueDate: '2026-06-28',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 24 hours ago
  },
  {
    title: 'Deploy Application to Render',
    description: 'Configure MongoDB Atlas cloud environment variables, set up cross-origin headers, and publish the bundled CommonJS backend on Render.',
    status: 'completed' as const,
    priority: 'high' as const,
    dueDate: '2026-06-27',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString() // 48 hours ago
  },
  {
    title: 'Prepare for Technical Interview',
    description: 'Review core backend fundamentals including event loops, Express routing, REST constraints, and MongoDB database query indexing.',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: '2026-07-02',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    title: 'Practice Data Structures Problems',
    description: 'Solve daily algorithms on hashing, two-pointers, and sorting to maintain high level problem-solving speeds.',
    status: 'pending' as const,
    priority: 'low' as const,
    dueDate: '2026-07-03',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString() // 1 hour ago
  },
  {
    title: 'Review REST API Documentation',
    description: 'Test all CRUD and connection status endpoints using automated diagnostics to verify response schemas and status codes.',
    status: 'completed' as const,
    priority: 'low' as const,
    dueDate: '2026-06-25',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString() // 4 days ago
  }
];

export let inMemoryTasks: ITask[] = SAMPLE_TASKS.map((task, index) => ({
  id: `task-${index + 1}`,
  ...task
}));

export const formatMongoTask = (doc: any): ITask => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  status: doc.status,
  priority: doc.priority,
  dueDate: doc.dueDate,
  createdAt: doc.createdAt
});
