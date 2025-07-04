
# OEI-PrimeraInfancia

## 🌟 Backend - Primera Infáncia

API REST construida con NestJS.

---

## 📁 Estructura del Proyecto

```
/
├── prisma/                # Archivos de Prisma (schema, migraciones, seeds)
│   ├── schema.prisma      # Definición del modelo de datos
│   ├── migrations/        # Migraciones de la base de datos
│   └── seed.ts            # Script para poblar datos iniciales
│
├── src/                   # Código fuente principal de la API NestJS
│   ├── core/              # Módulos principales de dominio.
│   ├── common/            # Utilidades, guards, decoradores y helpers reutilizables
│   ├── config/            # Configuración de la aplicación y variables de entorno
│   ├── services/          # Servicios compartidos.
│   ├── main.ts            # Punto de entrada de la aplicación
│   └── app.module.ts      # Módulo raíz de NestJS
│
├── .env                   # Variables de entorno
├── package.json           # Dependencias y scripts del proyecto
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Documentación del proyecto
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

3. **Crear archivo `.env` si es necesario y solicitar carpeta keys**:

```bash
cp .env.example .env
```

4. **Ejecutar prisma migrate**:

```bash
npm run prisma
```

5. **Ejecutar seeders necesarios**

```bash
npm run prisma:migrate
```

6. **Solicitar y ejecutar endpoints desde postman**

7. **Ejecutar en desarrollo**:

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
