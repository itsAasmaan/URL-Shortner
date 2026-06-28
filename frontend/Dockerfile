FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci

FROM deps AS development
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "-w", "frontend", "--", "--host", "0.0.0.0"]

FROM deps AS build
COPY . .

RUN npm run build -w frontend

FROM node:22-bookworm-slim AS production
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci

COPY --from=build /app/frontend/dist ./frontend/dist

EXPOSE 4173
CMD ["npm", "run", "preview", "-w", "frontend", "--", "--host", "0.0.0.0", "--port", "4173"]
