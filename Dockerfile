# ---------- Build stage ----------
FROM node:20-alpine3.21 AS builder

WORKDIR /fpi-backend

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package*.json ./
# Instalamos dependencias
RUN npm ci

# Copiamos todo el código
COPY . .
# Generamos Prisma Client
RUN npx prisma generate
# Compilamos la aplicación
RUN npm run build

# ---------- Runner stage ----------
FROM node:20-alpine3.21 AS runner

WORKDIR /fpi-backend

# Variables de entorno
ENV NODE_ENV=production PORT=3001

# Copiamos solo package.json y package-lock.json
COPY package*.json ./
# Instalamos solo dependencias de producción
RUN npm ci --omit=dev

# Copiamos el build ya generado
COPY --from=builder /fpi-backend/node_modules ./node_modules
COPY --from=builder /fpi-backend/dist ./dist
COPY --from=builder /fpi-backend/prisma ./prisma

# Usuario no-root
USER node
# Puerto de la aplicación
EXPOSE 3001
# Comando de arranque
CMD ["npm", "run", "start:prod"]
