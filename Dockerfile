# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# ---------- Runtime stage ----------
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=build /app .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]
