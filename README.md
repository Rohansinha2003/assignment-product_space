# TaskFlow

A modern full-stack task management app built like a mini SaaS product.

TaskFlow includes secure JWT authentication, strict per-user data isolation, and a clean React dashboard for managing work with filters, search, and status workflows.

---

## Why This Project Stands Out

- **Production-style architecture** with a separated client (`React + Vite`) and API server (`Express + Sequelize`)
- **Secure authentication flow** using `bcrypt` password hashing and signed JWTs
- **Multi-tenant-safe task access** (every task operation is scoped to the authenticated user)
- **PostgreSQL schema support** (`DB_SCHEMA`) for clean database organization
- **Fast, responsive UX** with optimistic UI updates and modern Tailwind-based styling

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| ORM | Sequelize |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| API Client | Axios |

---

## Core Features

- **User Accounts**
  - Signup, login, and authenticated session restoration
- **Task Management**
  - Create, update, delete, and view personal tasks
- **Task Metadata**
  - Status (`pending`, `in_progress`, `completed`)
  - Priority (`low`, `medium`, `high`)
  - Optional due dates and descriptions
- **Task Discovery**
  - Search and filter by status/priority
  - Sorting support via API query params
- **Security & Validation**
  - Password hashing with bcrypt
  - Token-based route protection
  - Input validation on API routes

---

## Architecture Overview

```
assignment-product_space/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # Reusable UI components
│       ├── context/        # Auth context/state
│       └── pages/          # Route-level pages
└── server/                 # Express backend
    ├── config/             # Database setup
    ├── controllers/        # Route handlers
    ├── middleware/         # Auth, validation, error handling
    ├── models/             # Sequelize models + associations
    ├── routes/             # API route definitions
    └── utils/              # JWT helpers
```

---

## Quick Start

### Prerequisites

- Node.js `>= 18`
- PostgreSQL `>= 14`

### 1) Create Database

```sql
CREATE DATABASE taskmanager;
```

### 2) Configure Backend Environment

From `server/.env`:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_SCHEMA=taskflow
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5174
```

### 3) Install and Run Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on: `http://localhost:5001`

### 4) Install and Run Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173` (or next available Vite port, e.g. `5174`)

---

## API Reference

### Auth Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate and return JWT | No |
| GET | `/api/auth/me` | Get current authenticated user | Yes |

### Task Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Get all tasks for logged-in user | Yes |
| GET | `/api/tasks/:id` | Get one task owned by user | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

Supported query params for `GET /api/tasks`:

- `status`
- `priority`
- `search`
- `sortBy`
- `order`

---

## Security Notes

- Passwords are hashed before storage (bcrypt)
- JWT-protected routes require valid `Authorization: Bearer <token>`
- Task queries enforce ownership by `userId`
- Request payloads are validated server-side

---

## Scripts

### Server (`/server`)

- `npm run dev` — start development server with nodemon
- `npm start` — start server in normal mode

### Client (`/client`)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

---

## Roadmap Ideas

- Add refresh-token flow and token rotation
- Add pagination and task analytics
- Add automated tests (unit + API + E2E)
- Add Dockerized local environment
- Add CI pipeline for lint/test/build

---

## License

This project is open-source and available under the MIT License.
