# TaskTracker

TaskTracker is an elegant, corporate modernism dashboard for tracking project milestones and tasks. Built with React, TypeScript, Tailwind CSS, and Firebase Firestore for durable real-time cloud data synchronization.

## Features

- **Real-Time Synchronization**: Instant updates across clients powered by Google Firebase Firestore.
- **Corporate Modernism Design**: A clean, balanced "Efficient Flow" design system featuring high-contrast typography, refined custom spacing, and fluid animations.
- **Task Management**: Create, edit, search, filter (Pending/Completed), and sort tasks by Date Created, Priority, or Due Date.
- **Offline / Local Fallback**: Seamless offline experience with localStorage cache backing.
- **Loading skeleton simulations**: Sleek skeleton templates to match highly responsive professional dashboards.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Database**: Firebase Firestore
- **Animations**: Motion (formerly Framer Motion)

## Getting Started

Follow these steps to run TaskTracker on your local machine or deploy it to your own infrastructure.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd TaskTracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory or configure your system environment variables. Reference the `.env.example` file:
   ```env
   # Example environment variables
   GEMINI_API_KEY="your-gemini-key"
   APP_URL="http://localhost:3000"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to the URL displayed in your terminal (usually `http://localhost:3000` or `http://localhost:5173`).

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Exporting from Google AI Studio

If you built this inside Google AI Studio, you can easily export it:
1. Open the **Settings Menu** (gear icon) in the top right of the Google AI Studio build page.
2. Select **Export to GitHub** or **Download ZIP**.
3. Share the GitHub repository link with your colleagues, friends, or stakeholders!

---
© 2026 TaskTracker Production. Licensed under Apache-2.0.
