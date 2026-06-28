# URL Shortener

A full-stack URL shortener built with React, Vite, Express, PostgreSQL, and Redis.

## Features

- Shorten long URLs into shareable links
- Track click analytics and referrer data
- User authentication and protected dashboards
- Responsive frontend with analytics views

## Tech Stack

- Frontend: React, TypeScript, Vite, React Query
- Backend: Node.js, Express, TypeScript, PostgreSQL, Redis
- Infrastructure: Docker and Docker Compose

## Running with Docker

1. Make sure Docker Desktop (or Docker Engine) is installed and running.
2. From the project root, build and start the services:

```bash
docker compose up --build
```
_OR_
```bash
npm run docker:up
```

3. Open the app in your browser:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

4. To stop the containers:

```bash
docker compose down
```

### Included services

- Frontend UI on port 5173
- Backend API on port 3000
- PostgreSQL database on port 5432
- Redis on port 6379

### Database migrations

Database migrations run automatically when the backend starts.

If you need to run them manually inside the container:

```bash
docker compose exec backend npm run migrate
```

## Local Development (without Docker)

Install dependencies at the project root:

```bash
npm install
```

Start both apps together:

```bash
npm run dev
```

The frontend will run on http://localhost:5173 and the backend on http://localhost:3000.
