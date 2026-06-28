FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci

FROM deps AS development
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "-w", "backend"]

FROM deps AS build
COPY . .

RUN npm run build -w backend && npm prune --omit=dev

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS production
WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["backend/dist/index.js"]
