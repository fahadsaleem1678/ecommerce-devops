# ShopDocker — Containerised E-Commerce Platform

> A production-style multi-container e-commerce application built to learn and demonstrate complete Docker concepts.

---

## Architecture

```
                    Browser
                       │
                   Port 80
                       │
             ┌─────────────────┐
             │   Nginx Proxy   │
             └────────┬────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    /api/*                        /*
         │                         │
  ┌──────┴──────┐         ┌────────┴────────┐
  │  Backend    │         │    Frontend     │
  │  Node.js    │         │  React + Vite   │
  │  Express    │         │  nginx:alpine   │
  └──────┬──────┘         └─────────────────┘
         │
    ┌────┴────┐
    │         │
┌───┴───┐  ┌──┴───┐
│ PgSQL │  │Redis │
│  :5432│  │ :6379│
└───────┘  └──────┘
```

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18 · Vite · React Router    |
| Backend  | Node.js · Express.js · REST API   |
| Database | PostgreSQL 16                     |
| Cache    | Redis 7                           |
| Proxy    | Nginx (reverse proxy + SPA serve) |
| DevOps   | Docker · Docker Compose · GitHub Actions |

---

## Docker Concepts Covered

- **Dockerfiles** — custom images for frontend and backend
- **Multi-stage builds** — Node → nginx:alpine for smaller production image
- **Docker Compose** — orchestrating 5 services in one file
- **Named volumes** — `postgres_data`, `redis_data` for persistence
- **Bridge network** — `ecommerce-net`, services communicate by name
- **Health checks** — backend, postgres, redis, nginx all have health checks
- **Environment variables** — `.env` file, no secrets baked into images
- **Non-root user** — backend runs as `appuser`
- **`.dockerignore`** — excludes `node_modules`, `.env` from build context

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://docs.docker.com/get-docker/) installed and running

### 1. Clone & configure

```bash
git clone <your-repo-url>
cd ecommerce-devops

cp .env.example .env
# Edit .env and set your own passwords if desired
```

### 2. Start the stack

```bash
docker compose up --build
```

> First build takes ~2–3 minutes (installs npm packages inside containers).

### 3. Open the app

| URL | Service |
|-----|---------|
| http://localhost | React frontend |
| http://localhost/api/health | Backend health check |

---

## Useful Docker Commands

```bash
# Start in detached mode
docker compose up -d --build

# View running containers
docker compose ps

# Follow logs for a specific service
docker compose logs -f backend

# Execute a command inside a container
docker compose exec backend sh
docker compose exec postgres psql -U admin -d ecommerce

# Stop and remove containers (keeps volumes)
docker compose down

# Stop and remove containers + volumes (wipes database!)
docker compose down -v

# Rebuild a single service
docker compose up -d --build backend
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, receive JWT |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products?search=keyboard` | Search products |
| GET | `/api/products/:id` | Get single product |

### Cart (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items (from Redis) |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List user orders |
| POST | `/api/orders` | Place order (PostgreSQL transaction) |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check backend + postgres + redis status |

---

## Project Structure

```
ecommerce-devops/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD
├── backend/
│   ├── Dockerfile          # Node.js image (non-root user)
│   ├── .dockerignore
│   ├── package.json
│   └── src/
│       ├── index.js        # Express entry point
│       ├── db.js           # PostgreSQL pool
│       ├── redis.js        # Redis client
│       ├── middleware/
│       │   └── auth.js     # JWT middleware
│       └── routes/
│           ├── health.js
│           ├── auth.js
│           ├── products.js
│           ├── cart.js     # Redis-backed
│           └── orders.js   # PostgreSQL transactions
├── frontend/
│   ├── dockerfile          # Multi-stage build
│   ├── .dockerignore
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── nginx.conf          # SPA routing inside container
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css       # Dark theme design system
│       ├── api/            # Axios instance with JWT interceptor
│       ├── context/        # AuthContext, CartContext
│       ├── components/     # Navbar, ProductCard, CartItem
│       └── pages/          # Home, Products, Cart, Login, Orders
├── nginx/
│   └── nginx.conf          # Reverse proxy config
├── database/
│   └── init.sql            # Schema + seed data
├── docker-compose.yml
├── .env                    # ⚠ do not commit
├── .env.example
└── README.md
```

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main`:

1. **Test** — install backend dependencies & run Jest
2. **Build** — build backend and frontend Docker images
3. **Integration** — spin up full stack with `docker compose`, hit `/api/health`, tear down

---

## Resume Description

> Built and deployed a multi-container e-commerce platform using Docker Compose with persistent storage (PostgreSQL volumes), Redis cart caching, Nginx reverse proxy, JWT authentication, and automated CI/CD with GitHub Actions.
