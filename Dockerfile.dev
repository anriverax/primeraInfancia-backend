FROM node:20-alpine3.21 as builder

WORKDIR /fpi-backend

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el código
COPY . .

# Generamos Prisma Client
RUN npx prisma generate

# Compilamos la aplicación
RUN npm run build

# -------------------------------------

# Fase 2: Runner
FROM node:20-alpine3.21 as runner

WORKDIR /fpi-backend

# Definimos variables de entorno por defecto
ENV ENV NODE_ENV=prod \
    PORT=3001 \
    REDIS_PORT=${REDIS_PORT} \
    REDIS_HOST=${REDIS_HOST} \
    REDIS_DATABASE=${REDIS_DATABASE} \
    DATABASE_URL=${DATABASE_URL} \
    POSTGRES_USER=${POSTGRES_USER} \
    POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
    POSTGRES_DB=${POSTGRES_DB} \
    POSTGRES_HOST=${POSTGRES_HOST} \
    POSTGRES_PORT=${POSTGRES_PORT}

# Solo copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm install --omit=dev

# Copiamos el build ya generado
COPY --from=builder /fpi-backend/dist ./dist

# Usamos un usuario no-root por seguridad
USER node

# Exponemos el puerto que usa la app
EXPOSE 3001

# Comando de arranque
CMD ["npm", "run", "start:prod"]