# Etapa 1: Builder
FROM node:20-alpine3.21 AS builder

WORKDIR /fpi-backend

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el código
COPY . .


# Generamos Prisma Client
RUN npx prisma generate
COPY prisma ./prisma
# Compilamos la aplicación
RUN npm run build

# -------------------------------------

# Fase 2: Runner
FROM node:20-alpine3.21 AS runner

WORKDIR /fpi-backend

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=builder /fpi-backend/prisma ./prisma
COPY --from=builder /fpi-backend/node_modules ./node_modules
COPY --from=builder /fpi-backend/dist ./dist

COPY package*.json ./

# Copiar entrypoint desde repo
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN chown -R node:node /fpi-backend
# Usamos usuario no-root
USER node

EXPOSE 3001

CMD ["/usr/local/bin/docker-entrypoint.sh"]