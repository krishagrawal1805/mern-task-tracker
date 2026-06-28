import express from 'express';
import {
  getDBStatus,
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.ts';

const router = express.Router();

router.get('/db-status', getDBStatus);
router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
