# 🎬 CQRS Visual Guide - Diagrama de Flujos

## 1️⃣ FLUJO ACTUAL (Con Problemas)

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRO DE USUARIO                          │
└─────────────────────────────────────────────────────────────────┘

CLIENT
  │
  └─► POST /api/auth/register { email, password, name }
       │
       ▼
  ┌──────────────────────┐
  │  AuthController      │
  │  @Post('register')   │
  └──────────┬───────────┘
             │
             ├─► Validar DTO ✅
             │
             └─► commandBus.execute(RegisterUserCommand)
                  │
                  ▼
             ┌─────────────────────────────────┐
             │  RegisterUserHandler            │
             │  @CommandHandler                │
             └─────────┬───────────────────────┘
                       │
                       ├─ Crear usuario ✅
                       │  └─► await userProjection.register(data)
                       │      └─► INSERT INTO user
                       │
                       ├─ Emitir evento ✅
                       │  └─► await eventBus.publish(UserRegisteredEvent)
                       │
                       └─ Retornar respuesta ✅
                          └─► { statusCode: 201, message: "..." }

                              ┌─────────────────────────────────┐
                              │  UserRegisteredEvent Emitido    │
                              │  (Async)                        │
                              └──────────┬────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────────────────┐
                              │  UserRegisteredHandler          │
                              │  @EventsHandler                 │
                              └──────────┬────────────────────┘
                                         │
                                         ├─ console.log(...) ❌
                                         │
                                         └─ [NADA MÁS - PROBLEM!]

                         ⚠️ RESULTADO: El read model nunca se actualiza
                         ⚠️ RESULTADO: Los emails nunca se envían
                         ⚠️ RESULTADO: Las notificaciones nunca llegan


DATABASE STATE DESPUÉS:
┌──────────────────────────────────────────┐
│ Write Model (user table)                 │
├──────────────────────────────────────────┤
│ ✅ Usuario creado                        │
│ ✅ Email registrado                      │
│ ❌ Read Model sin actualizar             │
│ ❌ Emails sin enviar                     │
│ ❌ Notificaciones sin crear             │
└──────────────────────────────────────────┘
```

---

## 2️⃣ FLUJO MEJORADO (Correcto)

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGISTRO DE USUARIO (MEJORADO)               │
└─────────────────────────────────────────────────────────────────┘

CLIENT
  │
  └─► POST /api/auth/register
       │
       ▼
  ┌──────────────────────────────────────┐
  │  AuthController                      │
  │  @Post('register')                   │
  │  async register(dto: AuthDto) { ...} │
  └──────────┬───────────────────────────┘
             │
             ├─► Validar DTO ✅ (automático con @IsEmail, etc)
             │
             └─► commandBus.execute(
                   new RegisterUserCommand(dto)
                 )
                  │
                  ▼
             ┌─────────────────────────────────┐
             │  RegisterUserHandler            │
             │  @CommandHandler                │
             │  implements ICommandHandler     │
             └─────────┬───────────────────────┘
                       │
                       ├─ VALIDAR ✅
                       │  └─► if (data.email exist) throw ConflictException
                       │
                       ├─ ESCRIBIR EN WRITE MODEL ✅
                       │  └─► await userProjection.register(data)
                       │      └─► INSERT INTO user (...)
                       │
                       ├─ EMITIR EVENTO ✅
                       │  └─► await eventBus.publish(
                       │         new UserRegisteredEvent(newUser)
                       │      )
                       │
                       └─ RETORNAR RESPUESTA ✅
                          └─► { statusCode: 201, message: "...", data: {} }


┌─ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┐
│ ASINCRÓNICO - UserRegisteredEvent dispara handlers            │
└─ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ┘

  UserRegisteredEvent emitido
          │
          ├─────────────────────────────────────────────┐
          │                                             │
          ▼                                             ▼
  ┌────────────────────────────┐          ┌────────────────────────────┐
  │ UserRegisteredHandler      │          │ (Otros handlers si existen)│
  │ @EventsHandler             │          │                            │
  └────────┬───────────────────┘          └────────────────────────────┘
           │
           ├─ ACTUALIZAR READ MODEL ✅
           │  └─► await userReadModelProjection.addUser({
           │         id, email, firstName, lastName, status, createdAt
           │      })
           │      └─► INSERT INTO userReadModel (...)
           │
           │      Ahora Las QUERIES pueden buscar rápido:
           │      ├─ GetUserByEmailQuery ✅
           │      ├─ GetAllUsersQuery ✅
           │      └─ GetUserStatsQuery ✅
           │
           ├─ ENVIAR EMAIL ✅
           │  └─► await emailService.sendVerificationEmail({
           │         to: email,
           │         verificationToken: token,
           │         userName: name
           │      })
           │      └─► Email enviado al usuario
           │
           ├─ CREAR NOTIFICACIÓN ✅
           │  └─► await notificationProjection.create({
           │         userId: newUser.id,
           │         type: 'WELCOME',
           │         message: '¡Bienvenido!'
           │      })
           │
           └─ LOG ✅
              └─► logger.log('✅ Usuario procesado: ' + email)


DATABASE STATE DESPUÉS:
┌────────────────────────────────────────────────────────┐
│ Write Model (user table)                               │
├────────────────────────────────────────────────────────┤
│ ✅ Usuario creado con id=1, email='user@example.com'  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Read Model (userReadModel table)                       │
├────────────────────────────────────────────────────────┤
│ ✅ Usuario agregado                                    │
│ ✅ Disponible para queries rápidas                     │
│ ✅ Status: 'PENDING_EMAIL_VERIFICATION'                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Email Service (async)                                  │
├────────────────────────────────────────────────────────┤
│ ✅ Email de verificación enviado a user@example.com   │
│ ✅ Token de verificación incluido                      │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Notification (notificationProjection)                  │
├────────────────────────────────────────────────────────┤
│ ✅ Notificación 'WELCOME' creada para user            │
│ ✅ Usuario verá mensaje en dashboard                   │
└────────────────────────────────────────────────────────┘
```

---

## 3️⃣ COMPARACIÓN: ANTES vs DESPUÉS

### ANTES (Actual) ❌

```typescript
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor() {}
  async handle(event: UserRegisteredEvent): Promise<void> {
    console.log("UserRegisteredEvent handled");
    // ❌ EL HANDLER TERMINA AQUÍ - NO HACE NADA MÁS
  }
}

// RESULTADO:
// - Read model vacío ❌
// - Email no enviado ❌
// - Notificación no creada ❌
// - Usuario no puede hacer login porque read model está vacío ❌
```

### DESPUÉS (Mejorado) ✅

```typescript
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor(
    private emailService: EmailService,
    private userReadModelProjection: UserReadModelProjection,
    private notificationProjection: NotificationProjection,
    private logger: Logger
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    try {
      // 1. Actualizar read model ✅
      await this.userReadModelProjection.addUser({
        id: event.payload.id,
        email: event.payload.email,
        firstName: event.payload.firstName,
        lastName: event.payload.lastName,
        status: "PENDING_EMAIL_VERIFICATION",
        createdAt: new Date()
      });

      // 2. Enviar email ✅
      await this.emailService.sendVerificationEmail({
        to: event.payload.email,
        userName: event.payload.firstName
      });

      // 3. Crear notificación ✅
      await this.notificationProjection.create({
        userId: event.payload.id,
        type: "WELCOME",
        message: "¡Bienvenido!"
      });

      this.logger.log(`✅ Usuario registrado y procesado: ${event.payload.email}`);
    } catch (error) {
      // ⚠️ Decidir si relanzar error o solo log
      // Para emails, usualmente solo log (no bloquear el flujo)
      this.logger.error(`Error procesando usuario:`, error);
    }
  }
}

// RESULTADO:
// - Read model actualizado ✅
// - Email enviado ✅
// - Notificación creada ✅
// - Usuario puede hacer login porque read model tiene datos ✅
```

---

## 4️⃣ DONDE VAN LOS DATOS EN CQRS

### WRITE MODEL (Datos Normalizados)

```
┌──────────────────────────────────────────┐
│ USER (Write Model)                       │
├──────────────────────────────────────────┤
│ id (PK)              INTEGER             │
│ email                VARCHAR (UNIQUE)    │
│ password             VARCHAR (hashed)    │
│ firstName            VARCHAR             │
│ lastName             VARCHAR             │
│ roleId (FK)          INTEGER             │
│ isVerified           BOOLEAN             │
│ createdAt            TIMESTAMP           │
│ updatedAt            TIMESTAMP           │
│                                          │
│ ✅ Normalizados                          │
│ ✅ Para INSERT/UPDATE                    │
│ ✅ Fuente de verdad                      │
└──────────────────────────────────────────┘
```

### READ MODEL (Datos Desnormalizados/Optimizados)

```
┌──────────────────────────────────────────────────┐
│ USER_READ_MODEL (Read Model)                     │
├──────────────────────────────────────────────────┤
│ id (PK)                      INTEGER             │
│ email                        VARCHAR             │
│ firstName                    VARCHAR             │
│ lastName                     VARCHAR             │
│ fullName                     VARCHAR (calculado) │
│ status                       ENUM                │
│ accountAge_days              INTEGER (calculado) │
│ lastLoginAt                  TIMESTAMP           │
│ createdAt                    TIMESTAMP           │
│                                                  │
│ ✅ Desnormalizados (sin joins)                   │
│ ✅ Para SELECT/QUERIES rápidas                   │
│ ✅ Se actualiza con eventos                      │
│ ✅ Puede tener más/menos datos que write model   │
└──────────────────────────────────────────────────┘
```

### SINCRONIZACIÓN

```
COMANDO REGISTRAR USUARIO
    │
    ▼
┌─────────────────┐
│ Write Model     │ ← INSERT
└────────┬────────┘
         │
         ▼
    EVENTO EMITIDO
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌──────────────────┐    ┌──────────────────┐
│ Read Model 1     │    │ Read Model 2     │
│ Notificaciones   │    │ Caché             │
└──────────────────┘    └──────────────────┘

Latencia:
- Write model: < 10ms (sincrónico)
- Read models: 100-500ms (asincrónico)

EVENTUAL CONSISTENCY: Los read models se actualizan
"eventualmente" después de que se emite el evento.
```

---

## 5️⃣ ERROR HANDLING CONSISTENTE

### ❌ ANTES (Inconsistente)

```typescript
// En SchoolProjection
catch (error) {
  this.logger.error(`Error: `, error);
  throw new BadRequestException("Error general");
}

// En UserProjection
catch (error) {
  handlePrismaError("UserProjection", error);
}

// En Handler
catch (error) {
  throw new Error("Algo falló");
}

// PROBLEMA: Cada uno maneja errores diferente ❌
```

### ✅ DESPUÉS (Centralizado)

```typescript
// Todos usan el mismo servicio
@Injectable()
export class ErrorHandlingService {
  handlePrismaError(context: string, error: any): never {
    if (error.code === "P2002") throw new ConflictException("Ya existe");
    if (error.code === "P2025") throw new NotFoundException("No encontrado");
    throw new InternalServerErrorException("Error BD");
  }
}

// En SchoolProjection
try {
  return await this.prisma.school.create({ data });
} catch (error) {
  this.errorHandler.handlePrismaError("SchoolProjection.add", error);
  //                                   ↑ Mismo servicio
}

// En UserProjection
try {
  return await this.prisma.user.create({ data });
} catch (error) {
  this.errorHandler.handlePrismaError("UserProjection.register", error);
  //                                   ↑ Mismo servicio
}

// RESULTADO: Todos manejan errores igual ✅
```

---

## 6️⃣ FLUJO DE UNA QUERY (Lectura)

```
CLIENT
  │
  └─► GET /api/users/123
       │
       ▼
  ┌──────────────────────┐
  │  UserController      │
  │  @Get(':id')         │
  └──────────┬───────────┘
             │
             └─► queryBus.execute(GetUserByIdQuery)
                  │
                  ▼
             ┌──────────────────────────────────┐
             │  GetUserByIdQueryHandler         │
             │  @QueryHandler                   │
             └──────────┬───────────────────────┘
                        │
                        └─► SELECT FROM userReadModel WHERE id = 123
                             │
                             ▼
                        ┌──────────────────┐
                        │ Datos rápidos    │
                        │ (sin joins)      │
                        │ (precalculados)  │
                        └──────────────────┘
                             │
                             └─► JSON Response
                                  │
                                  ▼
                                 CLIENT

LATENCIA:
  - Read model query: < 10ms (muy rápida)
  - Sin joins: Sin N+1 problems
  - Datos precalculados: Sin cálculos en query
```

---

## 7️⃣ IDEMPOTENCIA (Cuando un Cliente Reintenta)

```
REQUEST 1
  │
  ├─► POST /api/survey-data
  │   Headers: { "Idempotency-Key": "abc-123" }
  │   Body: { ... }
  │
  ├─ CreateSurveyDataCommand(data, "abc-123")
  │  └─ cache.get("idempotency:abc-123") → null
  │     └─ Crear registro
  │        └─ cache.set("idempotency:abc-123", result, 3600)
  │           └─ Retornar { statusCode: 201, data: {...} }
  │

REQUEST 2 (Reintento del cliente)
  │
  ├─► POST /api/survey-data
  │   Headers: { "Idempotency-Key": "abc-123" }  ← MISMA KEY
  │   Body: { ... }
  │
  ├─ CreateSurveyDataCommand(data, "abc-123")
  │  └─ cache.get("idempotency:abc-123") → result encontrado! ✅
  │     └─ Retornar { statusCode: 201, data: {...} }
  │
  │ ✅ RESULTADO: Mismo resultado, sin crear duplicado
  │

CON IDEMPOTENCIA:
  - Request 1: 1 registro creado
  - Request 2: 0 registros nuevos, respuesta desde caché
  - TOTAL: 1 registro ✅

SIN IDEMPOTENCIA:
  - Request 1: 1 registro creado
  - Request 2: 1 registro creado (duplicado!)
  - TOTAL: 2 registros ❌
```

---

## 📊 TABLA COMPARATIVA FINAL

| Aspecto                    | ❌ ANTES              | ✅ DESPUÉS                           |
| -------------------------- | --------------------- | ------------------------------------ |
| **Event Handlers**         | Solo console.log      | Lógica real (emails, notificaciones) |
| **Read Models**            | No se actualizan      | Se actualizan automáticamente        |
| **Type Safety**            | `any` por todos lados | Interfaces específicas               |
| **Error Handling**         | Inconsistente         | Centralizado en servicio             |
| **Idempotencia**           | No existe             | Implementada                         |
| **Performance de Queries** | Lenta (joins)         | Rápida (desnormalizado)              |
| **Eventual Consistency**   | No                    | Sí (eventual consistency)            |
| **Mantenibilidad**         | Difícil               | Fácil                                |
| **CQRS Score**             | 7/10                  | 9/10                                 |

---

**Próximo paso: Leer `CQRS_IMPLEMENTATION_GUIDE.md` para código listo para copiar-pegar**
