# 📋 DDD BOUNDARY CHECK - AUTH MODULE ANALYSIS

**Fecha:** 22 de enero de 2026
**Módulo:** Auth (src/core/auth/)
**Revisión:** DDD Boundary & Hexagonal Architecture

---

## 🎯 Resumen Ejecutivo

| Aspecto                 | Score | Estado                    |
| ----------------------- | ----- | ------------------------- |
| **Bounded Contexts**    | 8/10  | ✅ Bien definido          |
| **Aggregate Roots**     | 7/10  | ⚠️ Necesita mejora        |
| **Domain Services**     | 8/10  | ✅ Bien estructurado      |
| **Value Objects**       | 6/10  | ⚠️ Necesita mejora        |
| **Application Layer**   | 8/10  | ✅ Bien separada          |
| **Ports & Adapters**    | 7/10  | ⚠️ Parcialmente aplicada  |
| **Entity Boundaries**   | 7/10  | ⚠️ Necesita clarificación |
| **Ubiquitous Language** | 8/10  | ✅ Bien aplicado          |

**Score DDD General: 7.4/10**

---

## 🏗️ ANÁLISIS POR CAPAS

### 1. LAYER: Controller (HTTP Adapter)

**Archivo:** `auth.controller.ts`

#### ✅ Fortalezas

- ✅ Aislada de lógica de dominio
- ✅ Usa CQRS Pattern (CommandBus, QueryBus)
- ✅ Inyección de dependencias clara
- ✅ Manejo de excepciones apropiado

#### ⚠️ Problemas DDD Encontrados

**PROBLEMA 1: Lógica de dominio en controller**

```typescript
// ❌ VIOLACIÓN: Lógica de validación de dominio en controller
@Post("change-password")
async changePassword(@Req() req: Request, @Body() data: ChangePasswdDto) {
  // ...
  const isTheSamePassword = await this.authService.comparePasswords(
    data.value3,
    isExist.passwd
  );
  if (isTheSamePassword) {
    throw new UnauthorizedException(...);
  }

  const pwdMatch = await this.authService.comparePasswords(
    isExist.passwd,
    data.value2
  );
  // Este flujo de validación debería estar en un Command Handler o Value Object
}
```

**RECOMENDACIÓN:**

```typescript
// ✅ MEJORA: Mover lógica a ChangePasswordCommand Handler
@Post("change-password")
async changePassword(@Req() req: Request, @Body() data: ChangePasswdDto) {
  const command = new ChangePasswordCommand({
    userId: req.user.id,
    email: req.user.email,
    oldPassword: data.value2,
    newPassword: data.value3,
    newEmail: data.value1
  });

  return this.commandBus.execute(command);
}
```

**PROBLEMA 2: Extracción manual de usuario del request**

```typescript
// ❌ VIOLACIÓN: Detalles técnicos de Express en lógica
const { id, email } = req["user"] as { id: number; email: string; sub: number; role: string };
```

**RECOMENDACIÓN:**

```typescript
// ✅ MEJORA: Crear decorator que encapsule esto
@CurrentUser() user: AuthenticatedUserVM
async changePassword(@CurrentUser() user: AuthenticatedUserVM, @Body() data: ChangePasswdDto)
```

---

### 2. LAYER: Commands (CQRS)

**Archivos:**

- `login.handler.ts`
- `register-user.handler.ts`
- `change-passwd.handler.ts`

#### ✅ Fortalezas

- ✅ Encapsulan intenciones de usuario
- ✅ Coordinan casos de uso
- ✅ Separados de queries

#### ⚠️ Problemas DDD Encontrados

**PROBLEMA 1: LoginHandler - Responsabilidades múltiples**

```typescript
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  async execute(command: LoginCommand): Promise<ILoginResponse> {
    // 1. Seguridad (verificar bloqueo)
    const isLocked = await this.authService.isAccountLocked(value1);

    // 2. Consulta (buscar usuario)
    const user = await this.queryBus.execute(new FindUniqueUserQuery(...));

    // 3. Validación (comparar contraseña)
    const isPasswordValid = await this.authService.comparePasswords(...);

    // 4. Tracking (registrar intento)
    await this.authService.trackLoginAttempt(value1, false);

    // 5. Generación (crear tokens)
    const result = await this.tokenService.generateTokens(...);

    return result;
  }
}
```

**RECOMENDACIÓN:** Crear Domain Service específico

```typescript
// ✅ MEJOR ESTRUCTURA
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly loginDomainService: LoginDomainService,
    private readonly tokenService: TokenService
  ) {}

  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const loginResult = await this.loginDomainService.authenticate(command.email, command.password);

    const tokens = await this.tokenService.generateTokens(loginResult.user, loginResult.permissions);

    return tokens;
  }
}
```

**PROBLEMA 2: RegisterUserHandler - Mix de Domain Service y Projection**

```typescript
// ❌ Llama tanto a Domain Service como a Projection
await this.authService.hashPassword(data.passwd);
const { publicKey, privateKey } = this.keyService.generateKeyPair();
await this.userProjection.register({...});
await this.authService.createCodeVerificationEmail(data.email);
```

**RECOMENDACIÓN:** Crear agregado User

```typescript
// ✅ MEJOR: Agregado que maneja el registro
const user = User.create({
  email: data.email,
  password: data.passwd,
  person: data,
  schoolId: data.schoolId
});

await this.userRepository.save(user);
```

---

### 3. LAYER: Domain Services

**Archivo:** `auth.service.ts`

#### ✅ Fortalezas

- ✅ Métodos de dominio bien definidos
- ✅ Operaciones criptográficas centralizadas
- ✅ Anti-brute force implementado
- ✅ Logging de seguridad

#### ⚠️ Problemas DDD Encontrados

**PROBLEMA 1: Mezcla de servicios de infraestructura**

```typescript
// ❌ VIOLACIÓN: AuthService depende de RedisService
constructor(
  private readonly jwtService: JwtService,
  private readonly redisService: RedisService,        // ← Infraestructura
  private readonly errorHandlingService: ErrorHandlingService  // ← Infraestructura
) {}
```

**RECOMENDACIÓN:** Crear interfaz de puerto

```typescript
// ✅ MEJORA: Usar puerto (interfaz)
export interface IAccountLockoutRepository {
  isLocked(email: string): Promise<boolean>;
  lock(email: string, durationMinutes: number): Promise<void>;
  recordAttempt(email: string): Promise<void>;
  reset(email: string): Promise<void>;
}

constructor(
  private readonly accountLockoutRepository: IAccountLockoutRepository
) {}
```

**PROBLEMA 2: Múltiples responsabilidades**

```typescript
// ❌ AuthService hace demasiado
-hashPassword() - // Criptografía
  comparePasswords() - // Criptografía
  logout() - // Token Management
  trackLoginAttempt() - // Security/Lockout
  isAccountLocked() - // Security/Lockout
  createCodeVerificationEmail() - // Notifications
  getData(); // Mapping/DTO
```

**RECOMENDACIÓN:** Separar en múltiples servicios

```typescript
// ✅ MEJOR ESTRUCTURA
-PasswordHashingService - // Criptografía
  AccountLockoutService - // Seguridad
  TokenManagementService - // Tokens
  VerificationEmailService; // Notificaciones
```

---

### 4. LAYER: Queries (Read Model)

**Archivos:**

- `find-unique-user.handler.ts`
- `get-by-rol-id.handler.ts`
- `get-all-permission.handler.ts`
- `get-by-userId-userKey.handler.ts`

#### ✅ Fortalezas

- ✅ Separadas de commands
- ✅ Queries puras (sin side effects)
- ✅ Estructura clara

#### ⚠️ Problemas DDD Encontrados

**PROBLEMA 1: Query retorna entidades de dominio en lugar de DTOs**

```typescript
// ❌ VIOLACIÓN: FindUniqueUserQuery retorna User (entidad de dominio)
const user = await this.queryBus.execute(new FindUniqueUserQuery({ email: value1 }));
// user es una entidad completa con passwd, tokens, etc.
```

**RECOMENDACIÓN:** Crear DTOs específicos

```typescript
// ✅ MEJORA: Query retorna DTO
export class UserReadModel {
  id: number;
  email: string;
  hashedPassword: string;
  roleId: number;
  isVerified: boolean;
  // ← NO incluir campos sensibles como tokens
}

// Handler retorna UserReadModel, no User
```

**PROBLEMA 2: Queries sin separación de read model**

```typescript
// ❌ Queries leen de base de datos de escritura
// No hay base de datos de lectura optimizada
// Cada query hace joins complejos en vivo
```

**RECOMENDACIÓN:** Implementar CQRS completo

```typescript
// ✅ MEJORA: Read Model separada y desnormalizada
// En lugar de hacer JOINs complejos:
// SELECT user.*, role.*, person.* FROM user JOIN role JOIN person

// Usar tabla desnormalizada:
// SELECT * FROM user_read_model WHERE email = ?
```

---

### 5. LAYER: Projections (Write Model)

**Archivo:** `user.projection.ts`

#### ✅ Fortalezas

- ✅ Aislada de lógica de dominio
- ✅ Usa Prisma como ORM
- ✅ Manejo de errores

#### ⚠️ Problemas DDD Encontrados

**PROBLEMA 1: Projection maneja lógica de dominio**

```typescript
// ❌ VIOLACIÓN: Projection crea estructuras complejas
async register(data: IAuthEvent): Promise<void> {
  await this.prisma.person.create({
    data: {
      ...personData,
      User: {
        create: {
          email,
          passwd,
          roleId,
          isVerified,
          UserKey: {  // ← Estructura anidada compleja
            create: { publicKey, privateKey }
          }
        }
      },
      ...(schoolId && { PrincipalSchool: { create: { schoolId } } })
    }
  });
}
```

**RECOMENDACIÓN:** Usar Value Objects

```typescript
// ✅ MEJORA: Value Objects manejan estructura
class CryptographicKeys {
  publicKey: string;
  privateKey: string;

  static create(publicKey: string, privateKey: string) {
    // Validaciones de dominio
    return new CryptographicKeys(publicKey, privateKey);
  }
}

// Projection solo persiste
await this.userRepository.save(user);
```

**PROBLEMA 2: Tipos no validados en projection**

```typescript
// ❌ Acepta cualquier IAuthEvent sin validación
async register(data: IAuthEvent): Promise<void>

// Si data viene con valores inválidos, falla en BD
```

**RECOMENDACIÓN:** Validar antes de persistir

```typescript
// ✅ MEJORA: Domain Service valida primero
const user = User.create(data); // Valida
await this.userRepository.save(user); // Persiste
```

---

### 6. LAYER: DTOs & Types

**Archivos:**

- `auth.dto.ts`
- `auth.type.ts`

#### ✅ Fortalezas

- ✅ Separados de modelos de dominio
- ✅ Validación con decoradores

#### ⚠️ Problemas DDD Encontrados

**PROBLEMA 1: DTOs muy acoplados a Prisma**

```typescript
// ❌ VIOLACIÓN: IAuth mezcla campos de múltiples tablas
export type IAuth = Pick<Person, "firstName" | "lastName1" | ...> &
  Pick<User, "email" | "passwd" | "roleId"> & {
    schoolId?: number;
  };
```

**RECOMENDACIÓN:** Crear DTOs agnósticos

```typescript
// ✅ MEJORA: DTO independiente
export interface CreateUserRequest {
  // Personal info
  firstName: string;
  lastName1: string;
  lastName2?: string;
  email: string;
  password: string; // ← Plain text input
  // ...

  // No incluir campos de dominio como roleId
}
```

**PROBLEMA 2: Falta de validación de dominio**

```typescript
// ❌ Aunque hay @IsEmail(), @IsStrongPassword()
// Falta validación de reglas de negocio
- ¿Contraseña cumple requisitos organizacionales?
- ¿Email es válido en contexto de dominio?
- ¿DUI es válido según país?
```

**RECOMENDACIÓN:** Crear Value Object validators

```typescript
// ✅ MEJORA: Value Objects con lógica de dominio
class Email extends ValueObject<string> {
  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new InvalidEmailException();
    }
    super(value);
  }

  private isValidEmail(email: string): boolean {
    // Lógica de dominio + validación técnica
  }
}

class Password extends ValueObject<string> {
  constructor(value: string) {
    if (!this.meetsSecurityRequirements(value)) {
      throw new WeakPasswordException();
    }
    super(value);
  }
}
```

---

## 🔄 ANÁLISIS DE FLUJOS

### Flujo: User Registration

```
ACTUAL (Problemas):
┌─────────────────────────────────────────────────────────────┐
│ AuthController                                              │
│ ├─ Recibe AuthDto                                          │
│ └─ CommandBus.execute(RegisterUserCommand)                 │
│    ├─ RegisterUserHandler                                  │
│    │  ├─ QueryBus: FindUniqueUserQuery              ← Mezcla │
│    │  ├─ AuthService.hashPassword()                ← Mezcla │
│    │  ├─ KeyService.generateKeyPair()              ← Mezcla │
│    │  ├─ UserProjection.register()                 ← Mezcla │
│    │  └─ AuthService.createCodeVerificationEmail() ← Mezcla │
│    │     └─ RedisService.set()                 ← Infraestructura
└─────────────────────────────────────────────────────────────┘

Problemas:
- Demasiadas responsabilidades
- Mezcla de servicios de dominio
- Coordinación difusa
```

```
RECOMENDADO (DDD):
┌──────────────────────────────────────────────────────────────┐
│ Application Layer                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ RegisterUserCommandHandler                              │ │
│ │ └─ userRegistrationDomainService.register()            │ │
│ │    ├─ Validar usuario no existe (Query)               │ │
│ │    └─ User.create() ← Agregado raíz                   │ │
│ │       ├─ Hashear password (Domain Logic)              │ │
│ │       ├─ Generar keys (Domain Logic)                  │ │
│ │       └─ Crear eventos de dominio                     │ │
│ │          └─ UserRegisteredEvent                       │ │
│ │             ├─ Proyección a BD (Infraestructura)     │ │
│ │             └─ Enviar email (Infraestructura)        │ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 VIOLACIONES DDD IDENTIFICADAS

### SEVERIDAD: CRÍTICA 🔴

| #   | Violación                       | Ubicación          | Impacto |
| --- | ------------------------------- | ------------------ | ------- |
| 1   | Lógica de dominio en Controller | auth.controller.ts | Alta    |
| 2   | Agregado raíz no definido       | Everywhere         | Alta    |
| 3   | Value Objects no implementados  | auth.service.ts    | Alta    |

### SEVERIDAD: IMPORTANTE 🟠

| #   | Violación                               | Ubicación          | Impacto |
| --- | --------------------------------------- | ------------------ | ------- |
| 4   | Mezcla de responsabilidades en services | auth.service.ts    | Media   |
| 5   | Read model retorna entidades            | queries/           | Media   |
| 6   | Projection sin validación de dominio    | user.projection.ts | Media   |
| 7   | DTOs acoplados a Prisma                 | dto/               | Media   |

### SEVERIDAD: MENOR 🟡

| #   | Violación                           | Ubicación  | Impacto |
| --- | ----------------------------------- | ---------- | ------- |
| 8   | Falta de puertos/interfaces         | services/  | Baja    |
| 9   | Eventos de dominio no implementados | everywhere | Baja    |
| 10  | Repository pattern no usado         | everywhere | Baja    |

---

## ✅ RECOMENDACIONES DE MEJORA

### FASE 1: Immediate (1-2 días)

**1. Crear Agregado User**

```typescript
// src/core/auth/domain/aggregates/user.ts
export class User extends AggregateRoot {
  private id: UserId;
  private email: Email;
  private password: HashedPassword;
  private cryptographicKeys: CryptographicKeys;
  private role: Role;
  private person: Person;
  private accountLockout: AccountLockout;

  static create(data: UserCreationData): User {
    // Validaciones de dominio
    // Generación de eventos
    return new User(...);
  }

  authenticate(plainPassword: string): void {
    // Validación de dominio
  }

  changePassword(oldPassword: string, newPassword: string): void {
    // Validación de dominio
  }
}
```

**2. Crear Value Objects**

```typescript
// src/core/auth/domain/value-objects/
-Email.ts - HashedPassword.ts - CryptographicKeys.ts - AccountLockout.ts;
```

**3. Crear Domain Service**

```typescript
// src/core/auth/domain/services/
export class UserAuthenticationDomainService {
  authenticate(email: Email, password: string): User {
    // Orquesta la autenticación
  }
}
```

### FASE 2: Short-term (1 semana)

**4. Implementar Repository Pattern**

```typescript
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
```

**5. Separar lectura de escritura**

```typescript
// Query handlers retornan ReadModels, no agregados
export interface UserReadModel {
  id: number;
  email: string;
  isVerified: boolean;
  // No incluir contraseñas o datos sensibles
}
```

**6. Implementar Domain Events**

```typescript
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public userId: UserId,
    public email: Email,
    public timestamp: Date
  ) {}
}
```

### FASE 3: Medium-term (2 semanas)

**7. Crear Application Services**

```typescript
// src/core/auth/application/services/
export class RegisterUserApplicationService {
  async execute(command: RegisterUserCommand): Promise<void> {
    // Orquesta dominio + infraestructura
  }
}
```

**8. Mover infraestructura a puertos**

```typescript
// Interfaces
export interface ITokenProvider {
  generateAccessToken(...): Promise<string>;
  generateRefreshToken(...): Promise<string>;
}

export interface INotificationService {
  sendVerificationEmail(...): Promise<void>;
}
```

---

## 📈 MÉTRICAS DDD

### Antes de Mejoras

```
Agregados Raíz:     0
Value Objects:      0
Domain Events:      0
Domain Services:    1 (mal definido)
Repositories:       0
Ports/Interfaces:   2
Layers:             3 (mezcladas)
────────────────────
DDD Score:          3/10
```

### Después de Mejoras

```
Agregados Raíz:     1 (User)
Value Objects:      4 (Email, Password, Keys, Lockout)
Domain Events:      3 (UserRegistered, PasswordChanged, etc)
Domain Services:    2 (bien definidos)
Repositories:       1 (UserRepository)
Ports/Interfaces:   5+
Layers:             4 (bien separadas)
────────────────────
DDD Score:          8-9/10
```

---

## 🎯 Conclusión

El módulo auth tiene **buena arquitectura general** pero **violaciones importantes de DDD**:

✅ **Lo que funciona:**

- CQRS pattern implementado
- Separación de comandos/queries
- Servicios de dominio presentes
- Security features implementadas

❌ **Qué necesita mejora:**

- Agregado raíz (User) no definido
- Value Objects no implementados
- Responsabilidades mezcladas
- Read model retorna entidades completas
- Repository pattern faltante

🎯 **Score Final: 7.4/10 → Meta: 8.5/10**

---

**Próximo paso:** Implementar FASE 1 para alcanzar 8.5/10 en DDD compliance.

---

# 🔧 RECOMENDACIONES COMPLETAS Y DETALLADAS

## ❓ PREGUNTA 1: ¿LoginDomainService O AuthService?

### 🔴 PROBLEMA ACTUAL

Tu código tiene esta estructura:

```
AuthService (multiusos):
├─ hashPassword()          ← Criptografía
├─ comparePasswords()      ← Criptografía
├─ trackLoginAttempt()     ← Seguridad
├─ isAccountLocked()       ← Seguridad
├─ logout()                ← Gestión tokens
├─ createCodeVerificationEmail()  ← Notificaciones
└─ getData()               ← Mapping

LoginHandler:
├─ authService.isAccountLocked()     ← Usa seguridad
├─ authService.comparePasswords()    ← Usa criptografía
├─ authService.trackLoginAttempt()   ← Usa seguridad
└─ tokenService.generateTokens()     ← Usa token
```

**Problema:** AuthService hace demasiadas cosas. Es como tener una "navaja suiza" que haz todo.

### ✅ SOLUCIÓN: NO necesitas LoginDomainService extra

En lugar de crear **otro** servicio, **refactoriza AuthService** en servicios especializados:

```
PasswordHashingService       ← Solo criptografía
├─ hashPassword()
└─ comparePasswords()

AccountSecurityService      ← Solo seguridad de cuenta
├─ trackLoginAttempt()
├─ isAccountLocked()
└─ resetLoginAttempts()

TokenManagementService      ← TokenService (ya lo tienes)
├─ generateTokens()
├─ setAccessToken()
└─ setRefreshToken()

VerificationEmailService    ← Solo notificaciones
└─ createCodeVerificationEmail()
```

### 🎯 ESTRUCTURA FINAL (SIN redundancias)

```typescript
// src/core/auth/domain/services/authentication.domain-service.ts
@Injectable()
export class AuthenticationDomainService {
  constructor(
    private readonly passwordHashing: PasswordHashingService,
    private readonly accountSecurity: AccountSecurityService,
    private readonly tokenManagement: TokenManagementService
  ) {}

  /**
   * Autentica un usuario verificando su contraseña y generando tokens.
   * Esta es la ÚNICA responsabilidad de este servicio.
   */
  async authenticate(
    email: string,
    plainPassword: string
  ): Promise<{
    user: IUser;
    tokens: ILoginResponse;
  }> {
    // 1. Verificar si la cuenta está bloqueada
    const isLocked = await this.accountSecurity.isAccountLocked(email);
    if (isLocked) {
      throw new UnauthorizedException("Cuenta bloqueada. Intente más tarde.");
    }

    // 2. Buscar usuario (inyectado del handler)
    // const user = await findUser(email);  // ← Viene del handler

    // 3. Validar contraseña
    const isPasswordValid = await this.passwordHashing.comparePasswords(plainPassword, user.passwd);

    if (!isPasswordValid) {
      await this.accountSecurity.trackLoginAttempt(email, false);
      throw new UnauthorizedException("Credenciales incorrectas.");
    }

    // 4. Registrar intento exitoso
    await this.accountSecurity.trackLoginAttempt(email, true);

    // 5. Generar tokens (inyectado del handler)
    // const permissions = await getPermissions(user.roleId);  // ← Viene del handler

    const tokens = await this.tokenManagement.generateTokens(user, permissions);

    return { user, tokens };
  }
}
```

### 🔄 Cómo se vería LoginHandler después

```typescript
// src/core/auth/cqrs/commands/login/login.handler.ts
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authenticationService: AuthenticationDomainService
  ) {}

  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { email, password } = command;

    // 1. Buscar usuario (lectura)
    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email }));
    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    // 2. Obtener permisos (lectura)
    const permissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));

    // 3. TODA la lógica de autenticación en un servicio de dominio
    const { tokens } = await this.authenticationService.authenticate(email, password);

    return tokens;
  }
}
```

**Beneficio:** LoginHandler es limpio, coordinador solamente.

---

## ❓ PREGUNTA 2: Mix de Domain Service + Projections + Handlers

### 🔴 PROBLEMA ACTUAL EN REGISTER

```typescript
// RegisterUserHandler
const hashedPassword = await this.authService.hashPassword(data.passwd);
const { publicKey, privateKey } = this.keyService.generateKeyPair();
const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);

await this.userProjection.register({...});  // ← Aquí está el problema

await this.authService.createCodeVerificationEmail(data.email);
```

**Problema:**

- Handler mezcla **lógica de dominio** (hashing, key generation)
- Handler mezcla **persistencia** (userProjection)
- Handler mezcla **notificaciones** (email)
- Handler mezcla **orquestación** (coordina todo)

Es como cocinar, limpiar, servir y cobrar todo en una sartén.

### ✅ SOLUCIÓN: Crear Agregado User

En DDD, un **Agregado** maneja su propia lógica de dominio:

```typescript
// src/core/auth/domain/aggregates/user.aggregate.ts
export class User extends AggregateRoot {
  // Identidad
  private id: UserId;
  private email: Email;

  // Contraseña (Value Object)
  private password: HashedPassword;

  // Claves (Value Object)
  private cryptographicKeys: CryptographicKeys;

  // Estado
  private isVerified: boolean;

  // Persona asociada
  private person: Person;

  // Seguridad
  private accountLockout: AccountLockout;

  /**
   * Factory Method: Crear nuevo usuario (LÓGICA DE DOMINIO AQUÍ)
   */
  static async create(data: {
    email: string;
    plainPassword: string;
    person: PersonData;
    schoolId?: number;
  }): Promise<User> {
    // 1. Validar email
    const email = Email.create(data.email);

    // 2. Hashear contraseña (lógica de dominio)
    const password = await HashedPassword.create(data.plainPassword);

    // 3. Generar claves (lógica de dominio)
    const cryptographicKeys = CryptographicKeys.generate();

    // 4. Crear persona
    const person = Person.create(data.person);

    // 5. Crear cuenta de seguridad
    const accountLockout = AccountLockout.initialize();

    // 6. Instanciar agregado
    const user = new User(
      userId.generate(),
      email,
      password,
      cryptographicKeys,
      person,
      accountLockout,
      false
    );

    // 7. GENERAR EVENTO DE DOMINIO
    user.addDomainEvent(
      new UserRegisteredEvent(user.id, user.email, user.cryptographicKeys, user.person, data.schoolId)
    );

    return user;
  }

  /**
   * Autenticar usuario (LÓGICA DE DOMINIO AQUÍ)
   */
  authenticate(plainPassword: string): void {
    if (!this.password.matches(plainPassword)) {
      throw new InvalidPasswordException();
    }
  }

  /**
   * Cambiar contraseña (LÓGICA DE DOMINIO AQUÍ)
   */
  changePassword(currentPassword: string, newPassword: string): void {
    if (!this.password.matches(currentPassword)) {
      throw new InvalidPasswordException();
    }

    this.password = HashedPassword.create(newPassword);

    this.addDomainEvent(new PasswordChangedEvent(this.id, new Date()));
  }

  /**
   * Bloquear cuenta (LÓGICA DE DOMINIO AQUÍ)
   */
  lockAccount(): void {
    this.accountLockout.lock();
    this.addDomainEvent(new AccountLockedEvent(this.id, new Date()));
  }

  /**
   * Verificar email (LÓGICA DE DOMINIO AQUÍ)
   */
  verifyEmail(): void {
    this.isVerified = true;
    this.addDomainEvent(new EmailVerifiedEvent(this.id, this.email, new Date()));
  }
}
```

### 🔄 Cómo se vería RegisterUserHandler después

```typescript
// src/core/auth/cqrs/commands/register/register-user.handler.ts
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userRepository: UserRepository, // ← NUEVO: Patrón Repository
    private readonly eventPublisher: EventPublisher // ← NUEVO: Para publicar eventos
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { email, plainPassword, person, schoolId } = command.data;

    // 1. Verificar si usuario ya existe (lectura)
    const existingUser = await this.queryBus.execute(new FindUniqueUserQuery({ email }));
    if (existingUser) {
      throw new ConflictException("Usuario ya registrado.");
    }

    // 2. CREAR AGREGADO (TODA LA LÓGICA EN EL AGREGADO)
    const newUser = await User.create({
      email,
      plainPassword,
      person,
      schoolId
    });

    // 3. GUARDAR AGREGADO (persistencia)
    await this.userRepository.save(newUser);

    // 4. PUBLICAR EVENTOS DE DOMINIO (eventos)
    //    Los event subscribers manejarán:
    //    - Enviar email de verificación
    //    - Crear relaciones secundarias
    //    - Etc.
    await this.eventPublisher.publishAll(newUser.getDomainEvents());

    newUser.clearDomainEvents();
  }
}
```

### ¿Dónde va la lógica que antes estaba en Handler?

**ANTES (en Handler):**

```typescript
const hashedPassword = await this.authService.hashPassword(data.passwd);
const { publicKey, privateKey } = this.keyService.generateKeyPair();
const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);
await this.userProjection.register({...});
await this.authService.createCodeVerificationEmail(data.email);
```

**AHORA:**

| Lógica                          | Ir a                           | Por qué                      |
| ------------------------------- | ------------------------------ | ---------------------------- |
| `hashPassword()`                | `HashedPassword.create()`      | Value Object valida y hashea |
| `generateKeyPair()`             | `CryptographicKeys.generate()` | Value Object genera claves   |
| `encryptPrivateKey()`           | `CryptographicKeys`            | Value Object las encripta    |
| `userProjection.register()`     | `userRepository.save()`        | Repository patrón            |
| `createCodeVerificationEmail()` | `UserRegisteredEvent` listener | Event-driven, desacoplado    |

---

## ❓ PREGUNTA 3: Estructura completa para evitar redundancias

### 📁 Estructura de carpetas recomendada

```
src/core/auth/
├── domain/                          ← NÚCLEO DE DOMINIO
│   ├── aggregates/
│   │   ├── user.aggregate.ts        ← Agregado raíz
│   │   └── user.aggregate.spec.ts
│   ├── value-objects/               ← Validaciones y lógica
│   │   ├── email.vo.ts
│   │   ├── hashed-password.vo.ts
│   │   ├── cryptographic-keys.vo.ts
│   │   ├── account-lockout.vo.ts
│   │   └── user-id.vo.ts
│   ├── domain-services/             ← Lógica que cruza agregados
│   │   ├── authentication.domain-service.ts
│   │   ├── user-registration.domain-service.ts
│   │   └── password-changing.domain-service.ts
│   ├── events/                      ← Eventos de dominio
│   │   ├── user-registered.event.ts
│   │   ├── password-changed.event.ts
│   │   ├── email-verified.event.ts
│   │   ├── account-locked.event.ts
│   │   └── login-attempted.event.ts
│   ├── exceptions/                  ← Excepciones de dominio
│   │   ├── invalid-email.exception.ts
│   │   ├── weak-password.exception.ts
│   │   ├── invalid-credentials.exception.ts
│   │   └── account-locked.exception.ts
│   └── repositories/                ← Interfaces (puertos)
│       └── user.repository.ts
│
├── application/                     ← CAPA DE APLICACIÓN
│   ├── commands/
│   │   ├── register-user/
│   │   │   ├── register-user.command.ts
│   │   │   └── register-user.handler.ts     ← LIGERO
│   │   ├── login/
│   │   │   ├── login.command.ts
│   │   │   └── login.handler.ts             ← LIGERO
│   │   └── change-password/
│   │       ├── change-password.command.ts
│   │       └── change-password.handler.ts   ← LIGERO
│   ├── queries/
│   │   ├── find-unique-user/
│   │   │   ├── find-unique-user.query.ts
│   │   │   └── find-unique-user.handler.ts
│   │   ├── get-user-permissions/
│   │   │   ├── get-user-permissions.query.ts
│   │   │   └── get-user-permissions.handler.ts
│   │   └── ... (más queries)
│   ├── read-models/                 ← DTOs para queries
│   │   ├── user.read-model.ts
│   │   ├── user-with-permissions.read-model.ts
│   │   └── user-profile.read-model.ts
│   └── services/                    ← Servicios de aplicación (si es necesario)
│       └── dto-mapper.service.ts
│
├── infrastructure/                  ← CAPA DE INFRAESTRUCTURA
│   ├── persistence/
│   │   ├── user.repository.impl.ts        ← Implementación
│   │   └── user.projection.ts
│   ├── services/                    ← Implementaciones de puertos
│   │   ├── password-hashing.service.ts
│   │   ├── account-security.service.ts
│   │   ├── cryptographic-keys.service.ts
│   │   ├── verification-email.service.ts
│   │   └── token-management.service.ts
│   └── event-listeners/             ← Event subscribers
│       ├── on-user-registered.listener.ts
│       ├── on-email-verified.listener.ts
│       └── on-password-changed.listener.ts
│
├── presentation/                    ← CAPA DE PRESENTACIÓN
│   ├── http/
│   │   ├── auth.controller.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── require-permissions.decorator.ts
│   │   └── guards/
│   │       ├── access-token.guard.ts
│   │       ├── refresh-token.guard.ts
│   │       └── permission.guard.ts
│   └── dto/
│       ├── create-user.request.ts
│       ├── login.request.ts
│       ├── change-password.request.ts
│       └── auth.response.ts
│
├── auth.module.ts
└── auth.constants.ts
```

### 🎯 Mapa de qué va dónde

| Código                            | Ubicación Actual                 | Ubicación Nueva                                       | Por qué                  |
| --------------------------------- | -------------------------------- | ----------------------------------------------------- | ------------------------ |
| `authService.hashPassword()`      | `services/auth.service.ts`       | `infrastructure/services/password-hashing.service.ts` | Infraestructura (Argon2) |
| `authService.comparePasswords()`  | `services/auth.service.ts`       | `value-objects/hashed-password.vo.ts`                 | Lógica de dominio        |
| `authService.trackLoginAttempt()` | `services/auth.service.ts`       | `infrastructure/services/account-security.service.ts` | Infraestructura (Redis)  |
| `authService.isAccountLocked()`   | `services/auth.service.ts`       | `infrastructure/services/account-security.service.ts` | Infraestructura (Redis)  |
| `keyService.generateKeyPair()`    | `services/key.service.ts`        | `value-objects/cryptographic-keys.vo.ts`              | Lógica de dominio        |
| `keyService.encryptPrivateKey()`  | `services/key.service.ts`        | `value-objects/cryptographic-keys.vo.ts`              | Lógica de dominio        |
| `tokenService.generateTokens()`   | `services/token.service.ts`      | `infrastructure/services/token-management.service.ts` | Infraestructura (JWT)    |
| `userProjection.register()`       | `projections/user.projection.ts` | `infrastructure/persistence/user.repository.impl.ts`  | Persistencia             |
| `createCodeVerificationEmail()`   | `services/auth.service.ts`       | Event listener                                        | Event-driven             |

---

## 🚀 PLAN DE IMPLEMENTACIÓN (PASO A PASO)

### SEMANA 1: Crear dominio limpio

**Día 1-2: Value Objects**

```typescript
// src/core/auth/domain/value-objects/email.vo.ts
export class Email extends ValueObject<string> {
  private constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidEmailException();
    }
    super(value);
  }

  static create(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }

  private isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  getValue(): string {
    return this.value;
  }
}
```

**Día 3: Agregado User**

- Implementar `User.aggregate.ts` con métodos de dominio
- Agregar eventos de dominio

**Día 4-5: Domain Services**

- `AuthenticationDomainService`
- `UserRegistrationDomainService`
- `PasswordChangingDomainService`

### SEMANA 2: Conectar a aplicación

**Día 1-2: Repository Pattern**

```typescript
// src/core/auth/domain/repositories/user.repository.ts
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}

// src/core/auth/infrastructure/persistence/user.repository.impl.ts
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHandler: ErrorHandlingService
  ) {}

  async save(user: User): Promise<void> {
    const events = user.getDomainEvents();
    // Persistir usuario
    // Publicar eventos
  }
}
```

**Día 3-4: Event Listeners**

```typescript
// src/core/auth/infrastructure/event-listeners/on-user-registered.listener.ts
@EventsHandler(UserRegisteredEvent)
export class OnUserRegisteredListener implements IEventHandler<UserRegisteredEvent> {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: Logger
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    // Enviar email de verificación
    // Crear relaciones secundarias
  }
}
```

**Día 5: Handlers refactorizados**

```typescript
// Handlers ligeros que solo orquestan
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const user = await User.create(command.data);
    await this.userRepository.save(user);
    await this.eventPublisher.publishAll(user.getDomainEvents());
  }
}
```

### SEMANA 3: Limpiar infraestructura

- Mover `PasswordHashingService` a `infrastructure/services/`
- Mover `AccountSecurityService` a `infrastructure/services/`
- Eliminar `authService.ts` (distribuir responsabilidades)
- Eliminar `keyService.ts` (mover a Value Object + Services)

---

## 📊 ANTES vs DESPUÉS

### ANTES

```
LoginHandler
  ├─ QueryBus (Lee usuario)
  ├─ AuthService.isAccountLocked()
  ├─ AuthService.comparePasswords()
  ├─ AuthService.trackLoginAttempt()
  └─ TokenService.generateTokens()

AuthService (7 métodos)
  ├─ hashPassword()
  ├─ comparePasswords()
  ├─ logout()
  ├─ trackLoginAttempt()
  ├─ isAccountLocked()
  ├─ createCodeVerificationEmail()
  └─ getData()

RegisterUserHandler
  ├─ QueryBus (Lee usuario)
  ├─ AuthService.hashPassword()
  ├─ KeyService.generateKeyPair()
  ├─ KeyService.encryptPrivateKey()
  └─ UserProjection.register()
```

### DESPUÉS

```
LoginHandler (LIMPIO)
  ├─ QueryBus (Lee usuario)
  ├─ QueryBus (Lee permisos)
  └─ AuthenticationDomainService.authenticate()

AuthenticationDomainService
  ├─ PasswordHashingService.compare()
  ├─ AccountSecurityService.isAccountLocked()
  ├─ AccountSecurityService.trackLoginAttempt()
  └─ TokenService.generateTokens()

RegisterUserHandler (LIMPIO)
  ├─ QueryBus (Lee usuario)
  ├─ User.create() ← TODO está aquí
  ├─ UserRepository.save()
  └─ EventPublisher.publishAll()

User.create() (AGREGADO)
  ├─ Email.create()         ← Value Object
  ├─ HashedPassword.create() ← Value Object
  ├─ CryptographicKeys.generate() ← Value Object
  └─ Emite UserRegisteredEvent

Event Listeners (SEPARADOS)
  ├─ OnUserRegisteredListener
  │  └─ EnviarEmailVerificacion()
  └─ OnPasswordChangedListener
     └─ LogearCambioContraseña()
```

---

## ✅ RESUMEN DE RESPUESTAS

| Pregunta                           | Respuesta                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| ¿LoginDomainService o AuthService? | **Ni uno ni otro.** Refactoriza AuthService en 4 servicios especializados de infraestructura. Crea **AuthenticationDomainService** que orquesta. |
| ¿Por qué no es redundante?         | AuthService actual hace 7 cosas. Después tendrás servicios con 1-2 responsabilidades cada uno. **MÁS simple, no más complejo.**                  |
| ¿Mix de Domain + Projections?      | Crea **Agregado User** con toda la lógica de dominio. Handler solo orquesta. Projection → Repository.                                            |
| ¿Dónde va cada línea de código?    | **Mapa proporcionado arriba.** Valor Objects, Domain Services, Infrastructure Services, Event Listeners.                                         |
| ¿Es mucho trabajo?                 | **Semana de refactoring.** Pero después: código limpio, testeable, CQRS real, DDD aplicado. Vale la pena.                                        |
