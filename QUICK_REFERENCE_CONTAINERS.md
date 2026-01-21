# 🚀 Guía Rápida - Arquitectura de Módulos Contenedores

## Estructura Simplificada

```
src/
├── app.module.ts                          # 🔴 Refactorizado - 7 imports
├── core/
│   ├── core-container.module.ts           # 🟢 NUEVO - Auth, Profile, Group
│   ├── catalogue/
│   │   ├── catalogue-container.module.ts  # 🟢 NUEVO - Catálogos
│   │   ├── common/
│   │   ├── department/
│   │   ├── zone/
│   │   ├── trainingModule/
│   │   ├── evaluationInstrument/
│   │   └── school/
│   ├── test/
│   │   ├── test-container.module.ts       # 🟢 NUEVO - Test modules
│   │   ├── permission/
│   │   └── coutry/
│   ├── data-container.module.ts           # 🟢 NUEVO - Data, Appendix
│   ├── auth/
│   ├── profile/
│   ├── group/
│   ├── appendix/
│   ├── attendance/
│   ├── dashboard/
│   ├── health/
│   └── surveyData/
├── services/
│   ├── prisma/
│   ├── redis/
│   ├── s3/
│   └── events/
└── common/
```

---

## 📍 Dónde Agregar Nuevos Módulos

### Si es un módulo de AUTENTICACIÓN/PERFIL/GRUPO

```bash
# 1. Crear carpeta en src/core/
src/core/new-feature/

# 2. Importar en CoreContainerModule
src/core/core-container.module.ts

# 3. Agregar ruta (automático via RouterModule)
# La ruta será: /api/new-feature
```

### Si es un CATÁLOGO

```bash
# 1. Crear carpeta en src/core/catalogue/
src/core/catalogue/new-catalogue/

# 2. Importar en CatalogueContainerModule
src/core/catalogue/catalogue-container.module.ts

# 3. Agregar ruta en RouterModule
# La ruta será: /api/catalogue/new-catalogue
```

### Si es un módulo de DATOS

```bash
# 1. Crear carpeta en src/core/
src/core/new-data/

# 2. Importar en DataContainerModule
src/core/data-container.module.ts

# 3. Agregar ruta (automático via RouterModule)
# La ruta será: /api/new-data
```

### Si es ESPECIAL (como Attendance o Dashboard)

```bash
# 1. Crear carpeta en src/core/
src/core/new-special/

# 2. Importar en AppModule
src/app.module.ts

# 3. Agregar ruta en RouterModule de AppModule
# La ruta será: /api/new-special
```

---

## ✅ Checklist para Nuevo Módulo

```typescript
// 1. Crear estructura
src/core/mi-modulo/
├── mi-modulo.module.ts
├── mi-modulo.controller.ts
├── services/
│   └── mi-modulo.service.ts
├── cqrs/ (opcional)
│   ├── commands/
│   ├── queries/
│   ├── events/
│   └── projections/
└── dto/
    ├── mi-modulo.dto.ts
    └── mi-modulo.type.ts

// 2. Crear el módulo
@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [MiModuloController],
  providers: [MiModuloService],
  exports: [MiModuloService] // ← Exportar servicios!
})
export class MiModuloModule {}

// 3. Importar en el contenedor correspondiente
// src/core/core-container.module.ts (o el que corresponda)
import { MiModuloModule } from "./mi-modulo/mi-modulo.module";

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    GroupModule,
    MiModuloModule // ← Agregar aquí
  ]
})
export class CoreContainerModule {}

// 4. Agregar ruta en RouterModule si es necesario
// (Ya se agrega automáticamente en muchos casos)
```

---

## 🔗 Ejemplos de Importación

### CoreContainerModule (en app.module.ts)

```typescript
import { CoreContainerModule } from "./core/core-container.module";

@Module({
  imports: [CoreContainerModule]
})
```

### Si necesitas un servicio de Auth en otro módulo

```typescript
// En tu módulo
import { AuthModule } from "./core/auth/auth.module";

@Module({
  imports: [AuthModule]
  // Ahora puedes inyectar AuthService
})
export class MiModulo {}

// En tu servicio
@Injectable()
export class MiServicio {
  constructor(private authService: AuthService) {}
}
```

---

## 🚨 Reglas Importantes

### ✅ HACES

- ✅ Agrupar módulos relacionados en contenedores
- ✅ Exportar servicios que otros módulos necesitan
- ✅ Usar CQRS para lógica de negocio
- ✅ Mantener controladores delgados
- ✅ Centralizar validación en DTOs

### ❌ NO HACES

- ❌ Crear nuevos imports directos en AppModule (usa contenedores)
- ❌ Importar servicios sin exportarlos del módulo
- ❌ Crear dependencias circulares entre contenedores
- ❌ Mezclar lógica de negocio en controladores
- ❌ Olvidar exportar módulos en contenedores

---

## 📊 Referencia Rápida de Rutas

| Contenedor    | Módulo             | Ruta Base                       | Ejemplos                              |
| ------------- | ------------------ | ------------------------------- | ------------------------------------- |
| **Core**      | AuthModule         | `/api/auth`                     | POST /api/auth/register               |
|               | ProfileModule      | `/api/profile`                  | GET /api/profile/:id                  |
|               | GroupModule        | `/api/group`                    | GET /api/group/all                    |
| **Catalogue** | DepartmentModule   | `/api/catalogue/department`     | GET /api/catalogue/department         |
|               | ZoneModule         | `/api/catalogue/zone`           | GET /api/catalogue/zone/all           |
|               | TrainingModule     | `/api/catalogue/trainingModule` | GET /api/catalogue/trainingModule/all |
|               | SchoolModule       | `/api/catalogue/school`         | GET /api/catalogue/school             |
| **Test**      | MunicipalityModule | `/api/test/municipality`        | GET /api/test/municipality/all        |
|               | PermissionModule   | `/api/test/permission`          | POST /api/test/permission             |
| **Data**      | AppendixModule     | `/api/appendix`                 | GET /api/appendix/all                 |
|               | SurveyDataModule   | `/api/surveyData`               | GET /api/surveyData/all               |
| **Especial**  | AttendanceModule   | `/api/attendance`               | POST /api/attendance                  |
|               | DashboardModule    | `/api/dashboard`                | GET /api/dashboard/stats              |

---

## 🧪 Testing

### Test de un módulo individual

```bash
npm run test -- src/core/auth/auth.module.spec.ts
```

### Test de un contenedor

```bash
# Esto testea todos los módulos dentro del contenedor
npm run test -- src/core/core-container.module.spec.ts
```

### Test de integración

```bash
npm run test:e2e -- api/auth.e2e.ts
```

---

## 🔍 Debugging

### Ver qué módulos se cargan

```bash
# En main.ts, agrega logger
const app = await NestFactory.create(AppModule, {
  logger: ['log', 'error', 'warn', 'debug', 'verbose'],
});
```

### Verificar que las rutas están correctas

```bash
# Ver todas las rutas registradas
npm run start -- --watch

# En el output busca "Mapped routes" o "Registered routes"
```

---

## 🔄 Migración de Módulos Antiguos

Si tienes un módulo antiguo que importa directamente en AppModule:

```typescript
// ANTES (en app.module.ts)
import { MiModuloAntiguo } from "./core/mi-modulo/mi-modulo.module";

@Module({
  imports: [MiModuloAntiguo]
})
export class AppModule {}

// DESPUÉS
// 1. Agrega a CoreContainerModule (o el contenedor que corresponda)
@Module({
  imports: [MiModuloAntiguo]
})
export class CoreContainerModule {}

// 2. Importa el contenedor en AppModule
@Module({
  imports: [CoreContainerModule]
})
export class AppModule {}

// 3. Borra MiModuloAntiguo de los imports de AppModule
```

---

## 📚 Documentación Relacionada

- [REFACTORING_CONTAINER_MODULES.md](./REFACTORING_CONTAINER_MODULES.md) - Documento detallado
- [ARCHITECTURE_CONTAINER_DIAGRAM.md](./ARCHITECTURE_CONTAINER_DIAGRAM.md) - Diagramas visuales
- [NestJS Modules Docs](https://docs.nestjs.com/modules)

---

**Última actualización:** 20 de enero de 2026
**Versión:** 1.0
**Responsable:** Análisis de Arquitectura
