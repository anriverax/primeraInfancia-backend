# 📚 Guía: Cómo usar AuthDomainService desde los Handlers

## 🎯 Visión General

```
Handler (LIGERO)
    ↓
AuthDomainService (ORQUESTADOR)
    ├─ PasswordHashingService
    ├─ AccountSecurityService
    ├─ TokenManagementService
    └─ KeyService
```

El Handler es **coordinador** (orquesta lectura y escritura de BD).
AuthDomainService es **orquestador de dominio** (coordina servicios especializados).

---

## 1️⃣ CASO: LOGIN

### ❌ ANTES (Código actual)

```typescript
// src/core/auth/cqrs/commands/login/login.handler.ts
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { value1, value2 } = command;

    // Lógica de dominio AQUÍ en el handler
    const isLocked = await this.authService.isAccountLocked(value1);
    if (isLocked) {
      throw new UnauthorizedException("Cuenta bloqueada...");
    }

    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email: value1 }));
    if (!user) {
      await this.authService.trackLoginAttempt(value1, false);
      throw new NotFoundException("Credenciales incorrectas.");
    }

    const isPasswordValid = await this.authService.comparePasswords(value2, user.passwd);
    if (!isPasswordValid) {
      await this.authService.trackLoginAttempt(value1, false);
      throw new UnauthorizedException("Credenciales incorrectas...");
    }

    await this.authService.trackLoginAttempt(value1, true);
    const userPermissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));
    const result = await this.tokenService.generateTokens(user, userPermissions);

    return result;
  }
}
```

**Problema:** Handler hace demasiado. Es coordinador + lógica de dominio.

### ✅ DESPUÉS (Con AuthDomainService)

```typescript
// src/core/auth/cqrs/commands/login/login.handler.ts
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService // ← NUEVO
  ) {}

  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { value1: email, value2: password } = command;

    // 1. LECTURA: Obtener usuario y permisos (responsabilidad del handler)
    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email }));
    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    const permissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));

    // 2. LÓGICA DE DOMINIO: Delegar a servicio de dominio (responsabilidad de AuthDomainService)
    const result = await this.authDomain.authenticate(email, password, user, permissions);

    return result;
  }
}
```

**Ventaja:** Handler limpio y enfocado. AuthDomainService maneja toda la lógica de autenticación.

---

## 2️⃣ CASO: REGISTRO

### ❌ ANTES

```typescript
// src/core/auth/cqrs/commands/register/register-user.handler.ts
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly keyService: KeyService,
    private readonly userProjection: UserProjection
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { data } = command;

    // Lógica de validación AQUÍ
    const isExist = await this.queryBus.execute(new FindUniqueUserQuery({ email: data.email }));
    if (isExist?.email === data.email || isExist?.Person?.dui === data.dui) {
      throw new ConflictException("Este usuario ya se encuentra registrado en el sistema.");
    }

    // Lógica de criptografía AQUÍ
    const hashedPassword = await this.authService.hashPassword(data.passwd);
    const { publicKey, privateKey } = this.keyService.generateKeyPair();
    const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);

    // Persistencia AQUÍ
    await this.userProjection.register({
      ...data,
      publicKey,
      privateKey: encryptedPrivateKey,
      passwd: hashedPassword,
      isVerified: false
    });

    // Notificaciones AQUÍ
    await this.authService.createCodeVerificationEmail(data.email);
  }
}
```

**Problema:** Handler hace: validación + criptografía + persistencia + notificaciones.

### ✅ DESPUÉS

```typescript
// src/core/auth/cqrs/commands/register/register-user.handler.ts
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService, // ← NUEVO
    private readonly userRepository: UserRepository // ← NUEVO (Repository Pattern)
    // eventPublisher se inyectaría si hubiera eventos
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { data } = command;

    // 1. LECTURA: Validar que no existe (responsabilidad del handler)
    const existingUser = await this.queryBus.execute(new FindUniqueUserQuery({ email: data.email }));
    if (existingUser) {
      throw new ConflictException("Usuario ya registrado.");
    }

    // 2. LÓGICA DE DOMINIO: Preparar datos (responsabilidad de AuthDomainService)
    const { hashedPassword, publicKey, encryptedPrivateKey } =
      await this.authDomain.prepareUserRegistrationData(data.passwd);

    // 3. PERSISTENCIA: Guardar usuario (responsabilidad del handler + repository)
    await this.userRepository.create({
      ...data,
      passwd: hashedPassword,
      publicKey,
      privateKey: encryptedPrivateKey,
      isVerified: false
    });

    // 4. NOTIFICACIONES: Enviar email (responsabilidad de event listener)
    //    Aquí emitimos un evento que un listener procesará
    //    await this.eventPublisher.publish(new UserRegisteredEvent(data.email));

    // Por ahora, si lo necesitas inmediato:
    const verificationCode = await this.authDomain.createVerificationCode(data.email);
    // El email se envía en un listener
  }
}
```

**Ventaja:** Separación clara de responsabilidades.

---

## 3️⃣ CASO: CAMBIAR CONTRASEÑA

### ❌ ANTES

```typescript
@CommandHandler(ChangePasswdCommand)
export class ChangePasswdHandler implements ICommandHandler<ChangePasswdCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService
  ) {}

  async execute(command: ChangePasswdCommand): Promise<void> {
    const { value1: newEmail, value2: oldPassword, value3: newPassword } = command;
    const { id, email } = command.req["user"];

    // Lógica AQUÍ
    const isExist = await this.queryBus.execute(new FindUniqueUserQuery({ email }));

    const isTheSamePassword = await this.authService.comparePasswords(newPassword, isExist.passwd);
    if (isTheSamePassword) {
      throw new UnauthorizedException("La contraseña nueva debe ser diferente a la actual.");
    }

    const pwdMatch = await this.authService.comparePasswords(isExist.passwd, oldPassword);
    if (!pwdMatch) {
      throw new UnauthorizedException("Contraseña actual incorrecta.");
    }

    const newHashedPassword = await this.authService.hashPassword(newPassword);

    await this.queryBus.execute(
      new UpdateUserPasswordQuery({
        id,
        email,
        data: { passwd: newHashedPassword }
      })
    );
  }
}
```

### ✅ DESPUÉS

```typescript
@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService,
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { userId, email, oldPassword, newPassword, newEmail } = command;

    // 1. LECTURA: Obtener usuario
    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email }));
    if (!user) {
      throw new NotFoundException("Usuario no encontrado.");
    }

    // 2. LÓGICA DE DOMINIO: Validar y hashear nueva contraseña
    const newHashedPassword = await this.authDomain.changePassword(
      oldPassword,
      newPassword,
      user.passwd
    );

    // 3. PERSISTENCIA: Actualizar usuario
    await this.userRepository.update(userId, {
      passwd: newHashedPassword,
      email: newEmail
    });
  }
}
```

**Beneficio:** AuthDomainService valida toda la lógica en un solo lugar.

---

## 4️⃣ CASO: LOGOUT

### ❌ ANTES

```typescript
async logout(id: number, accessToken: string): Promise<boolean> {
  // Lógica AQUÍ en authService
  const refreshTokenKey = `auth:refresh:${id}`;
  await this.redisService.del(refreshTokenKey);
  // ... más código
}
```

### ✅ DESPUÉS

```typescript
// src/core/auth/cqrs/commands/logout/logout.handler.ts
@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authDomain: AuthDomainService) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { userId, tokenId } = command;

    // Delega todo a AuthDomainService
    await this.authDomain.logout(userId, tokenId);
  }
}
```

---

## 📊 RESUMEN: Dónde va cada responsabilidad

| Operación             | Handler            | AuthDomainService    | Servicio especializado |
| --------------------- | ------------------ | -------------------- | ---------------------- |
| Lectura de BD         | ✅ Handler         | -                    | -                      |
| Validación de dominio | -                  | ✅ AuthDomainService | -                      |
| Criptografía          | -                  | ✅ AuthDomainService | PasswordHashingService |
| Seguridad (lockout)   | -                  | ✅ AuthDomainService | AccountSecurityService |
| Generación tokens     | -                  | ✅ AuthDomainService | TokenManagementService |
| Escritura en BD       | ✅ Handler         | -                    | -                      |
| Notificaciones        | ✅ Handler (event) | -                    | -                      |

---

## 🔗 Inyecciones necesarias en cada Handler

### LoginHandler

```typescript
constructor(
  private readonly queryBus: QueryBus,
  private readonly authDomain: AuthDomainService  // ← SOLO ESTO
)
```

### RegisterUserHandler

```typescript
constructor(
  private readonly queryBus: QueryBus,
  private readonly authDomain: AuthDomainService,
  private readonly userRepository: UserRepository,
  private readonly eventPublisher: EventPublisher  // ← Para notificaciones
)
```

### ChangePasswordHandler

```typescript
constructor(
  private readonly queryBus: QueryBus,
  private readonly authDomain: AuthDomainService,
  private readonly userRepository: UserRepository
)
```

### LogoutHandler

```typescript
constructor(
  private readonly authDomain: AuthDomainService  // ← SOLO ESTO
)
```

---

## ✅ Checklist de conversión

- [ ] Crear `PasswordHashingService` con métodos `hash()` y `compare()`
- [ ] Crear `AccountSecurityService` con métodos de lockout
- [ ] Actualizar `TokenManagementService` (ya existe, revisar métodos)
- [ ] Crear `AuthDomainService` (ya creado arriba)
- [ ] Actualizar `LoginHandler` para usar AuthDomainService
- [ ] Actualizar `RegisterUserHandler` para usar AuthDomainService
- [ ] Actualizar `ChangePasswordHandler` para usar AuthDomainService
- [ ] Crear `UserRepository` (implementación de Repository Pattern)
- [ ] Actualizar módulo para inyectar todas las dependencias
- [ ] Test para cada caso de uso

---

## 🎓 Propósito de cada capa

```
┌─────────────────────────────────────────┐
│  HANDLER (Orquestador de aplicación)    │  ← Coordina lectura/escritura BD + eventos
├─────────────────────────────────────────┤
│  AUTHDOMAINSERVICE (Orquestador lógica) │  ← Coordina servicios especializados
├─────────────────────────────────────────┤
│  SERVICIOS ESPECIALIZADOS               │  ← Implementan lógica específica
│  ├─ PasswordHashingService              │     - Criptografía
│  ├─ AccountSecurityService              │     - Seguridad
│  ├─ TokenManagementService              │     - Tokens JWT
│  └─ KeyService                          │     - Claves RSA
├─────────────────────────────────────────┤
│  REPOSITORIO                            │  ← Abstrae acceso a datos
├─────────────────────────────────────────┤
│  BASE DE DATOS (Prisma)                 │  ← Persistencia
└─────────────────────────────────────────┘
```

Cada capa tiene una responsabilidad clara y única. **Es lo que busca DDD.**
