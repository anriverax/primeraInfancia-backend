# Guía de Implementación: Mejoras CQRS Prácticas

## 🎯 Objetivo

Implementar las mejores prácticas de CQRS en tu proyecto con ejemplos concretos.

---

## 1️⃣ Antes y Después: Conectar Event Handlers a Proyecciones

### ❌ ANTES (Actual)

**Archivo:** `src/core/auth/cqrs/events/registered/userRegistered.handler.ts`

```typescript
import { EventsHandler } from "@nestjs/cqrs";
import { UserRegisteredEvent } from "./userRegistered.event";

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler {
  constructor() {}
  async handle(event: UserRegisteredEvent): Promise<void> {
    const { payload } = event;
    console.log("UserRegisteredEvent handled for user:", payload.email);
    // ❌ No hace nada más - evento sin propósito
  }
}
```

### ✅ DESPUÉS (Mejorado)

```typescript
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Injectable, Logger } from "@nestjs/common";
import { UserRegisteredEvent } from "./userRegistered.event";
import { EmailService } from "@/services/email/email.service";
import { UserReadModelProjection } from "../../projections/userReadModel.projection";

/**
 * Event Handler para UserRegisteredEvent
 *
 * Responsabilidades:
 * - Actualizar el modelo de lectura (read model)
 * - Enviar emails de bienvenida
 * - Crear notificaciones
 * - Ejecutar flujos secundarios asincronos
 */
@Injectable()
@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  private readonly logger = new Logger(UserRegisteredHandler.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly userReadModelProjection: UserReadModelProjection
  ) {}

  /**
   * Maneja el evento de usuario registrado
   * @param event Evento con datos del usuario registrado
   */
  async handle(event: UserRegisteredEvent): Promise<void> {
    const { payload } = event;

    try {
      // 1. Actualizar el read model para consultas rápidas
      await this.userReadModelProjection.addUserToReadModel({
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        status: "PENDING_EMAIL_VERIFICATION",
        createdAt: new Date()
      });

      // 2. Enviar email de verificación de forma asincrónica
      await this.emailService.sendVerificationEmail({
        to: payload.email,
        verificationToken: payload.verificationToken,
        userName: `${payload.firstName} ${payload.lastName}`
      });

      this.logger.log(`✅ Usuario registrado procesado exitosamente: ${payload.email}`);
    } catch (error) {
      // ⚠️ Importante: Decidir qué hacer en caso de error
      // Opción 1: Relanzar error (el evento fallará y se reintentará)
      // Opción 2: Log del error (el evento se marca como procesado)
      //
      // Para email, usualmente es Opción 2 (sin relanzar)
      // para que no bloquee el flujo principal
      this.logger.error(`❌ Error procesando UserRegisteredEvent para ${payload.email}:`, error);

      // Aquí puedes:
      // - Guardar el evento fallido para reintentar después
      // - Enviar alerta a los administradores
      // - No relanzar el error para no bloquear el flujo
    }
  }
}
```

### 📝 Archivos a Crear/Actualizar

**Crear:** `src/core/auth/cqrs/projections/userReadModel.projection.ts`

```typescript
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";

export interface IUserReadModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: "ACTIVE" | "PENDING_EMAIL_VERIFICATION" | "SUSPENDED";
  createdAt: Date;
}

/**
 * Proyección para el Read Model de Usuarios
 *
 * Responsabilidad: Mantener una vista optimizada para lectura
 * Esta tabla puede estar desnormalizada y contener datos precalculados
 */
@Injectable()
export class UserReadModelProjection {
  private readonly logger = new Logger(UserReadModelProjection.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Agrega un usuario al read model
   * Se llama cuando se emite UserRegisteredEvent
   */
  async addUserToReadModel(data: IUserReadModel): Promise<void> {
    try {
      // ✅ Aquí podrías escribir en una tabla específica para lectura
      // Actualmente escribimos en la misma tabla, pero en CQRS puro
      // tendrías UserReadModel separada de User

      await this.prisma.user.update({
        where: { id: data.id },
        data: {
          // Actualizar campos relevantes del read model
          // En una arquitectura más compleja, esto sería otra tabla
        }
      });

      this.logger.debug(`Usuario agregado al read model: ${data.email}`);
    } catch (error) {
      this.logger.error(`Error agregando usuario al read model: ${data.email}`, error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario del read model
   */
  async getUserByEmail(email: string): Promise<IUserReadModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          // Agregar más campos del read model
          createdAt: true
        }
      });

      return user as IUserReadModel;
    } catch (error) {
      this.logger.error(`Error obteniendo usuario: ${email}`, error);
      return null;
    }
  }

  /**
   * Obtiene el conteo total de usuarios registrados
   */
  async getTotalUserCount(): Promise<number> {
    return this.prisma.user.count();
  }
}
```

---

## 2️⃣ Antes y Después: Validación de Tipos en Commands

### ❌ ANTES (Actual)

**Archivo:** `src/core/attendance/cqrs/command/create/createAttendance.command.ts`

```typescript
import { Command } from "@nestjs/cqrs";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceSessionProjection } from "../../projections/attendanceSession.projection";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CreateAttendanceCommand extends Command<any> {
  constructor(
    public readonly data: any, // ❌ any es inseguro
    public readonly userId: number
  ) {
    super();
  }
}

@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler implements ICommandHandler<CreateAttendanceCommand> {
  constructor(private readonly projection: AttendanceSessionProjection) {}

  async execute(command: CreateAttendanceCommand): Promise<any> {
    const { data, userId } = command;
    return await this.projection.register(data, userId);
  }
}
```

### ✅ DESPUÉS (Mejorado)

```typescript
import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Logger } from "@nestjs/common";
import { AttendanceSessionProjection } from "../../projections/attendanceSession.projection";
import { NestResponse } from "@/common/helpers/types";
import { Attendance } from "prisma/generated/client";

/**
 * DTO con validaciones para crear asistencia
 */
export interface ICreateAttendanceData {
  eventInstanceId: number;
  startTime: Date;
  notes?: string;
  location?: string;
}

/**
 * Command para crear una nueva sesión de asistencia
 *
 * Validaciones de negocio:
 * - El eventInstanceId debe ser válido
 * - El startTime no puede ser en el futuro
 * - El usuario debe estar autorizado para esta instancia de evento
 */
export class CreateAttendanceCommand extends Command<NestResponse<Attendance>> {
  readonly data: ICreateAttendanceData;
  readonly userId: number;

  constructor(data: ICreateAttendanceData, userId: number) {
    super();

    // ✅ Validar invariantes del dominio en el constructor
    this.validateData(data, userId);

    this.data = data;
    this.userId = userId;
  }

  /**
   * Valida que los datos del comando cumplan las invariantes del dominio
   */
  private validateData(data: ICreateAttendanceData, userId: number): void {
    // Validar que existan los campos requeridos
    if (!data || typeof data !== "object") {
      throw new BadRequestException("Los datos de asistencia son requeridos");
    }

    if (!Number.isInteger(data.eventInstanceId) || data.eventInstanceId <= 0) {
      throw new BadRequestException("eventInstanceId debe ser un número entero positivo");
    }

    if (!data.startTime || !(data.startTime instanceof Date)) {
      throw new BadRequestException("startTime debe ser una fecha válida");
    }

    // Validar que no sea en el futuro
    const now = new Date();
    if (data.startTime > now) {
      throw new BadRequestException("No puedes marcar asistencia en el futuro");
    }

    // Validar que no sea más de 1 hora en el pasado
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    if (data.startTime < oneHourAgo) {
      throw new BadRequestException("No puedes marcar asistencia con más de 1 hora de retraso");
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException("userId debe ser un número válido");
    }

    // Validaciones opcionales
    if (data.notes && typeof data.notes !== "string") {
      throw new BadRequestException("notes debe ser un texto");
    }

    if (data.location && typeof data.location !== "string") {
      throw new BadRequestException("location debe ser un texto");
    }
  }
}

/**
 * Handler que ejecuta el command CreateAttendance
 */
@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler implements ICommandHandler<CreateAttendanceCommand> {
  private readonly logger = new Logger(CreateAttendanceHandler.name);

  constructor(private readonly projection: AttendanceSessionProjection) {}

  async execute(command: CreateAttendanceCommand): Promise<NestResponse<Attendance>> {
    const { data, userId } = command;

    try {
      this.logger.log(
        `Creando asistencia para usuario ${userId} ` + `en evento ${data.eventInstanceId}`
      );

      // Aquí la proyección ya sabe que los datos son válidos
      const attendance = await this.projection.register(data, userId);

      return {
        statusCode: 201,
        message: "Asistencia registrada exitosamente",
        data: attendance
      };
    } catch (error) {
      this.logger.error(`Error creando asistencia para usuario ${userId}:`, error);
      throw error;
    }
  }
}
```

### 📝 DTO Mejorado

**Actualizar:** `src/core/attendance/dto/attendance.dto.ts`

```typescript
import { IsNumber, IsDateString, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * DTO para crear una nueva sesión de asistencia
 *
 * Validaciones automáticas con class-validator:
 * - eventInstanceId: Número entero positivo
 * - startTime: Fecha válida
 * - notes, location: Texto opcional
 */
export class CreateAttendanceDto {
  @ApiProperty({
    description: "ID de la instancia de evento",
    example: 1,
    type: Number
  })
  @IsNumber()
  @Min(1)
  eventInstanceId: number;

  @ApiProperty({
    description: "Hora de inicio de la asistencia (ISO 8601)",
    example: "2025-12-22T14:30:00Z",
    type: String
  })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({
    description: "Notas adicionales sobre la asistencia",
    example: "Llegó 5 minutos tarde",
    type: String
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: "Ubicación donde se marcó la asistencia",
    example: "Aula 101",
    type: String
  })
  @IsOptional()
  @IsString()
  location?: string;
}
```

### 📝 Controlador Mejorado

**Actualizar:** `src/core/attendance/attendance.controller.ts` (parcial)

```typescript
import { Body, Controller, Post, Req, UseFilters, HttpCode, HttpStatus } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { NestResponse } from "@/common/helpers/types";
import { Attendance } from "prisma/generated/client";
import { CreateAttendanceDto } from "./dto/attendance.dto";
import { CreateAttendanceCommand } from "./cqrs/command/create/createAttendance.command";
import { ICreateAttendanceData } from "./cqrs/command/create/createAttendance.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AttendanceController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Crear una nueva sesión de asistencia
   *
   * POST /api/attendances
   *
   * @param dto Datos de la asistencia (validados automáticamente)
   * @param req Request con información del usuario autenticado
   * @returns Respuesta con los datos de la asistencia creada
   */
  @AuthRequired()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAttendance(
    @Body() dto: CreateAttendanceDto,
    @Req() req: any
  ): Promise<NestResponse<Attendance>> {
    // ✅ Convertir DTO a Command
    const command = new CreateAttendanceCommand(
      {
        eventInstanceId: dto.eventInstanceId,
        startTime: new Date(dto.startTime),
        notes: dto.notes,
        location: dto.location
      } as ICreateAttendanceData,
      req.user.id
    );

    // ✅ Ejecutar command (ya valida datos en constructor)
    return this.commandBus.execute(command);
  }
}
```

---

## 3️⃣ Centralizar Error Handling

### 📝 Crear Servicio de Errores

**Crear:** `src/common/services/error-handling.service.ts`

```typescript
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { Prisma } from "prisma/generated/client";

/**
 * Servicio centralizado para manejar errores
 *
 * Beneficios:
 * - Consistencia en manejo de errores
 * - Facilita testing
 * - Permite logging centralizado
 * - Mapeo consistente de errores de Prisma a excepciones NestJS
 */
@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  /**
   * Maneja errores de Prisma y lanza excepciones NestJS apropiadas
   *
   * @param context Contexto donde ocurrió el error (para logging)
   * @param error Error de Prisma
   * @throws {ConflictException} Si hay violación de unique constraint
   * @throws {NotFoundException} Si el registro no existe
   * @throws {BadRequestException} Si hay errores de validación
   * @throws {InternalServerErrorException} Para otros errores
   */
  handlePrismaError(context: string, error: any): never {
    this.logger.error(`[${context}] Prisma Error:`, {
      code: error.code,
      message: error.message,
      meta: error.meta
    });

    // P2002: Violación de unique constraint
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      throw new ConflictException(`Ya existe un registro con este ${field}`);
    }

    // P2025: No encontrado
    if (error.code === "P2025") {
      throw new NotFoundException("El registro solicitado no fue encontrado");
    }

    // P2003: Violación de foreign key
    if (error.code === "P2003") {
      const relation = error.meta?.field_name || "relation";
      throw new BadRequestException(`Referencia inválida: ${relation}`);
    }

    // P2014: Relación requerida pero nula
    if (error.code === "P2014") {
      throw new BadRequestException(
        "No se puede eliminar este registro porque está siendo referenciado"
      );
    }

    // Por defecto
    throw new InternalServerErrorException("Error en la base de datos. Por favor intente más tarde.");
  }

  /**
   * Maneja errores de lógica de negocio
   *
   * @param context Contexto donde ocurrió el error
   * @param error Error capturado
   * @throws {BadRequestException | NotFoundException | ConflictException | InternalServerErrorException}
   */
  handleBusinessLogicError(context: string, error: any): never {
    this.logger.error(`[${context}] Business Logic Error:`, error);

    // Si ya es una excepción NestJS, relanzar
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }

    // Si es error de validación personalizado
    if (error.name === "ValidationError") {
      throw new BadRequestException(error.message);
    }

    // Por defecto
    throw new InternalServerErrorException(error.message || "Error procesando la solicitud");
  }

  /**
   * Maneja errores de servicios externos (email, S3, etc.)
   *
   * @param context Contexto donde ocurrió el error
   * @param service Nombre del servicio externo
   * @param error Error capturado
   * @throws {InternalServerErrorException}
   */
  handleExternalServiceError(context: string, service: string, error: any): never {
    this.logger.error(`[${context}] External Service Error (${service}):`, error);

    throw new InternalServerErrorException(
      `Error comunicándose con ${service}. Por favor intente más tarde.`
    );
  }

  /**
   * Valida que no sea nulo/undefined
   */
  requireNotNull<T>(value: T | null | undefined, message: string): T {
    if (value == null) {
      throw new NotFoundException(message);
    }
    return value;
  }

  /**
   * Valida que una condición sea verdadera
   */
  requireTrue(condition: boolean, message: string): void {
    if (!condition) {
      throw new BadRequestException(message);
    }
  }
}
```

### 📝 Usar en Proyecciones

**Actualizar:** `src/core/catalogue/school/cqrs/projections/school.projection.ts`

```typescript
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable, Logger } from "@nestjs/common";
import { School } from "prisma/generated/client";
import { ICreateSchool } from "../../dto/school.type";
import { ErrorHandlingService } from "@/common/services/error-handling.service";

@Injectable()
export class SchoolProjection {
  private readonly logger = new Logger("SchoolProjection");

  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHandler: ErrorHandlingService
  ) {}

  /**
   * Crea una nueva escuela
   * @param data Datos de la escuela a crear
   * @returns Escuela creada
   */
  async add(data: ICreateSchool): Promise<School> {
    try {
      return await this.prisma.school.create({ data });
    } catch (error) {
      // ✅ Usar servicio centralizado de errores
      this.errorHandler.handlePrismaError("SchoolProjection.add", error);
    }
  }

  /**
   * Obtiene una escuela por ID
   */
  async getById(id: number): Promise<School> {
    const school = await this.prisma.school.findUnique({
      where: { id }
    });

    // ✅ Usar método del servicio
    return this.errorHandler.requireNotNull(school, `Escuela con ID ${id} no encontrada`);
  }
}
```

### 📝 Registrar en Module

```typescript
import { Module } from "@nestjs/common";
import { ErrorHandlingService } from "./error-handling.service";

@Module({
  providers: [ErrorHandlingService],
  exports: [ErrorHandlingService]
})
export class ErrorHandlingModule {}

// ✅ En app.module.ts
@Module({
  imports: [
    ErrorHandlingModule // Importar el módulo
    // ... otros imports
  ]
})
export class AppModule {}
```

---

## 4️⃣ Implementar Idempotencia en Commands Críticos

### 📝 Cache Service con Idempotencia

**Crear:** `src/core/surveyData/cqrs/commands/create/createSurveyData.command.ts`

```typescript
import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject, Logger } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ICreateSurveyData } from "../../../dto/surveyData.type";
import { SurveyDataProjection } from "../../projections/surveyData.projection";
import { NestResponse } from "@/common/helpers/types";
import { SurveyData } from "prisma/generated/client";
import { ErrorHandlingService } from "@/common/services/error-handling.service";

/**
 * Command para crear datos de encuesta
 *
 * Implementa idempotencia usando idempotencyKey
 * Si se ejecuta 2 veces con la misma key, retorna el mismo resultado
 */
export class CreateSurveyDataCommand extends Command<NestResponse<SurveyData>> {
  constructor(
    public readonly data: ICreateSurveyData,
    public readonly idempotencyKey: string
  ) {
    super();

    if (!idempotencyKey || typeof idempotencyKey !== "string") {
      throw new BadRequestException("idempotencyKey es requerido y debe ser un string");
    }
  }
}

@CommandHandler(CreateSurveyDataCommand)
export class CreateSurveyDataHandler implements ICommandHandler<CreateSurveyDataCommand> {
  private readonly logger = new Logger(CreateSurveyDataHandler.name);
  private readonly IDEMPOTENCY_KEY_PREFIX = "survey-data:";
  private readonly IDEMPOTENCY_TTL = 3600; // 1 hora

  constructor(
    private readonly surveyDataProjection: SurveyDataProjection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly errorHandler: ErrorHandlingService
  ) {}

  async execute(command: CreateSurveyDataCommand): Promise<NestResponse<SurveyData>> {
    const { data, idempotencyKey } = command;
    const cacheKey = `${this.IDEMPOTENCY_KEY_PREFIX}${idempotencyKey}`;

    try {
      // 1. Verificar si ya fue procesado
      const cachedResult = await this.cacheManager.get<NestResponse<SurveyData>>(cacheKey);

      if (cachedResult) {
        this.logger.log(`✅ Respuesta idempotente encontrada para key: ${idempotencyKey}`);
        return cachedResult;
      }

      // 2. Crear el registro (no existe en caché)
      const res = await this.surveyDataProjection.create(data);

      const response: NestResponse<SurveyData> = {
        statusCode: 201,
        message: "Respuesta al anexo creada con éxito.",
        data: res
      };

      // 3. Cachear resultado para futuros requests con la misma key
      await this.cacheManager.set(cacheKey, response, this.IDEMPOTENCY_TTL);

      this.logger.log(`Created survey data with idempotency key: ${idempotencyKey}`);

      return response;
    } catch (error) {
      this.logger.error(`Error creating survey data for key ${idempotencyKey}:`, error);
      this.errorHandler.handleBusinessLogicError("CreateSurveyDataHandler", error);
    }
  }
}
```

### 📝 Controlador con Idempotency

**Actualizar:** `src/core/surveyData/surveyData.controller.ts`

```typescript
import { Body, Controller, Post, Headers, HttpCode, HttpStatus } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { SurveyDataDto } from "./dto/surveyData.dto";
import { CreateSurveyDataCommand } from "./cqrs/commands/create/createSurveyData.command";
import { NestResponse } from "@/common/helpers/types";
import { SurveyData } from "prisma/generated/client";
import { v4 as uuidv4 } from "uuid";

@Controller()
export class SurveyDataController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Crear nuevos datos de encuesta
   *
   * Soporta idempotencia via header Idempotency-Key
   *
   * @param dto Datos de la encuesta
   * @param idempotencyKey (Opcional) Key para idempotencia
   *                        Si no se proporciona, se genera una nueva
   * @returns Respuesta con los datos creados
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: SurveyDataDto,
    @Headers("idempotency-key") idempotencyKey?: string
  ): Promise<NestResponse<SurveyData>> {
    // ✅ Generar key si no se proporciona
    // En casos de reintento, el cliente debe enviar la misma key
    const finalKey = idempotencyKey || uuidv4();

    return this.commandBus.execute(new CreateSurveyDataCommand(dto, finalKey));
  }
}
```

---

## 5️⃣ Documentar el Flujo CQRS

### 📝 Crear Documento de Arquitectura

**Crear:** `src/core/auth/CQRS_ARCHITECTURE.md`

```markdown
# Arquitectura CQRS - Módulo Auth

## Flujo de Registro de Usuario
```

Client
│
├─► POST /api/auth/register
│ └─► AuthController.register()
│ └─► CommandBus.execute(RegisterUserCommand)
│ │
│ └─► RegisterUserHandler
│ ├─ Validar (email no existe)
│ ├─ Crear en UserProjection (write model)
│ ├─ Emitir UserRegisteredEvent
│ └─ Retornar NestResponse
│
└─► UserRegisteredEvent (async)
│
├─► UserRegisteredHandler
│ ├─ Actualizar UserReadModelProjection
│ ├─ Enviar email con EmailService
│ ├─ Crear notificación
│ └─ Log
│
└─► (Otros EventHandlers si existen)

## Flujo de Login de Usuario

Client
│
└─► POST /api/auth/login
└─► AuthController.login()
└─► QueryBus.execute(FindUniqueUserQuery)
│
└─► FindUniqueUserQueryHandler
└─ Buscar en UserProjection (read model)
└─ Retornar usuario

## Write Model (UserProjection)

Tabla: `user`

- id: Int (PK)
- email: String (Unique)
- passwd: String
- createdAt: DateTime
- updatedAt: DateTime
- isVerified: Boolean
- roleId: Int (FK)

## Read Model (UserReadModelProjection)

Nota: Actualmente usa la misma tabla,
pero puede ser separada en futuro.

Tabla: `userReadModel` (futura)

- id: Int (PK)
- email: String
- firstName: String
- lastName: String
- status: Enum
- createdAt: DateTime

## Events Emitidos

### UserRegisteredEvent

- Disparado: Cuando RegisterUserHandler completa
- Handlers:
  - UserRegisteredHandler (actualizar read model, enviar email)
  - (Agregar más handlers según necesidades)

### UserEmailVerifiedEvent

- Disparado: Cuando VerifyEmailHandler completa
- Handlers:
  - (Por implementar)

## Latencia de Eventual Consistency

| Operación               | Latencia  | Notas                         |
| ----------------------- | --------- | ----------------------------- |
| Crear usuario           | < 100ms   | Síncrono                      |
| Actualizar read model   | 100-500ms | Asincrónico                   |
| Enviar email            | 1-5s      | Asincrónico                   |
| Disponible para queries | < 1s      | Usuario disponible para login |

## Error Handling

### Write Model Error

- Si falla UserProjection.register()
- → Lanzar excepción
- → No emitir evento
- → Retornar error al cliente

### Read Model Error

- Si falla UserReadModelProjection en handler
- → Log del error
- → NO relanzar (no bloquea flujo)
- → Usuario existe en write model

### Event Handler Error

- Si falla EmailService.sendEmail()
- → Log del error
- → Considerar reintentos
- → Crear tarea de reintento manual

## Mejoras Futuras

1. [ ] Separar write model y read model
2. [ ] Implementar Event Sourcing
3. [ ] Agregar snapshots para eventos
4. [ ] Usar Kafka para event propagation
5. [ ] Implementar SAGAS para transacciones distribuidas

```

---

## 📋 Checklist de Implementación

- [ ] **Fase 1: Event Handlers**
  - [ ] Actualizar `userRegistered.handler.ts`
  - [ ] Crear `userReadModel.projection.ts`
  - [ ] Crear `email.service.ts`
  - [ ] Crear `notification.projection.ts`

- [ ] **Fase 2: Validación de Tipos**
  - [ ] Actualizar `createAttendance.command.ts`
  - [ ] Crear DTOs con class-validator
  - [ ] Actualizar controladores

- [ ] **Fase 3: Error Handling**
  - [ ] Crear `error-handling.service.ts`
  - [ ] Actualizar todas las proyecciones
  - [ ] Actualizar todos los handlers

- [ ] **Fase 4: Idempotencia**
  - [ ] Configura Redis (ya existe en tu stack)
  - [ ] Implementar en `createSurveyData.command.ts`
  - [ ] Agregar header `idempotency-key` en controlador

- [ ] **Fase 5: Documentación**
  - [ ] Crear CQRS_ARCHITECTURE.md en cada módulo
  - [ ] Documentar eventos emitidos
  - [ ] Documentar read models

---

## 🚀 Próximos Pasos

1. **Esta semana:** Implementar Fases 1-3
2. **Próxima semana:** Fase 4-5
3. **Revisión:** Validar que los eventos se ejecutan correctamente

Cualquier duda, revisar `CQRS_BEST_PRACTICES_AND_AUDIT.md`
```
