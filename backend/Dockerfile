FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev jpeg-dev giflib-dev

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

FROM base AS development
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM base AS builder
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS production
RUN apk add --no-cache cairo pango jpeg giflib
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
EXPOSE 3001
CMD ["node", "dist/main"]
