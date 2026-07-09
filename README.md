# TaskForge Task Management Application

A full-stack personal task manager built with a highly responsive, premium React frontend and an Express.js & MongoDB backend secured with JWT authentication.

## Features

- **User Authentication**: Secure Sign-up, Login, and Sign-out using JSON Web Tokens (JWT) and hashed passwords (bcryptjs).
- **Full CRUD Tasks**: Create, read, update, and delete tasks dynamically.
- **Smart Filtering & Searching**: Filter tasks by status (Pending, In Progress, Completed), category tags (Projects, Meeting, Design), and live search keywords.
- **Dynamic Sorting**: Toggle task sorting order on the fly.
- **Responsive Workspace**: Seamless, tailored layouts for desktop, tablet, and mobile screens.
- **Quick Status Toggle**: Instantly mark tasks as completed/pending using inline checkbox checklist checkmarks.
- **Statistics Dashboard**: Real-time counting cards tracking total, pending, in-progress, and completed tasks.

---

## Technology Stack

- **Frontend**: React (built on Vite), Vanilla CSS (premium SaaS light-mode design).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (via Mongoose).
- **Auth**: JWT (JSON Web Tokens).

---

## Local Setup & Running Instructions

### Prerequisites
- Node.js installed on your computer.
- A running MongoDB instance (either local installation or a MongoDB Atlas cloud URI).

---

### Step 1: Backend Configuration

1. Open your terminal, navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. A `.env` file has been created inside the `backend/` directory with standard configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager
   JWT_SECRET=super_secret_jwt_token_for_authentication_key_12345
   ```
   *Note: Ensure your MongoDB Atlas credentials have `@` characters URL-encoded as `%40`.*
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### Step 2: Frontend Configuration

1. Open a new terminal, navigate to the `frontend/` directory:
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

---

## Deployment Instructions

### Deploying Backend to Heroku
1. Install the Heroku CLI and login:
   ```bash
   heroku login
   ```
2. Create a new Heroku application:
   ```bash
   heroku create taskforge-api-backend
   ```
3. Add MongoDB credentials:
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   heroku config:set JWT_SECRET="your-production-jwt-secret"
   ```
4. Push the backend code to Heroku:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git subtree push --prefix backend heroku main
   ```

### Deploying Frontend to Netlify
1. Build the production build in the `frontend/` folder:
   ```bash
   npm run build
   ```
2. Create a `_redirects` file in the build output (`dist/` folder) to handle route fallbacks:
   ```text
   /* /index.html 200
   ```
3. Deploy the built `dist/` directory via the Netlify dashboard or CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```
   *Note: Update the base API URL in `frontend/src/services/api.js` from `/api` to your deployed backend URL on Heroku.*
