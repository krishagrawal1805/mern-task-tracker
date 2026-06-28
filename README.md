# MERN TaskTracker

A professional-grade, high-performance **MERN Stack** (MongoDB, Express.js, React, Node.js) Task Tracker featuring an elegant corporate design system, RESTful APIs, key metric visualizers, priority/date sorting, full text search, and live database connectivity status monitoring.

The application connects to a **MongoDB Atlas** cloud database (configured via environment variables) and features a graceful server-side in-memory backup system to ensure the app remains fully functional and testable at all times.

---

## 🎨 Design Philosophy
Inspired by modern clean aesthetics and professional density, TaskTracker features:
- **Refined Color Palette**: A dark, eye-safe theme featuring high contrast typography, deep charcoal backgrounds, and deep teal primary accents.
- **Micro-Animations**: Staggered transition entries and clean hover feedbacks powered by `motion`.
- **Responsive Layout**: Designed first for desktop precision and optimized with Tailwind's fluid responsive breakpoints for mobile screens.

---

## 🛠️ Tech Stack

### Backend (Node.js & Express)
- **Framework**: Express.js with TypeScript support (`tsx` runtime for seamless local execution)
- **Database ORM**: Mongoose for structured schema enforcement and robust MongoDB Atlas transactions
- **Compilation**: Bundled into a clean, standalone, high-performance CJS file (`dist/server.cjs`) with `esbuild` for instant startup speeds.

### Frontend (React & Vite)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide React icons
- **Animations**: `motion` (formerly Framer Motion)

---

## 📂 Architecture & Directory Layout

```text
├── server/                     # Backend Source Code
│   ├── config/                 # Configuration (Database connection, dotenv setup)
│   │   └── db.ts
│   ├── controllers/            # Controller handlers for REST endpoints
│   │   └── taskController.ts
│   ├── models/                 # Database Schema definitions & interfaces
│   │   └── Task.ts
│   └── routes/                 # Express REST endpoint routing
│       └── taskRoutes.ts
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI Components
│   │   ├── SideNavBar.tsx      # Sidebar filter navigator
│   │   ├── TopNavBar.tsx       # Header with DB connection indicators and Search
│   │   ├── TaskCard.tsx        # Individual task item with priority color codes
│   │   ├── TaskModal.tsx       # Interactive task creation and editing popup
│   │   └── Toast.tsx           # Floating alert notification center
│   ├── api.ts                  # Central API client module (makes fetch requests to /api/*)
│   ├── App.tsx                 # Main layout and client state manager
│   ├── index.css               # Global styling entry point with Tailwind imports
│   ├── main.tsx                # React browser entry point
│   └── types.ts                # Shared TypeScript definitions
├── server.ts                   # Main Express application entry point & dev server proxy
├── package.json                # Project dependencies and deployment scripts
└── tsconfig.json               # TypeScript compiler rules
```

---

## 🛰️ REST API Documentation

All routes are prefix-scoped with `/api`.

### 1. Database Status
- **Endpoint**: `GET /api/db-status`
- **Description**: Returns the real-time status of the MongoDB Atlas connection.
- **Success Response (200 OK)**:
  ```json
  {
    "connected": true,
    "type": "MongoDB Cloud",
    "uriDefined": true,
    "errorMessage": null
  }
  ```

### 2. Task Collection Operations
- **Endpoint**: `GET /api/tasks`
- **Description**: Retrieves all tasks from the database ordered by creation date (newest first).
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "6a40fef9d08c08beff393d18",
      "title": "Establish MERN Setup",
      "description": "Port database connector logic from Firebase to Mongoose",
      "status": "completed",
      "priority": "high",
      "dueDate": "2026-06-29",
      "createdAt": "2026-06-28T11:01:13.825Z"
    }
  ]
  ```

### 3. Create Task
- **Endpoint**: `POST /api/tasks`
- **Description**: Inserts a new task.
- **Payload**:
  ```json
  {
    "title": "New Milestone Task",
    "description": "Optional details here",
    "priority": "medium",       // 'low' | 'medium' | 'high'
    "dueDate": "2026-07-01"     // YYYY-MM-DD
  }
  ```
- **Success Response (201 Created)**: Returns the newly inserted Task document.

### 4. Update Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Description**: Updates fields of an existing task by its unique ID.
- **Payload**: Supports partial updates (`title`, `description`, `status`, `priority`, `dueDate`).
- **Success Response (200 OK)**: Returns the fully updated Task document.

### 5. Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Description**: Removes the specified task permanently.
- **Success Response (200 OK)**:
  ```json
  { "message": "Task deleted successfully", "id": "6a40fef9d08c08beff393d18" }
  ```

---

## ⚙️ Environment Variables

Copy `.env.example` into a local `.env` file:

```env
# MONGODB_URI: Connection string for your MongoDB database (e.g. MongoDB Atlas cluster)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb?retryWrites=true&w=majority"
```

---

## 🚀 Getting Started Locally

### Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 1. Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd TaskTracker

# Install dependencies
npm install
```

### 2. Configure Environment
Create a `.env` file in the project root and add your MongoDB Atlas Connection String (`MONGODB_URI`).

### 3. Start Development Server
```bash
npm run dev
```
The server starts up dynamically on port `3000` (hosting the Express backend APIs) and mounts the Vite middleware to bundle and serve the frontend assets with hot-reloading at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
This script:
1. Compiles frontend assets into highly optimized static HTML, CSS, and JS files in the `/dist` directory.
2. Compiles and bundles the TypeScript backend server (`server.ts`) into a single standalone CommonJS file at `/dist/server.cjs` with `esbuild`.

### 5. Run Production Build
```bash
npm run start
```
Starts the bundled, high-performance web app directly via Node.js on port `3000`.

---

## 🌐 Production Deployment Steps

To deploy this application to production platforms (such as **Render**, **Heroku**, **AWS**, or **Google Cloud Run**):

1. **Docker Containerization**:
   This project is ready to be containerized using a simple `Dockerfile` pointing to the pre-built application:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY dist/ ./dist/
   ENV NODE_ENV=production
   EXPOSE 3000
   CMD ["node", "dist/server.cjs"]
   ```
2. **Environment Secret Mapping**:
   Configure the production host's Environment Variables to inject `MONGODB_URI` and ensure `NODE_ENV` is set to `production`.

---
© 2026 MERN TaskTracker. All rights reserved.
