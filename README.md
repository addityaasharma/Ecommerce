# 🛍️ E-Commerce with System Designing

A production-style, multi-vendor e-commerce backend built with a modern TypeScript stack — designed as a hands-on learning project covering authentication, authorization, validation, and scalable API architecture.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL (hosted on [Neon](https://neon.tech)) |
| ORM | Prisma |
| Cache / Sessions | Redis |
| Validation | Zod |
| Auth | JWT (access + refresh tokens), Google OAuth 2.0 |
| Monorepo | Turborepo + pnpm workspaces |
| Dev Tooling | tsx (watch mode), dotenv |

---

## 📂 Monorepo Structure

```
nextjs/
├── apps/
│   ├── api/              # Express backend (this project)
│   └── web/               # Frontend (planned)
├── packages/
│   ├── db/                 # Prisma schema, client, migrations
│   ├── validators/         # Shared Zod schemas & inferred types
│   ├── ui/                  # Shared UI components
│   └── typescript-config/   # Shared tsconfig presets
```

Each app/package manages its own `.env` and dependencies — nothing is implicitly shared across process boundaries, which is a deliberate security and deployment boundary, not an oversight.

---

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- Email/password signup & login with **bcrypt** password hashing
- **Google OAuth 2.0** login/signup via verified ID tokens (`google-auth-library`)
- **JWT access + refresh token** pattern — short-lived access tokens (15 min), long-lived refresh tokens (7 days)
- Tokens delivered via **httpOnly cookies** — inaccessible to client-side JS, protecting against XSS token theft
- Custom **Express middleware** for route protection, with TypeScript module augmentation (`declare global`) to safely extend the `Request` type
- Separate `AdminRequest` type + `adminAsyncHandler` wrapper to guarantee `req.admin` is non-optional on protected routes — without weakening type safety project-wide
- Admin password change (verified old password) and forgot/reset password flow (Redis-backed, expiring tokens)

### 📦 Full CRUD Modules
Built consistently across **Admin**, **Category**, and **Product**:
- Create — with duplicate/conflict checks before writing
- Read — single item by ID, and paginated list views
- Update — partial updates (PATCH-style semantics) that only touch fields actually provided
- Delete — with existence checks to avoid raw database errors leaking to clients

### 🔎 Search, Filter, Sort & Pagination
- Offset-based pagination (`page`, `limit`) with total count and page count returned
- Case-insensitive search across multiple fields (`name`, `description`, `sku`)
- Dynamic sorting, including sorting by a **relation count** (e.g. categories ordered by number of products)
- All query parameters validated and coerced from strings via Zod (`z.coerce`)

### 🧩 Data Integrity
- URL-safe **slug generation** from product/category names, with collision handling
- Foreign key existence checks (category/vendor) before creating dependent records
- Database-level `@unique` constraints backed by clean, application-level pre-checks
- Centralized `AppError` class for consistent, typed error handling across every layer

### 🛠️ Developer Experience
- Shared `asyncHandler` / `adminAsyncHandler` wrappers — eliminates repetitive `try/catch` boilerplate across every controller
- Reusable `omitHandler` utility — strips `undefined` fields from update payloads to satisfy `exactOptionalPropertyTypes`, without 20 lines of conditional spreads per function
- Consistent response shape across every endpoint: `{ success, message, data }`
- Correct, deliberate HTTP status code usage (`400`, `401`, `403`, `404`, `409` — not just `200`/`500` everywhere)

---

## 🧠 Key Concepts Learned

- **Middleware chains** — how `req`/`res` flow through Express, and how attaching data (`req.admin = decoded`) in one middleware makes it available to every handler downstream
- **TypeScript declaration merging** (`declare global { namespace Express { interface Request { ... } } }`) — extending third-party library types safely, without forking them
- **`exactOptionalPropertyTypes`** — the difference between "a key is absent" vs "a key is present with value `undefined`," and why it matters for Prisma's generated types
- **`noUncheckedIndexedAccess`** — why `array[0]` is `T | undefined`, not `T`, under strict settings
- **Prisma's generated type family** (`<Model>WhereInput`, `<Model>CreateInput`, `<Model>OrderByWithRelationInput`, etc.) — one consistent, predictable pattern per model
- **Race-condition-aware design** — relying on database constraints (unique, foreign key) as the actual source of truth, not just application-level pre-checks
- **Environment variable scoping** — why each process in a monorepo needs its own `.env`, and why secrets shouldn't be centralized into a single root file
- **HTTP semantics** — choosing status codes based on what actually happened (`401` vs `403` vs `404` vs `409`), not defaulting to `200`/`500`
- **OAuth flows** — the difference between server-side redirect (Authorization Code) flow and client-side ID token flow, and when each is appropriate

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables (see .env.example in each app/package)
cp apps/api/.env.example apps/api/.env
cp packages/db/.env.example packages/db/.env

# Run database migrations
cd packages/db
pnpm prisma migrate dev

# Start the API in dev mode (auto-restarts on file changes)
cd ../../apps/api
pnpm dev
```

Health check: `GET http://127.0.0.1:5000/health`

---

## 📖 API Overview

| Resource | Base Route | Auth |
|---|---|---|
| Admin | `/admin` | Mixed (public signup/login, protected profile/password routes) |
| Category | `/categories` | Admin-only for writes |
| Product | `/products` | Admin-only for writes |

Full request examples available in `apps/api/requests/*.http` (or the accompanying Postman collection).

---

## 🗺️ Roadmap

- [ ] Vendor-scoped authorization (vendors can only manage their own products)
- [ ] Image upload pipeline (S3/Cloudinary)
- [ ] Order & cart flow
- [ ] Payment integration
- [ ] Public storefront routes (separating admin management from customer browsing)
- [ ] Redis caching for high-read endpoints

---

*Built as a hands-on learning project — every module was written, debugged, and refined iteratively, with an emphasis on understanding **why**, not just **what**.*
