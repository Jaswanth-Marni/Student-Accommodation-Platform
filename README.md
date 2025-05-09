.# DormEase - Dormitory Management System

DormEase is a full-stack web application for managing student dormitories, including room allocation, student profiles, maintenance requests, and more.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Useful Links](#useful-links)
- [Troubleshooting](#troubleshooting)

---

## Project Overview
DormEase streamlines dormitory management for administrators and students. It features:
- User authentication (JWT-based)
- Room and student management
- Maintenance request system
- Dashboard and notifications

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js & npm](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/) (for cloning the repo)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB server)

## Installation
1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

## Environment Variables
You must set up environment variables for the backend to connect to MongoDB and handle authentication securely.

1. **Create a `.env` file in the project root (or in `src/` if backend is separated):**
   ```env
   # MongoDB connection string (get from MongoDB Atlas dashboard)
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority

   # JWT secret key (generate a strong random string, e.g. using https://generate-secret.vercel.app/32)
   JWT_SECRET=your_super_secret_jwt_key

   # Port for backend server
   PORT=5000
   ```
2. **Update the values:**
   - Replace `<username>`, `<password>`, `<cluster-url>`, and `<dbname>` with your MongoDB Atlas details.
   - Set a strong value for `JWT_SECRET`.

## Running the Project

### 1. Start the Backend Server
```sh
npm run server:dev
```
- The backend will start on the port specified in your `.env` (default: 5000).
- Make sure MongoDB is running and accessible.

### 2. Start the Frontend (Development Mode)
```sh
npm run dev
```
- The frontend will start on [http://localhost:5173](http://localhost:5173) (or as specified by Vite).
- The frontend expects the backend API to be available at `http://localhost:5000` (update API URLs in the code or via environment variables if needed).

## Useful Links
- [MongoDB Atlas Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/)
- [How to generate a secure JWT secret](https://generate-secret.vercel.app/32)
- [Node.js Download](https://nodejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Troubleshooting
- **MongoDB connection errors:**
  - Double-check your `MONGODB_URI` in `.env`.
  - Ensure your IP is whitelisted in MongoDB Atlas.
- **JWT errors:**
  - Make sure `JWT_SECRET` is set and matches in all relevant places.
- **Port conflicts:**
  - Change the `PORT` in `.env` if 5000 is in use.
- **Frontend can't reach backend:**
  - Ensure both servers are running and API URLs match.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

**Enjoy using DormEase!**
