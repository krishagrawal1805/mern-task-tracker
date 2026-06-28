# MERN Stack Task Tracker

A full-stack Task Management application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application utilizes a Mongoose ORM for structured database communication, an Axios-based HTTP client for frontend-backend integration, and a responsive Tailwind CSS interface.

To ensure continuous operation during developer testing, the backend features a dual-mode database connector that pairs with a remote MongoDB Atlas database while providing a server-side, in-memory collection fallback if the database environment variables are not supplied.

---

## 🚀 Features

- **Full CRUD Operations**: Implementations for creating, reading, updating, and deleting tasks.
- **Dynamic Task Filtering**: Filter tasks in real-time by status (All, Pending, Completed, Archived).
- **Multi-Criteria Sorting**: Sort active task views by creation date, due date, or priority level.
- **Search System**: Instantly query tasks by title or description using client-side fuzzy searching.
- **Connection Status Dashboard**: Direct, visual connection indicators displaying active MongoDB Atlas synchronization states.
- **Toast Notifications**: Interactive state alerts indicating API actions, errors, and task adjustments.
- **Responsive Layout**: Fluid UI optimized for desktop monitors, tablet screens, and mobile displays.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (bundler and local dev proxy)
- **HTTP Client**: Axios (configured with standardized instance headers)
- **Styling**: Tailwind CSS v4 (fully responsive utility design)
- **Icons**: Lucide React
- **Animations**: `motion` (micro-transitions and entry-stagger layout)

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database ORM**: Mongoose
- **Cross-Origin Configuration**: Cors middleware
- **Compilation**: esbuild (compiles and bundles the TypeScript backend into a single CommonJS server asset)

### Database
- **Primary Datastore**: MongoDB Atlas (Cloud Database)

---

## 📂 Project Architecture

The codebase utilizes a clean separation of concerns, housing the backend modules in `/server` and the frontend application in `/src`, served via a single entry point:

```text
├── server/                     # Backend Source Code
│   ├── config/                 # Database connection & credentials
│   │   └── db.ts
│   ├── controllers/            # Controller handlers for REST endpoints
│   │   └── taskController.ts
│   ├── models/                 # Database schemas & TypeScript interfaces
│   │   └── Task.ts
│   └── routes/                 # Express REST endpoint routing
│       └── taskRoutes.ts
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI components
│   │   ├── SideNavBar.tsx      # Sidebar navigation
│   │   ├── TopNavBar.tsx       # Header with DB status & search bar
│   │   ├── TaskCard.tsx        # Task display card
│   │   ├── TaskModal.tsx       # Creator/Editor modal dialog
│   │   └── Toast.tsx           # Float-alert alert system
│   ├── api.ts                  # Axios client module (queries the Express endpoints)
│   ├── App.tsx                 # Core state coordinator & overall layout
│   ├── index.css               # Global styling entry point with Tailwind imports
│   ├── main.tsx                # React browser mount point
│   └── types.ts                # Shared TypeScript definitions
├── server.ts                   # Express server entry point and Vite proxy loader
├── package.json                # Project script registry & dependencies
└── tsconfig.json               # TypeScript compiler config
```

---

## ⚙️ Environment Variables

Copy the provided `.env.example` file to a new file named `.env` in the root directory:

```env
# MongoDB Atlas Database URI
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb?retryWrites=true&w=majority"
```

---

## 🛰️ REST API Documentation

All request endpoints are registered under the `/api` route prefix.

### 1. Retrieve Database Status
- **Endpoint**: `GET /api/db-status`
- **Output (200 OK)**:
  ```json
  {
    "connected": true,
    "type": "MongoDB Cloud",
    "uriDefined": true,
    "errorMessage": null
  }
  ```

### 2. Retrieve All Tasks
- **Endpoint**: `GET /api/tasks`
- **Output (200 OK)**:
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

### 3. Create a Task
- **Endpoint**: `POST /api/tasks`
- **Payload**:
  ```json
  {
    "title": "Database Schema Audit",
    "description": "Verify indexes and constraints in MongoDB collections",
    "priority": "high",         // Allowed: 'low' | 'medium' | 'high'
    "dueDate": "2026-06-30"     // Format: YYYY-MM-DD
  }
  ```
- **Output (201 Created)**: Returns the newly saved task object.

### 4. Update a Task
- **Endpoint**: `PUT /api/tasks/:id`
- **Payload**: Supports partial key/value updates (`title`, `description`, `status`, `priority`, `dueDate`).
- **Output (200 OK)**: Returns the updated task object.

### 5. Delete a Task
- **Endpoint**: `DELETE /api/tasks/:id`
- **Output (200 OK)**:
  ```json
  {
    "message": "Task deleted successfully",
    "id": "6a40fef9d08c08beff393d18"
  }
  ```

---

## 🛠️ Installation and Local Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed.

### 2. Clone and Install
```bash
# Extract or clone the codebase
cd TaskTracker

# Install dependencies
npm install
```

### 3. Define local environment variables
Create a `.env` file in the root directory and supply your MongoDB Atlas Connection String (`MONGODB_URI`).

### 4. Boot Dev Server
```bash
npm run dev
```
The Express server boots on port `3000`, running the API backend and proxying frontend client traffic using embedded Vite middleware at `http://localhost:3000`.

---

## 🚀 Production Build and Deployment

### 1. Compile Assets
```bash
npm run build
```
This single build command compiles the React web assets into static distribution files inside `/dist`, and bundles the Express server file (`server.ts`) into a standalone CommonJS file at `/dist/server.cjs`.

### 2. Run Production Server
```bash
npm run start
```
This command serves the React SPA statically and powers the REST API routes.

### 3. Container Deployment (Docker)
This project contains no runtime dependencies on development tools and is ready for container deployments:
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

---

## 🖼️ Application Screenshots

### Desktop Main Dashboard
*(Placeholder for Desktop Main Dashboard: Shows full grid with stats counters, search bars, filter side navigation, and responsive task lists).*

### Mobile Task View
*(Placeholder for Mobile Responsive View: Displays stack layouts, bottom sheets, drawer transitions, and responsive grid optimization).*
