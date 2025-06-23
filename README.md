
# OEI-PrimeraInfancia

## 🌟 Backend - Primera Infáncia

API REST construida con NestJS.

---

## 📁 Estructura del Proyecto

```
backend/
  ├── backend/   # Aplicación cliente (NExtJS/React)
  └── backend/    # Servidor (NestJS API)
```

---

## 🚀 Cómo empezar

### 🖥️ **Backend**

1. **Clonar el repositorio**:

```bash
git clone https://github.com/anriverax/OEI-primeraInfancia.git
cd mi-proyecto
```

2. **Instalar dependencias**:

```bash
cd backend
npm install
# o
yarn install
```

3. **Crear archivo `.env` si es necesario**:

```bash
cp .env.example .env
```

4. **Ejecutar prisma migrate**:

```bash
npm run prisma
```

5. **Ejecutar seeders si es necesario**

```bash
npm run prisma:migrate
```

6. **Ejecutar en desarrollo**:

```bash
npm run start:dev
```

---

## 🛠️ **Tecnologías**

- **Backend**: NestJS 🐝, TypeScript 🦕, Express 🖋️
- **Base de datos**: PostgreSQL 🐘 / Redis 🚦
- **ORM**: Prisma 🔮

---

## 📄 Licencia

Este proyecto está bajo la licencia [Apache 2.0](LICENSE).
