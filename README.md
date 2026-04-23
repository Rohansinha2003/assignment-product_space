# TaskFlow — Mini SaaS Task Management System

A production-ready full-stack task management application with secure JWT authentication and multi-user isolation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Sequelize ORM |
| Authentication | JWT + bcrypt |
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |

## Project Structure

```
assignment-product_space/
├── server/          # Express API
│   ├── config/      # Database connection
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth, error, validation
│   ├── models/      # Sequelize models
│   ├── routes/      # Express routes
│   ├── utils/       # JWT helpers
│   └── server.js    # Entry point
└── client/          # React frontend
    └── src/
        ├── api/      # Axios instance
        ├── components/
        ├── context/  # Auth context
        └── pages/
```

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE taskmanager;
```

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npm run dev
```

Server runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login, returns JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all your tasks | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

**Query params for GET /api/tasks:** `status`, `priority`, `search`, `sortBy`, `order`

## Features

- 🔐 **Secure Auth** — bcrypt (12 salt rounds) + JWT (7-day expiry)
- 👤 **User Isolation** — Every task query is scoped to `WHERE userId = req.user.id`
- ✅ **Task Lifecycle** — Pending → In Progress → Completed (with status cycle toggle)
- 🏷️ **Priority Levels** — Low / Medium / High with color-coded badges
- 📅 **Due Dates** — Overdue detection with visual indicator
- 🔍 **Search & Filter** — Debounced search + status/priority filters
- ⚡ **Optimistic Updates** — Status changes reflect instantly then sync with server
- 🛡️ **Input Validation** — express-validator on all API routes
- 🎨 **Dark UI** — Glassmorphism design with micro-animations
