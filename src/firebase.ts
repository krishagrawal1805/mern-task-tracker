import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { Task } from './types';

// Configuration loaded from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCeNRBqV8M4X5GefZkzNKzc93U8es4Zqew",
  authDomain: "dazzling-voltage-mtsmh.firebaseapp.com",
  projectId: "dazzling-voltage-mtsmh",
  storageBucket: "dazzling-voltage-mtsmh.firebasestorage.app",
  messagingSenderId: "789998623839",
  appId: "1:789998623839:web:c6c4ddb9223a8fda650fea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the custom database ID
export const db = getFirestore(app, "ai-studio-tasktracker-f857e299-0a04-44c9-8eb8-d712146c396c");

// DB Collection helper
const TASKS_COLLECTION = 'tasks';

// 1. Fetch tasks once (for fallback or initial loads)
export async function fetchTasksFromFirestore(): Promise<Task[]> {
  try {
    const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      tasks.push({
        id: docSnapshot.id,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || '',
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks from Firestore:', error);
    throw error;
  }
}

// 2. Real-time tasks subscription
export function subscribeTasks(onUpdate: (tasks: Task[]) => void) {
  const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      tasks.push({
        id: docSnapshot.id,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || '',
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    onUpdate(tasks);
  }, (error) => {
    console.error('Error in Firestore subscription:', error);
  });
}

// 3. Save or Update task
export async function saveTaskToFirestore(task: Task): Promise<void> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, task.id);
    await setDoc(docRef, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: task.createdAt
    }, { merge: true });
  } catch (error) {
    console.error('Error saving task to Firestore:', error);
    throw error;
  }
}

// 4. Delete task
export async function deleteTaskFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting task from Firestore:', error);
    throw error;
  }
}
