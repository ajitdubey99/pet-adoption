# Pet Adoption Management System

Full-stack MERN application. React (Vite + Tailwind CSS) frontend, Node.js + Express + MongoDB backend.

## Project Architecture

```
pet-adoption/
├── backend/
│   ├── config/
│   │   ├── config.js             # All env-based configuration (single source of truth)
│   │   └── database.js           # MongoDB connect/disconnect
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── petController.js      # Pet CRUD + public listing
│   │   └── applicationController.js  # Submit, list, approve/reject
│   ├── middleware/
│   │   ├── auth.js               # protect (JWT) + authorize (role)
│   │   ├── errorHandler.js       # Global error handler + 404
│   │   └── upload.js             # Multer pet photo config
│   ├── models/
│   │   ├── User.js               # Bcrypt hashing, role field
│   │   ├── Pet.js                # Text index, compound status index
│   │   └── AdoptionApplication.js # Unique compound index
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── petRoutes.js
│   │   └── applicationRoutes.js
│   ├── seeders/
│   │   ├── adminSeeder.js        # Creates/updates admin account from .env
│   │   ├── petSeeder.js          # Inserts 12 sample pets
│   │   └── index.js              # Runs all seeders sequentially
│   ├── utils/
│   │   ├── response.js           # Standardized JSON envelope
│   │   └── token.js              # JWT generate/verify
│   ├── validators/
│   │   └── validators.js         # express-validator middleware chains
│   ├── uploads/                  # Auto-created on first run
│   ├── server.js                 # Express app entry + graceful shutdown
│   └── .env.example
│
└── frontend/                     # React + Vite + Tailwind CSS
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js  # Axios + JWT interceptor + 401 handler
    │   │   └── services.js       # All API service functions
    │   ├── components/
    │   │   ├── common/index.jsx  # PrivateRoute, Alert, Spinner, Pagination, PetCard
    │   │   └── layout/Navbar.jsx # Responsive navbar with role-based links
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state + login/register/logout
    │   ├── hooks/
    │   │   └── useApi.js         # Generic async hook with loading/error
    │   ├── pages/
    │   │   ├── PetListPage.jsx   # Public browsing with filters + pagination
    │   │   ├── PetDetailPage.jsx # Pet details + adoption form
    │   │   ├── AuthPages.jsx     # Login + Register
    │   │   ├── user/UserDashboard.jsx
    │   │   └── admin/
    │   │       ├── AdminPetManagement.jsx
    │   │       └── AdminApplications.jsx
    │   ├── App.jsx               # Root component + router
    │   ├── main.jsx              # Vite entry point
    │   └── index.css             # Tailwind directives + custom component classes
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── .env.example
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Backend

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, and admin credentials

# Run seeders
npm run seed:admin      # Create admin account from .env
npm run seed:pets       # Insert 12 sample pets (requires admin first)
# OR run both at once:
npm run seed:all

# Start development server
npm run dev
# API: http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install

cp .env.example .env

npm run dev
# App: http://localhost:5173
```

## Seeder Commands

| Command | Description |
|---------|-------------|
| `npm run seed:admin` | Creates or updates admin account using ADMIN_EMAIL, ADMIN_PASSWORD from .env |
| `npm run seed:pets` | Clears and re-inserts 12 sample pets (needs admin to exist) |
| `npm run seed:all` | Runs admin seeder then pet seeder |

Default admin credentials (set in .env):
```
Email   : admin@petadopt.com
Password: Admin@123456
```

## API Reference

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |

### Pets
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/pets | Public |
| GET | /api/pets/:id | Public |
| POST | /api/pets | Admin |
| PUT | /api/pets/:id | Admin |
| DELETE | /api/pets/:id | Admin |

**GET /api/pets query params:** search, species, breed, minAge, maxAge, status, page, limit

### Applications
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/applications/:petId | User |
| GET | /api/applications/my | User |
| GET | /api/applications | Admin |
| PATCH | /api/applications/:id/review | Admin |

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs, Multer, express-validator  
**Frontend:** React 18, Vite, Tailwind CSS v3, React Router v6, Axios
