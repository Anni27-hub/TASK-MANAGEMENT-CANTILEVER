# TaskForge Task Management Application

A full-stack personal task manager built with a highly responsive, premium React frontend and an Express.js & MongoDB backend secured with JWT authentication and real-time Socket.io support chat.

## Live Demo
You can access the live application here:
[taskforge27.netlify.app](https://taskforge27.netlify.app)

---

## Features

- **User Authentication**: Secure Sign-up, Login, and Sign-out using JSON Web Tokens (JWT) and hashed passwords (bcryptjs).
- **Full CRUD Tasks**: Create, read, update, and delete tasks dynamically.
- **Smart Filtering & Searching**: Filter tasks by status (Pending, In Progress, Completed), category tags (Projects, Meeting, Design), and live search keywords.
- **Dynamic Sorting**: Toggle task sorting order on the fly.
- **Responsive Workspace**: Seamless, tailored layouts for desktop, tablet, and mobile screens.
- **Quick Status Toggle**: Instantly mark tasks as completed/pending using inline checkbox checklist checkmarks.
- **Statistics Dashboard**: Real-time counting cards tracking total, pending, in-progress, and completed tasks.
- **Real-Time Support Chat**: Connects regular users directly to support staff via Socket.io WebSockets.
- **Support Admin Inbox**: Dedicated staff portal showing all open tickets, enabling admins to reply in real-time.
- **Dynamic Campaigns Module**: Analytics tracking widgets (Reach, Budget, Conversion Rates), platforms filters, and a campaign launch manager.
- **Creative Art Library**: Visual gallery showcasing creative assets with custom themes, categories, and approval statuses (Approved, In Review, Draft).

---

## Technology Stack

- **Frontend**: React (built on Vite), Vanilla CSS, Socket.io-client.
- **Backend**: Node.js, Express.js, Socket.io.
- **Database**: MongoDB (via Mongoose).
- **Deployment**: Render (for backend API), Netlify (for frontend React app).

---

## Local Setup & Running Instructions

### Prerequisites
- Node.js installed on your computer.
- A running MongoDB instance (either local installation or a MongoDB Atlas cloud URI).

---

### Step 1: Backend Configuration

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Ensure a `.env` file exists inside the `backend/` directory with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager
   JWT_SECRET=super_secret_jwt_token_for_authentication_key_12345
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### Step 2: Frontend Configuration

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The frontend server will start on `http://localhost:3000`. Open this URL in your web browser.
