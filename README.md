# NoteVault — Backend Intern Assignment

A full-stack secure notes application with JWT authentication and role-based access control.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | Zod |
| Frontend | React 18, Vite, Tailwind CSS |
| HTTP Client | Axios |

## Features

### Backend
- ✅ JWT Authentication (register/login/me)
- ✅ Role-Based Access Control (USER / ADMIN)
- ✅ Full CRUD on Notes with ownership checks
- ✅ Zod input validation with detailed error messages
- ✅ Rate limiting (20 req/15min on auth, 200 on general)
- ✅ Helmet security headers
- ✅ Pagination & server-side search on GET /notes
- ✅ Prisma singleton pattern (no hot-reload leaks)
- ✅ Structured JSON API responses (`success`, `data`, `error`)
- ✅ Global error handling middleware
- ✅ Seed script with demo accounts

### Frontend
- ✅ Protected routes with React Router
- ✅ Auth context with localStorage persistence
- ✅ Auto-logout on 401 responses
- ✅ Debounced search
- ✅ Skeleton loading states
- ✅ Create / Edit (PATCH) / Delete notes via modal
- ✅ Toast notifications
- ✅ Admin sees all notes + owner email badges

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm install
npm run db:generate     # generate Prisma client
npm run db:migrate      # run migrations
npm run db:seed         # optional: seed demo data
npm run dev             # starts on :5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev             # starts on :5173
```

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | ❌ | Register user |
| POST | `/api/v1/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/v1/auth/me` | ✅ | Get current user |
| GET | `/api/v1/auth/users` | ADMIN | List all users |

### Notes
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/notes` | ✅ | List notes (admin sees all) |
| POST | `/api/v1/notes` | ✅ | Create note |
| GET | `/api/v1/notes/:id` | ✅ | Get single note |
| PATCH | `/api/v1/notes/:id` | ✅ | Update note |
| DELETE | `/api/v1/notes/:id` | ✅ | Delete note |

Query params on GET `/notes`: `?search=term&page=1&limit=20`

### Response Format
All responses follow a consistent structure:
```json
{ "success": true, "data": { ... }, "message": "..." }
{ "success": false, "error": "...", "details": [...] }
```

## Scalability Notes

### Caching (Redis)
Read-heavy endpoints like `GET /notes` can be cached with Redis TTL. Invalidate on write operations.

### Database Pooling
Prisma manages connection pooling. For high-concurrency production deployments, add PgBouncer as a proxy.

### Horizontal Scaling
Auth and Notes modules are fully decoupled and can be containerised as separate microservices behind an NGINX load balancer. A Kubernetes deployment with HPA (Horizontal Pod Autoscaler) handles traffic spikes.

### Security Hardening
- Rotate `JWT_SECRET` periodically
- Use HTTPS in production
- Set strict CORS origins
- Consider adding refresh tokens for session management

## Demo Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin123 |
| User | user@example.com | User1234 |
