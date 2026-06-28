# MERN Stack Task Tracker

A full-stack Task Tracker web application built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. The application allows users to create, manage, update, and delete tasks through a responsive interface while communicating with a RESTful backend API connected to MongoDB Atlas.

---

## 🌐 Live Demo

**Application:** https://mern-task-trackerddd.onrender.com

## 📁 GitHub Repository

**Repository:** https://github.com/krishagrawal1805/mern-task-tracker

---

## ✨ Features

* Create, Read, Update and Delete (CRUD) tasks
* Form validation
* RESTful API using Express.js
* MongoDB Atlas integration using Mongoose
* Dynamic UI updates without page refresh
* Responsive design for desktop and mobile
* Search tasks by title or description
* Filter tasks by status
* Sort tasks by creation date, due date, or priority
* Toast notifications for task operations
* Modular and reusable React components

---

## 🛠️ Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide React
* Motion

### Backend

* Node.js
* Express.js
* Mongoose
* MongoDB Atlas
* dotenv
* CORS

---

## 📂 Project Structure

```text
server/
├── config/
│   └── db.ts
├── controllers/
│   └── taskController.ts
├── models/
│   └── Task.ts
├── routes/
│   └── taskRoutes.ts

src/
├── components/
│   ├── SideNavBar.tsx
│   ├── TopNavBar.tsx
│   ├── TaskCard.tsx
│   ├── TaskModal.tsx
│   └── Toast.tsx
├── api.ts
├── App.tsx
├── index.css
├── main.tsx
└── types.ts

server.ts
package.json
tsconfig.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
```

---

## 📡 REST API

### Get Database Status

```http
GET /api/db-status
```

Returns the current MongoDB connection status.

---

### Get All Tasks

```http
GET /api/tasks
```

Returns all tasks.

---

### Create Task

```http
POST /api/tasks
```

Example Request:

```json
{
  "title": "Complete Assignment",
  "description": "Finish MERN Task Tracker",
  "priority": "high",
  "dueDate": "2026-06-30"
}
```

Response:

**201 Created**

---

### Update Task

```http
PUT /api/tasks/:id
```

Updates an existing task.

---

### Delete Task

```http
DELETE /api/tasks/:id
```

Deletes the selected task.

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone https://github.com/krishagrawal1805/mern-task-tracker.git

cd mern-task-tracker
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and add your MongoDB Atlas connection string.

### Run Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## 📦 Production Build

Build the application:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

---

## ☁️ Deployment

The application is deployed on **Render**.

* Frontend and backend are served from a single Express application.
* MongoDB Atlas is used as the production database.
* Environment variables are configured through Render.

---

## 📸 Screenshots

Add screenshots of the application here before submitting if possible.

Example:

* Dashboard
* Create Task Modal
* Mobile View

---

## 📄 License

This project was developed as part of a **Full Stack Developer Internship Technical Assignment**.
