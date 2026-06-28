import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db.ts';
import taskRoutes from './server/routes/taskRoutes.ts';

dotenv.config();

const app = express();
const PORT = 3000;

// Debug middleware to add custom header
app.use((req, res, next) => {
  res.setHeader('x-backend', 'express-mern');
  next();
});

app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// API Routes
app.use('/api', taskRoutes);

// Server starter function (handles dev Vite middleware and production build fallback)
async function startServer() {
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
    console.log(`MERN TaskTracker backend running on http://localhost:${PORT}`);
  });
}

startServer();
