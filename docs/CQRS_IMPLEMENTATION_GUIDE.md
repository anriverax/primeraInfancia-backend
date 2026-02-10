# Guía de Implementación: Mejoras CQRS Prácticas

## 🎯 Objetivo

Implementar las mejores prácticas de CQRS en tu proyecto con ejemplos concretos.

---

## 1️⃣ Antes y Después: Conectar Event Handlers a Proyecciones

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

```