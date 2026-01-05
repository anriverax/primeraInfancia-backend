# CQRS: Mejores Prácticas y Auditoría de tu Implementación

## 📋 Tabla de Contenidos

1. [Resumen de CQRS](#resumen-de-cqrs)
2. [Estado Actual de tu Implementación](#estado-actual)
3. [✅ Lo que Estás Haciendo Bien](#lo-que-estás-haciendo-bien)
4. [⚠️ Áreas de Mejora](#áreas-de-mejora)
5. [🛠️ Recomendaciones Prácticas](#recomendaciones-prácticas)
6. [📝 Ejemplos de Implementación](#ejemplos-de-implementación)

---

## Resumen de CQRS

**CQRS (Command Query Responsibility Segregation)** es un patrón arquitectónico que separa:

- **Commands**: Operaciones que **modifican** el estado (CREATE, UPDATE, DELETE)
- **Queries**: Operaciones que **leen** el estado (SELECT, GET)

### Principios Clave de CQRS

```
┌─────────────────────────────────────────┐
│         CLIENT REQUEST                  │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                 ▼
    COMMAND            QUERY
  (Escribe/          (Solo Lee)
   Modifica)             │
       │                 ▼
       ▼          ┌──────────────┐
   ┌────────┐     │ Read Model   │
   │ Write  │     │ (Proyecciones)
   │ Model  │     │ (Optimizado) │
   └────┬───┘     └──────────────┘
        │
        ▼
   ┌──────────────┐
   │ Event Store  │
   │ / Database   │
   └──────────────┘
```

---

## Estado Actual de tu Implementación

### Stack Tecnológico

- ✅ **NestJS** con `@nestjs/cqrs`
- ✅ **Prisma ORM**
- ✅ **PostgreSQL**
- ✅ Módulos por dominio (Domain-Driven Design)

### Estructura Identificada

```
src/core/
├── auth/
│   └── cqrs/
│       ├── commands/
│       │   ├── register/registerUser.command.ts
│       │   ├── changePasswd/changePasswd.handler.ts
│       │   └── verifyEmail/verifyEmail.handler.ts
│       ├── queries/
│       │   ├── user/findUniqueUser.query.ts
│       │   └── ...
│       ├── events/
│       │   ├── registered/userRegistered.event.ts
│       │   └── registered/userRegistered.handler.ts
│       └── projections/
│           ├── user.projection.ts
│           └── userkey.projection.ts
├── catalogue/
│   ├── school/
│   ├── department/
│   └── zone/
├── attendance/
└── ... (otros módulos)
```

---

## ✅ Lo que Estás Haciendo Bien

### 1. **Separación Clara de Responsabilidades** ⭐

```typescript
// ✅ CORRECTO: Command aislado
export class RegisterUserCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IAuth) {
    super();
  }
}

// ✅ CORRECTO: Handler específico
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  async execute(command: RegisterUserCommand): Promise<NestResponse<void>> {
    // Lógica de registro
  }
}
```

### 2. **Proyecciones para Persistencia** ⭐

```typescript
// ✅ CORRECTO: Proyección como capa de acceso a datos
@Injectable()
export class UserProjection {
  constructor(private prisma: PrismaService) {}

  async register(data: IAuthEvent): Promise<void> {
    // Persistencia de datos
  }
}
```

### 3. **Uso de QueryBus y CommandBus en Controladores** ⭐

```typescript
// ✅ CORRECTO: Controlador delega a buses
@Controller()
export class SchoolController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Post("add")
  async add(@Body() data: SchoolDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new AddShoolCommand(data));
  }
}
```

### 4. **Eventos para Auditoría y Flujos Asincrónicos** ⭐

```typescript
// ✅ CORRECTO: Eventos emitidos tras cambios
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private eventBus: EventBusWithStore) {}

  async execute(command: RegisterUserCommand): Promise<NestResponse<void>> {
    // ... lógica de registro
    await this.eventBus.publish(new UserRegisteredEvent(userData));
  }
}
```

### 5. **Módulos Organizados por Dominio** ⭐

Cada módulo agrupa su propio CQRS:

- `auth.module.ts` → Importa `CqrsModule` una sola vez
- Los handlers se registran localmente

---

## ⚠️ Áreas de Mejora

### 1. **❌ Proyecciones No Se Actualizan Tras Eventos**

**Problema Identificado:**
En `verifyEmail.handler.ts`:

```typescript
// ❌ PROBLEMA: La proyección NO se actualiza tras el evento
async execute(command: VerifyEmailCommand): Promise<NestResponse<boolean>> {
  const result = await this.authService.verifyEmailCode(verifyCode);

  // ⚠️ COMENTADO: La proyección no se actualiza
  // await this.userProjection.updatePasswdIsVerified({ ... });

  return { statusCode: 201, message: "..." };
}
```

**Por qué es un problema:**

- El estado de lectura (proyección) se desfasa del estado de escritura
- Los lectores pueden obtener datos inconsistentes
- Viola el principio de **eventual consistency** de CQRS

**Solución:**

```typescript
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly userProjection: UserProjection,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: VerifyEmailCommand): Promise<NestResponse<boolean>> {
    const { verifyCode } = command.data;

    // 1. Verificar y obtener datos del usuario
    const user = await this.authService.verifyEmailCode(verifyCode);
    if (!user) {
      throw new BadRequestException("Código inválido o expirado");
    }

    // 2. Ejecutar comando (modificar write model)
    await this.userProjection.updatePasswdIsVerified({
      id: user.id,
      email: user.email,
      data: { isVerified: true }
    });

    // 3. Emitir evento (actualizará read model y ejecutará handlers)
    await this.eventBus.publish(new UserEmailVerifiedEvent({ userId: user.id, email: user.email }));

    return {
      statusCode: 201,
      message: "¡Correo electrónico verificado exitosamente!"
    };
  }
}
```

---

### 2. **❌ Event Handlers No Actualizan las Proyecciones de Lectura**

**Problema Identificado:**

```typescript
// ❌ PROBLEMA: El handler solo hace log
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  async handle(event: UserRegisteredEvent): Promise<void> {
    const { payload } = event;
    console.log("UserRegisteredEvent handled for user:", payload.email);
    // ❌ NO actualiza el read model / caché
    // ❌ NO envía notificaciones
    // ❌ NO ejecuta flujos secundarios
  }
}
```

**Por qué es un problema:**

- Los eventos no tienen propósito más allá de logging
- No se construyen proyecciones de lectura optimizadas
- Se pierde la oportunidad de ejecutar lógica asincrónica (emails, notificaciones)

**Solución:**

```typescript
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationProjection: NotificationProjection,
    private readonly userReadModelProjection: UserReadModelProjection
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const { payload } = event;

    // 1. Actualizar el read model (para queries)
    await this.userReadModelProjection.addUserToReadModel({
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      createdAt: new Date()
    });

    // 2. Enviar email de verificación
    await this.emailService.sendVerificationEmail(payload.email, payload.verificationToken);

    // 3. Crear notificación
    await this.notificationProjection.create({
      userId: payload.userId,
      type: "REGISTRATION_WELCOME",
      message: `Bienvenido ${payload.name}!`
    });

    console.log(`✅ Usuario registrado y procesado: ${payload.email}`);
  }
}
```

---

### 3. **⚠️ Falta Separación Entre Write Model y Read Model**

**Problema Identificado:**
Las projections escriben y leen del mismo schema de Prisma:

```typescript
// ⚠️ PROBLEMA: Misma tabla para lectura y escritura
export class SchoolProjection {
  async add(data: ICreateSchool): Promise<School> {
    // ✅ Escribe en la tabla
    return await this.prisma.school.create({ data });
  }
}

// En queries: se lee de la MISMA tabla
export class GetAllSchoolPaginationHandler {
  async execute(query: GetAllSchoolPaginationQuery): Promise<ISchoolWithPagination> {
    // ✅ Lee de la MISMA tabla
    return await this.prisma.school.findMany({ ... });
  }
}
```

**Por qué puede ser un problema:**

- En CQRS puro, el write model y read model son **bases de datos separadas**
- Esto permite optimizar cada modelo para su caso de uso
- La falta de separación limita el escalado independiente

**Nota Importante:**
✅ Esto **es aceptable** si:

- Tienes un volumen de datos pequeño a medio
- La consistencia eventual es tolerada
- Quieres mantener la simplicidad

**Mejora (Opcional):**

```typescript
// ✅ MEJOR: Proyecciones separadas para lectura
@Injectable()
export class SchoolReadModelProjection {
  constructor(private prisma: PrismaService) {}

  // Tabla optimizada para lectura
  async getWithStats(schoolId: number) {
    return await this.prisma.schoolReadModel.findUnique({
      where: { id: schoolId },
      include: {
        statistics: true, // Datos desnormalizados
        cache: true // Datos precalculados
      }
    });
  }
}

// ✅ Write model escribe en ambas tablas
@CommandHandler(AddSchoolCommand)
export class AddSchoolHandler implements ICommandHandler<AddSchoolCommand> {
  constructor(
    private schoolProjection: SchoolProjection, // Write
    private schoolReadModelProjection: SchoolReadModelProjection // Read
  ) {}

  async execute(command: AddSchoolCommand): Promise<{ id: number }> {
    // 1. Escribir en write model
    const school = await this.schoolProjection.add(command.data);

    // 2. Actualizar read model
    await this.schoolReadModelProjection.create({
      id: school.id,
      name: school.name
      // ... datos optimizados para lectura
    });

    return { id: school.id };
  }
}
```

---

### 4. **⚠️ No Hay Validación de Invariantes en Commands**

**Problema Identificado:**

```typescript
// ❌ PROBLEMA: Validación ocurre en el servicio, no en el command
export class CreateAttendanceCommand extends Command<any> {
  constructor(
    public readonly data: any,  // ❌ `any` es mal tipo
    public readonly userId: number
  ) {
    super();
  }
}

// ❌ La validación ocurre en la proyección
async register(data: any, userId: number) {
  // Validaciones aquí?
}
```

**Solución - Validación Fuerte de Tipos:**

```typescript
// ✅ MEJOR: Command con tipos estrictos
export interface ICreateAttendanceData {
  eventInstanceId: number;
  startTime: Date;
  notes?: string;
}

export class CreateAttendanceCommand implements ICommand {
  constructor(
    public readonly data: ICreateAttendanceData,
    public readonly userId: number
  ) {
    // Validar invariantes del dominio
    if (!data.eventInstanceId) {
      throw new BadRequestException("eventInstanceId es requerido");
    }
    if (!data.startTime) {
      throw new BadRequestException("startTime es requerido");
    }
    if (data.startTime > new Date()) {
      throw new BadRequestException("No puedes marcar asistencia en el futuro");
    }
  }
}

// ✅ MEJOR: Validación con class-validator
import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  @IsNotEmpty()
  eventInstanceId: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsOptional()
  notes?: string;
}

// ✅ MEJOR: DTO a Command
@Post()
async create(
  @Body() dto: CreateAttendanceDto,
  @Req() req: any
): Promise<NestResponse<Attendance>> {
  return this.commandBus.execute(
    new CreateAttendanceCommand(dto, req.user.id)
  );
}
```

---

### 5. **⚠️ Error Handling Inconsistente**

**Problema Identificado:**

```typescript
// ❌ Diferentes patrones de error
// En algunas projections:
catch (error) {
  this.logger.error(`❌ Error de prisma: `, error);
  throw new BadRequestException("Se ha producido un error...");
}

// En otras:
catch (error) {
  handlePrismaError("UserProjection", error);
}

// En handlers:
throw new Error("El código de verificación es incorrecto");
```

**Solución - Centralizar Error Handling:**

```typescript
// ✅ Crear un servicio centralizado de errores
@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger("ErrorHandling");

  handlePrismaError(context: string, error: any): never {
    this.logger.error(`[${context}] Prisma error:`, error);

    if (error.code === "P2002") {
      throw new ConflictException("Este registro ya existe");
    }
    if (error.code === "P2025") {
      throw new NotFoundException("Registro no encontrado");
    }

    throw new InternalServerErrorException("Error en la base de datos");
  }

  handleBusinessLogicError(error: Error): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    this.logger.error("Unexpected business error:", error);
    throw new InternalServerErrorException(error.message);
  }
}

// ✅ Usar en projections
@Injectable()
export class SchoolProjection {
  constructor(
    private prisma: PrismaService,
    private errorHandler: ErrorHandlingService
  ) {}

  async add(data: ICreateSchool): Promise<School> {
    try {
      return await this.prisma.school.create({ data });
    } catch (error) {
      this.errorHandler.handlePrismaError("SchoolProjection.add", error);
    }
  }
}
```

---

### 6. **⚠️ Falta de Idempotencia en Commands**

**Problema Identificado:**
Si un command se ejecuta dos veces por error (network retry, etc.), puede crear duplicados:

```typescript
// ❌ PROBLEMA: No es idempotente
@CommandHandler(CreateSurveyDataCommand)
export class CreateSurveyDataHandler {
  async execute(command: CreateSurveyDataCommand): Promise<NestResponse<SurveyData>> {
    const { data } = command;
    const res = await this.surveyDataProjection.create(data);
    return { statusCode: 201, message: "...", data: res };
  }
}

// Si se ejecuta 2 veces → 2 registros de encuesta
```

**Solución - Agregar Idempotencia:**

```typescript
export class CreateSurveyDataCommand implements ICommand {
  constructor(
    public readonly data: ICreateSurveyData,
    public readonly idempotencyKey: string  // UUID único para esta operación
  ) {}
}

@CommandHandler(CreateSurveyDataCommand)
export class CreateSurveyDataHandler implements ICommandHandler<CreateSurveyDataCommand> {
  constructor(
    private surveyDataProjection: SurveyDataProjection,
    private cache: CacheService
  ) {}

  async execute(command: CreateSurveyDataCommand): Promise<NestResponse<SurveyData>> {
    const { data, idempotencyKey } = command;

    // 1. Verificar si ya fue procesado
    const cached = await this.cache.get(`idempotency:${idempotencyKey}`);
    if (cached) {
      return cached;  // Retornar resultado previo
    }

    // 2. Crear registro
    const res = await this.surveyDataProjection.create(data);
    const response = {
      statusCode: 201,
      message: "Respuesta al anexo creada con éxito.",
      data: res
    };

    // 3. Cachear resultado
    await this.cache.set(
      `idempotency:${idempotencyKey}`,
      response,
      3600  // 1 hora
    );

    return response;
  }
}

// ✅ En el controlador
@Post()
async create(
  @Body() dto: CreateSurveyDataDto,
  @Headers('idempotency-key') idempotencyKey: string
): Promise<NestResponse<SurveyData>> {
  if (!idempotencyKey) {
    throw new BadRequestException('Header idempotency-key es requerido');
  }

  return this.commandBus.execute(
    new CreateSurveyDataCommand(dto, idempotencyKey)
  );
}
```

---

### 7. **⚠️ Falta de Snapshot Events (Event Sourcing)**

**Nota:** Veo que tienes `EventBusWithStore` pero no está completamente implementado.

Si usas Event Sourcing, necesitas snapshots para no recalcular todo el historial:

```typescript
// ✅ MEJORAR: Agregar snapshots cada N eventos
@Injectable()
export class EventStoreService {
  async appendEvent(aggregateId: string, event: DomainEvent): Promise<void> {
    // 1. Guardar evento
    await this.saveEvent(event);

    // 2. Contar eventos del agregado
    const eventCount = await this.getEventCount(aggregateId);

    // 3. Si hay muchos eventos, crear snapshot
    if (eventCount % 100 === 0) {
      const aggregate = await this.rebuildAggregate(aggregateId);
      await this.saveSnapshot(aggregateId, aggregate);
    }
  }

  async rebuildAggregate(aggregateId: string) {
    // 1. Intenta cargar snapshot más reciente
    const snapshot = await this.getLatestSnapshot(aggregateId);
    let state = snapshot?.state || {};

    // 2. Aplica eventos posteriores al snapshot
    const eventsAfterSnapshot = await this.getEventsAfterSnapshot(aggregateId, snapshot?.version || 0);

    for (const event of eventsAfterSnapshot) {
      state = this.applyEvent(state, event);
    }

    return state;
  }
}
```

---

## 🛠️ Recomendaciones Prácticas

### Prioridad 1: Alto Impacto, Bajo Esfuerzo

**1. Conectar Event Handlers a Proyecciones de Lectura** ⭐⭐⭐

- Actualizar read models tras eventos
- Validar que los handlers no estén vacíos

```typescript
// ✅ Checklist
// [ ] Cada @EventHandler implementa lógica (no solo console.log)
// [ ] Cada comando importante emite eventos
// [ ] Los eventos actualizan read models
```

**2. Agregar Validación de Tipos en Commands**

- Reemplazar `any` con tipos específicos
- Usar DTOs con class-validator

```typescript
// Archivos a revisar:
// - src/core/new/attendance/cqrs/command/create/createAttendance.command.ts
// - src/core/attendance/cqrs/command/create/createAttendance.command.ts
```

**3. Centralizar Error Handling**

- Crear servicio reutilizable
- Lanzar excepciones estándar de NestJS

---

### Prioridad 2: Medio Impacto, Medio Esfuerzo

**4. Implementar Idempotencia en Commands Críticos**

- Usar `idempotency-key` header
- Cachear resultados en Redis

**5. Documentar el Flujo CQRS**

- Mapear qué commands actualizan qué read models
- Documentar latencia de eventual consistency

**6. Agregar Metricas**

```typescript
@Injectable()
export class CqrsMetricsService {
  private commandCount = 0;
  private commandErrors = 0;
  private queryCount = 0;
  private avgCommandTime = 0;

  async trackCommand<T>(command: ICommand, handler: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await handler();
      this.commandCount++;
      return result;
    } catch (error) {
      this.commandErrors++;
      throw error;
    } finally {
      const duration = Date.now() - start;
      this.avgCommandTime = (this.avgCommandTime + duration) / 2;
    }
  }
}
```

---

### Prioridad 3: Futuro, Bajo Impacto en Corto Plazo

**7. Considerar Event Sourcing Completo** (Future)

- Actualmente tienes write model tradicional
- Event Sourcing permitiría recrear estado en cualquier punto

**8. CQRS Completamente Separado** (Future)

- Write DB y Read DB completamente separadas
- Replicación con Kafka o similar

---

## 📝 Ejemplos de Implementación

### Patrón Completo de Command con Evento

```typescript
// ✅ PATRÓN RECOMENDADO

// 1. COMMAND
export class RegisterUserCommand implements ICommand {
  constructor(public readonly data: RegisterUserDto) {}
}

// 2. HANDLER
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private userProjection: UserProjection,
    private eventBus: EventBus,
    private logger: Logger
  ) {}

  async execute(command: RegisterUserCommand): Promise<NestResponse<void>> {
    const { data } = command;

    try {
      // 1. Validaciones
      const existingUser = await this.userProjection.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException("El usuario ya existe");
      }

      // 2. Crear en write model
      const newUser = await this.userProjection.register(data);

      // 3. Emitir evento
      await this.eventBus.publish(
        new UserRegisteredEvent({
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name
        })
      );

      this.logger.log(`Usuario registrado: ${newUser.email}`);

      return {
        statusCode: 201,
        message: "Usuario registrado exitosamente"
      };
    } catch (error) {
      this.logger.error("Error en RegisterUserHandler:", error);
      throw error;
    }
  }
}

// 3. EVENT
export class UserRegisteredEvent implements IEvent {
  constructor(
    public readonly aggregate: {
      userId: number;
      email: string;
      name: string;
    }
  ) {}
}

// 4. EVENT HANDLER
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor(
    private emailService: EmailService,
    private notificationProjection: NotificationProjection,
    private userReadModelProjection: UserReadModelProjection,
    private logger: Logger
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const { aggregate } = event;

    try {
      // 1. Actualizar read model
      await this.userReadModelProjection.create({
        id: aggregate.userId,
        email: aggregate.email,
        name: aggregate.name,
        status: "PENDING_VERIFICATION",
        createdAt: new Date()
      });

      // 2. Enviar email
      await this.emailService.sendWelcomeEmail(aggregate.email);

      // 3. Crear notificación
      await this.notificationProjection.create({
        userId: aggregate.userId,
        type: "WELCOME",
        title: "Bienvenido",
        message: `Hola ${aggregate.name}, verifica tu email para continuar`
      });

      this.logger.log(`✅ Evento UserRegistered procesado para: ${aggregate.email}`);
    } catch (error) {
      this.logger.error("Error procesando UserRegisteredEvent:", error);
      // ⚠️ Nota: Considera si debes relanzar el error
      // Si relanzas, el evento fallará y posiblemente se reintentará
      // Si no relanzas, el evento se marca como procesado
    }
  }
}

// 5. QUERY (para verificar la lectura)
export class GetUserByIdQuery implements IQuery {
  constructor(public readonly userId: number) {}
}

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private userReadModelProjection: UserReadModelProjection) {}

  async execute(query: GetUserByIdQuery): Promise<UserReadModel> {
    return this.userReadModelProjection.findById(query.userId);
  }
}

// 6. CONTROLADOR
@Controller("auth")
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterUserDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Get(":userId")
  @AuthRequired()
  async getUser(@Param("userId", ParseIntPipe) userId: number): Promise<NestResponse<UserReadModel>> {
    const data = await this.queryBus.execute(new GetUserByIdQuery(userId));
    return {
      statusCode: 200,
      message: "Usuario obtenido",
      data
    };
  }
}
```

---

## 📊 Matriz de Cumplimiento CQRS

| Aspecto                     | Estado           | Nota                                      |
| --------------------------- | ---------------- | ----------------------------------------- |
| Separación Commands/Queries | ✅ Completo      | Bien implementado                         |
| CommandBus en Controladores | ✅ Completo      | Consistente                               |
| QueryBus en Controladores   | ✅ Completo      | Consistente                               |
| Event Handling              | ⚠️ Parcial       | Handlers están vacíos                     |
| Read Model Updates          | ⚠️ Parcial       | No se actualizan tras eventos             |
| Error Handling              | ⚠️ Inconsistente | Diferentes patrones                       |
| Validación de Types         | ⚠️ Débil         | Uso excesivo de `any`                     |
| Idempotencia                | ❌ No            | No implementada                           |
| Event Sourcing              | ⚠️ Incompleto    | `EventBusWithStore` existe pero no se usa |
| Documentación               | ❌ No            | Faltan comentarios                        |

---

## ✅ Plan de Acción Recomendado

**Fase 1: Corto Plazo (1-2 semanas)**

1. [ ] Actualizar todos los Event Handlers para implementar lógica real
2. [ ] Reemplazar `any` con tipos específicos en Commands
3. [ ] Centralizar error handling
4. [ ] Documentar flujo CQRS del módulo `auth`

**Fase 2: Mediano Plazo (2-4 semanas)**

1. [ ] Implementar idempotencia en commands críticos
2. [ ] Agregar read models separadas
3. [ ] Implementar métricas y monitoreo

**Fase 3: Largo Plazo (1-3 meses)**

1. [ ] Considerar Event Sourcing completo
2. [ ] Separar write y read databases
3. [ ] Agregar CQRS en módulos restantes

---

## 🔗 Referencias

- [NestJS CQRS Documentation](https://docs.nestjs.com/recipes/cqrs)
- [CQRS Pattern by Martin Fowler](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing by Martin Fowler](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)

---

**Generado:** 22 de diciembre de 2025
**Proyecto:** Primera Infancia - Backend
