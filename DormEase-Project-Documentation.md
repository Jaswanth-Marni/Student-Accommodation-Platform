# DormEase - Dormitory Management System Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Documentation](#component-documentation)
5. [Backend Architecture](#backend-architecture)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Authentication System](#authentication-system)
9. [UI Components](#ui-components)
10. [State Management](#state-management)
11. [Styling System](#styling-system)
12. [Deployment Guide](#deployment-guide)

## Project Overview

DormEase is a comprehensive dormitory management system designed to streamline the operations of student housing facilities. The system provides features for room management, student management, maintenance requests, and administrative tasks.

### Key Features
- User Authentication and Authorization
- Room Management and Allocation
- Student Profile Management
- Maintenance Request System
- Notification System
- Administrative Dashboard
- Document Management
- Payment Tracking

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn UI (based on Radix UI)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## Project Structure

```
dormease/
├── src/
│   ├── api/              # API integration and services
│   │   ├── ui/          # Shadcn UI components
│   │   ├── layout/      # Layout components
│   │   ├── forms/       # Form components
│   │   └── shared/      # Shared components
│   ├── config/          # Configuration files
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── pages/           # Page components
│   ├── routes/          # Express routes
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── public/              # Static assets
└── server.mjs          # Backend entry point
```

## Component Documentation

### Layout Components

#### 1. MainLayout
- **Purpose**: Main application layout wrapper
- **Features**:
  - Responsive sidebar
  - Header with user profile
  - Navigation menu
  - Content area
- **Props**:
  - `children`: React nodes
  - `title`: Page title
  - `showSidebar`: Boolean for sidebar visibility

#### 2. Sidebar
- **Purpose**: Main navigation sidebar
- **Features**:
  - Collapsible menu
  - Role-based menu items
  - Active route highlighting
- **Components**:
  - NavigationMenu
  - UserProfile
  - QuickActions

#### 3. Header
- **Purpose**: Top navigation bar
- **Features**:
  - User profile dropdown
  - Notifications
  - Search functionality
  - Theme toggle

### Form Components

#### 1. LoginForm
- **Purpose**: User authentication
- **Fields**:
  - Email/Username
  - Password
  - Remember me
- **Validation**:
  - Email format
  - Password requirements
- **Features**:
  - Error handling
  - Loading states
  - Remember me functionality

#### 2. RoomForm
- **Purpose**: Room management
- **Fields**:
  - Room number
  - Capacity
  - Room type
  - Floor
  - Status
- **Features**:
  - Image upload
  - Amenities selection
  - Price configuration

#### 3. MaintenanceForm
- **Purpose**: Maintenance request submission
- **Fields**:
  - Issue type
  - Description
  - Priority
  - Location
  - Images
- **Features**:
  - File upload
  - Priority selection
  - Status tracking

### Data Display Components

#### 1. DataTable
- **Purpose**: Tabular data display
- **Features**:
  - Sorting
  - Filtering
  - Pagination
  - Row selection
  - Custom actions
- **Props**:
  - `columns`: Column definitions
  - `data`: Table data
  - `onRowClick`: Row click handler

#### 2. DashboardCards
- **Purpose**: Statistics display
- **Types**:
  - Occupancy rate
  - Maintenance requests
  - Revenue
  - Student count
- **Features**:
  - Animated counters
  - Trend indicators
  - Interactive charts

#### 3. NotificationList
- **Purpose**: Display system notifications
- **Features**:
  - Real-time updates
  - Read/unread status
  - Priority levels
  - Action buttons

## Backend Architecture

### Server Setup
```javascript
// server.mjs
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
```

### Authentication Middleware
```javascript
// middleware/auth.mjs
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

## Database Schema

### User Model
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'student'], required: true },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});
```

### Room Model
```javascript
// models/Room.js
const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  floor: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'] },
  amenities: [String],
  price: { type: Number, required: true }
});
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
- **Purpose**: User login
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "student"
    }
  }
  ```

#### POST /api/auth/register
- **Purpose**: New user registration
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "role": "student",
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```

### Room Management Endpoints

#### GET /api/rooms
- **Purpose**: List all rooms
- **Query Parameters**:
  - `status`: Filter by room status
  - `type`: Filter by room type
  - `floor`: Filter by floor
- **Response**:
  ```json
  {
    "rooms": [
      {
        "id": "room_id",
        "number": "101",
        "type": "single",
        "status": "available"
      }
    ]
  }
  ```

## State Management

### React Query Setup
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 1
    }
  }
});
```

### Custom Hooks

#### useAuth
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const login = async (credentials: LoginCredentials) => {
    // Login logic
  };

  const logout = () => {
    // Logout logic
  };

  return { login, logout };
};
```

## Styling System

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... other shades
          900: '#0c4a6e'
        }
      },
      spacing: {
        // Custom spacing
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
```

## Deployment Guide

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables
2. Install dependencies:
   ```bash
   npm install --production
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Environment Variables
```env
# Frontend
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=DormEase

# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dormease
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Security Considerations

1. **Authentication**
   - JWT token expiration
   - Password hashing
   - Role-based access control

2. **Data Protection**
   - Input validation
   - XSS prevention
   - CSRF protection

3. **API Security**
   - Rate limiting
   - Request validation
   - Error handling

## Performance Optimization

1. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Caching strategies

2. **Backend**
   - Database indexing
   - Query optimization
   - Response compression
   - Caching middleware

## Testing Strategy

1. **Unit Tests**
   - Component testing
   - Utility function testing
   - API endpoint testing

2. **Integration Tests**
   - User flows
   - API integration
   - Database operations

3. **End-to-End Tests**
   - Critical user journeys
   - Cross-browser testing
   - Performance testing 