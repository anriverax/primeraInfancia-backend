# Diagrama de Arquitectura - Módulos Contenedores

## 📐 Estructura Antes vs Después

### ❌ ANTES: AppModule Monolítico (17 importaciones directas)

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule                             │
│  ✗ 17 módulos importados directamente                      │
│  ✗ RouterModule.register() con 120+ líneas                │
│  ✗ Difícil de mantener y escalar                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
   AuthModule   ProfileModule   GroupModule   CatalogueModule
        │              │              │              │
        ├──────────────┼──────────────┤              ├─────────────┬─────────────┬──────────────┐
        │              │              │              │             │             │              │
    TokenService  S3Service    DepartmentModule  ZoneModule  TrainingModule  SchoolModule  ...

    + MunicipalityModule
    + PermissionModule
    + TechsupportModule
    + AppendixModule
    + SurveyDataModule
    + AttendanceModule
    + DashboardModule
    + HealthModule
```

---

### ✅ DESPUÉS: AppModule con Contenedores (7 importaciones)

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule                             │
│  ✓ 7 módulos (contenedores + servicios + otros)           │
│  ✓ RouterModule simplificado (~20 líneas)                 │
│  ✓ Fácil de mantener y escalar                            │
└──┬──────────────┬──────────────┬──────────────┬───────────┬┘
   │              │              │              │           │
   ▼              ▼              ▼              ▼           ▼
CoreContainer Catalogue       AttendanceModule Dashboard  HealthModule
Module        Container       Module          Module
   │           Module          │              │
   │              │            │              │
   ├───┬────┐     ├────┬────┐  ├──────┬──────┤
   │   │    │     │    │    │  │      │      │
   ▼   ▼    ▼     ▼    ▼    ▼  ▼      ▼      ▼
 Auth Prof Group Cat Dept Zone Attend  Dashboard
   │    │    │   │   │    │   │        │
   │    │    │   │   │    │   └────┬───┘
   │    │    │   │   │    │        │
TestContainer    DataContainer
   │                  │
   ├─────┬────────┐   ├─────┬──────┐
   │     │        │   │     │      │
   ▼     ▼        ▼   ▼     ▼      ▼
Munic  Perm  TechSupp Append Survey
```

---

## 🔍 Detalles de Cada Contenedor

### 1. CoreContainerModule

```
CoreContainerModule
├── AuthModule (CQRS)
│   ├── Commands: RegisterUser, ChangePasswd
│   ├── Queries: FindUniqueUser, GetAllUserKey, etc.
│   └── Services: AuthService, TokenService, KeyService
├── ProfileModule (CQRS)
│   ├── Commands: UploadAvatar
│   ├── Queries: GetByIdUser
│   └── Services: ProfileService, S3Service
└── GroupModule
    ├── Controllers: GroupController
    └── Services: GroupService
```

**Rutas HTTP:**

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/profile/:id
PATCH  /api/profile/avatar
GET    /api/group/all
POST   /api/group
```

---

### 2. CatalogueContainerModule

```
CatalogueContainerModule
├── CatalogueModule (coordinador)
│   └── Queries: GetAllRolePermission
├── DepartmentModule (CQRS)
│   ├── Commands: AddDepartment
│   ├── Queries: GetAllDepartment
│   └── Projection: DepartmentProjection
├── ZoneModule (CQRS)
│   └── Queries: GetAllZone
├── TrainingModule
│   └── Queries: GetAllTrainingModule
├── EvaluationInstrumentModule
│   └── Queries: GetAllEvaluationInstrument
├── SchoolModule
│   └── Queries: GetAllSchool
└── TechsupportModule
    └── Controllers: TechSupportController (carga datos)
```

**Rutas HTTP:**

```
GET    /api/catalogue/department
POST   /api/catalogue/department
GET    /api/catalogue/zone/all
GET    /api/catalogue/trainingModule/all
GET    /api/catalogue/evaluationInstrument/all
GET    /api/catalogue/school/all
POST   /api/catalogue/cargar-data
```

---

### 3. TestContainerModule

```
TestContainerModule
├── MunicipalityModule
│   └── Controllers: MunicipalityController
├── PermissionModule (CQRS)
│   ├── Commands: AddMenuPermission, AddRolePermission
│   ├── Queries: MenuPermission
│   └── Projection: MenuPermissionProjection
└── TechsupportModule
    └── (importado de CatalogueContainer)
```

**Rutas HTTP:**

```
GET    /api/test/municipality/all
POST   /api/test/municipality
POST   /api/test/permission
GET    /api/test/permission
```

---

### 4. DataContainerModule

```
DataContainerModule
├── AppendixModule (CQRS)
│   ├── Commands: CreateAppendix, UpdateAppendix, DeleteAppendix
│   ├── Queries: GetAllAppendix, GetByIdAppendix, GetByIdDetailAppendix
│   └── Projection: AppendixProjection
└── SurveyDataModule
    └── Controllers: SurveyDataController
```

**Rutas HTTP:**

```
GET    /api/appendix/all
GET    /api/appendix/:id
POST   /api/appendix
PATCH  /api/appendix/:id
DELETE /api/appendix/:id
GET    /api/surveyData/all
POST   /api/surveyData
```

---

### 5. Módulos Independientes

```
AttendanceModule (CQRS)
├── Commands: CreateAttendance, UpdateAttendance
├── Queries: GetGroupStaffByUser, GetPersonRoleByUser, etc.
├── Projection: AttendanceSessionProjection
└── Services: MentorAssignmentService

DashboardModule (CQRS)
├── Queries: Múltiples handlers de análisis
├── Services: DashboardService
└── Dependencies: TrainingModule

HealthModule
└── Controllers: HealthController (health check)
```

**Rutas HTTP:**

```
GET    /api/attendance
POST   /api/attendance
PATCH  /api/attendance/:id
GET    /api/dashboard/stats
GET    /api/dashboard/analysis
GET    /health
```

---

## 📊 Métricas de Refactorización

| Métrica                     | Antes | Después | Mejora      |
| --------------------------- | ----- | ------- | ----------- |
| **Imports en AppModule**    | 17    | 7       | ✅ -59%     |
| **Líneas de RouterModule**  | 120+  | 20      | ✅ -83%     |
| **Niveles de anidamiento**  | 3     | 2       | ✅ -33%     |
| **Módulos directos**        | 17    | 7       | ✅ -59%     |
| **Complejidad ciclomática** | Alta  | Media   | ✅ Reducida |

---

## 🔄 Matriz de Dependencias

```
AppModule
  ├─ ConfigModule (global)
  ├─ JwtModule (global)
  ├─ PrismaModule
  ├─ RedisModule
  ├─ HealthModule
  │
  ├─ CoreContainerModule
  │   ├─ AuthModule → [CqrsModule, JwtModule, RedisService]
  │   ├─ ProfileModule → [CqrsModule, JwtModule, S3Service]
  │   └─ GroupModule
  │
  ├─ CatalogueContainerModule
  │   ├─ CatalogueModule
  │   ├─ DepartmentModule → [CqrsModule, JwtModule]
  │   ├─ ZoneModule → [CqrsModule, JwtModule]
  │   ├─ TrainingModule → [CqrsModule, JwtModule]
  │   ├─ EvaluationInstrumentModule → [CqrsModule, JwtModule]
  │   ├─ SchoolModule → [CqrsModule, JwtModule]
  │   └─ TechsupportModule
  │
  ├─ AttendanceModule → [CqrsModule, JwtModule]
  │
  ├─ DashboardModule → [CqrsModule, TrainingModule]
  │
  ├─ TestContainerModule
  │   ├─ MunicipalityModule
  │   ├─ PermissionModule → [CqrsModule]
  │   └─ TechsupportModule (referenciado)
  │
  └─ DataContainerModule
      ├─ AppendixModule → [CqrsModule, JwtModule]
      └─ SurveyDataModule
```

---

## 🚀 Beneficios Logrados

### ✅ Separación de Responsabilidades

- CoreContainerModule: Identidad y autenticación
- CatalogueContainerModule: Datos maestros
- TestContainerModule: Funcionalidades en desarrollo
- DataContainerModule: Gestión de datos complementarios

### ✅ Mantenibilidad Mejorada

- Cambios en módulos de catálogo no afectan autenticación
- Cada contenedor es independiente
- Fácil localizar dónde cambiar funcionalidades

### ✅ Testabilidad

- Menos dependencias para mockear
- Contenedores pueden ser probados aisladamente
- AppModule es más simple de testear

### ✅ Escalabilidad

- Agregar nuevos módulos requiere solo actualizar un contenedor
- Estructura clara para nuevos desarrolladores
- Patrón repetible y consistente

---

## 🔧 Próximas Mejoras Sugeridas

### Fase 2: Exportar Servicios Compartidos

```typescript
// CoreContainerModule
@Module({
  imports: [AuthModule, ProfileModule, GroupModule],
  exports: [
    AuthModule,
    ProfileModule,
    GroupModule
    // Agregar también exports de servicios si otros módulos los necesitan
  ]
})
export class CoreContainerModule {}
```

### Fase 3: Estandarizar CQRS en todos los módulos

- ZoneModule: Agregar comando para crear/actualizar zonas
- TrainingModule: Agregar comando para crear/actualizar módulos
- SchoolModule: Agregar comando para crear/actualizar escuelas

### Fase 4: ErrorHandlingModule Centralizado

```
ErrorHandlingModule
├── ErrorHandlingService
├── ErrorInterceptor
└── ErrorFilter
```

---

## 📝 Resumen de Cambios

| Archivo                                            | Cambio        | Estado        |
| -------------------------------------------------- | ------------- | ------------- |
| `src/app.module.ts`                                | Refactorizado | ✅ Completado |
| `src/core/core-container.module.ts`                | Creado        | ✅ Completado |
| `src/core/catalogue/catalogue-container.module.ts` | Creado        | ✅ Completado |
| `src/core/test/test-container.module.ts`           | Creado        | ✅ Completado |
| `src/core/data-container.module.ts`                | Creado        | ✅ Completado |
| Tests                                              | Por validar   | ⏳ Pendiente  |
| Documentación                                      | Creada        | ✅ Completado |

---

**Fecha:** 20 de enero de 2026
**Estado:** ✅ Refactorización Completada
**Compilación:** ✅ Sin errores
**Tests:** ⏳ Por ejecutar
