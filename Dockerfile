# ---------- Build stage ----------
FROM node:16-alpine AS build

WORKDIR /Videotube

COPY package*.json ./
RUN npm install

COPY . .

# ---------- Runtime stage ----------
FROM node:16-alpine AS runner

WORKDIR /Videotube

COPY --from=build /Videotube .


CMD ["npm", "run", "dev"]
