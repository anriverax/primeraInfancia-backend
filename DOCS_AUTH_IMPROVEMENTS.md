# 🚀 Mejoras Recomendadas para el Módulo de Autenticación

## 📋 Índice

1. [Problemas Identificados](#problemas-identificados)
2. [Mejoras de Seguridad](#mejoras-de-seguridad)
3. [Mejoras de Rendimiento](#mejoras-de-rendimiento)
4. [Mejoras de Código](#mejoras-de-código)
5. [Nuevas Funcionalidades](#nuevas-funcionalidades)
6. [Código Mejorado](#código-mejorado)

---

## 🔴 Problemas Identificados

### 1. Verificación de Email - Colisión de Claves

**Problema Actual:**

```typescript
// En auth.service.ts
await this.redisService.set("verifyEmailCode", code, 3 * 24 * 60 * 60);
```

**Problema:**

- Todos los usuarios comparten la misma clave `verifyEmailCode`
- Si dos usuarios se registran simultáneamente, el segundo código sobrescribe al primero
- Solo el último usuario registrado puede verificar su email

**Solución:**

```typescript
await this.redisService.set(`verifyEmailCode:${userId}`, code, 3 * 24 * 60 * 60);
```

### 2. Refresh Token - Sin Permisos

**Problema Actual:**

```typescript
// token.service.ts - El refresh token no incluye permissions
async setRefreshToken(data: {
  id: number;
  email: string;
  rolId: number;
  role: string;
}): Promise<string>
```

**Problema:**

- Al hacer refresh, debe consultar los permisos de nuevo
- Si los permisos cambian en BD, no se reflejan hasta el próximo login completo

**Solución:**

- Incluir `permissions` en el payload del refresh token
- O consultar permisos frescos en cada refresh (actual, pero ineficiente)
- **Recomendación:** Mantener como está pero documentar que cambios de permisos requieren re-login

### 3. Rate Limiting Ausente

**Problema:** No hay protección contra fuerza bruta

**Impacto:**

- Ataques de diccionario en `/login`
- Spam en `/register`
- Abuso de `/refresh-token`

### 4. Logging de Seguridad Insuficiente

**Problemas:**

- No se registran intentos fallidos de login
- No se alertan múltiples fallos desde la misma IP
- No hay auditoría de cambios de contraseña

### 5. Gestión de Secrets

**Problema:** JWT_REFRESH_SECRET es estático sin rotación

---

## 🛡️ Mejoras de Seguridad

### 1. Rate Limiting con Redis

**Instalación:**

```bash
npm install @nestjs/throttler
```

**Implementación:**

```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 10 // 10 requests
      }
    ])
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
```

**Rate Limits Personalizados:**

```typescript
// auth.controller.ts
import { Throttle } from "@nestjs/throttler";

@Controller()
export class AuthController {
  // Login: 5 intentos por minuto
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  async login(@Body() data: LoginDto) {
    // ...
  }

  // Register: 3 intentos por hora
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  @Post("register")
  async register(@Body() data: AuthDto) {
    // ...
  }
}
```

### 2. Login Attempts Tracking

**Nueva implementación:**

```typescript
// auth.service.ts
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60; // 15 minutos

  async trackLoginAttempt(email: string, success: boolean): Promise<void> {
    const key = `login:attempts:${email}`;

    if (success) {
      await this.redisService.del(key);
      return;
    }

    const attempts = await this.redisService.get(key);
    const count = attempts ? parseInt(attempts) + 1 : 1;

    if (count >= this.MAX_LOGIN_ATTEMPTS) {
      await this.redisService.set(`login:locked:${email}`, "locked", this.LOCKOUT_DURATION);
      throw new UnauthorizedException(
        `Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos.`
      );
    }

    await this.redisService.set(key, count.toString(), 60 * 60); // 1 hora
  }

  async isAccountLocked(email: string): Promise<boolean> {
    const locked = await this.redisService.get(`login:locked:${email}`);
    return locked === "locked";
  }
}
```

**Uso en login:**

```typescript
@Post('login')
async login(@Body() data: LoginDto): Promise<NestResponse<ILoginResponse>> {
  const { value1: email, value2: password } = data;

  // Verificar si la cuenta está bloqueada
  if (await this.authService.isAccountLocked(email)) {
    throw new UnauthorizedException('Cuenta temporalmente bloqueada.');
  }

  const user = await this.queryBus.execute(new FindUniqueUserQuery({ email }));

  if (!user) {
    await this.authService.trackLoginAttempt(email, false);
    throw new NotFoundException('Credenciales incorrectas.');
  }

  try {
    await this.authService.verifyPasswd(user.passwd, password);
    await this.authService.trackLoginAttempt(email, true);
  } catch (error) {
    await this.authService.trackLoginAttempt(email, false);
    throw error;
  }

  // Resto del código...
}
```

### 3. Audit Logging

**Nueva clase AuditService:**

```typescript
// services/audit.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";

export enum AuditAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  EMAIL_VERIFY = "EMAIL_VERIFY",
  TOKEN_REFRESH = "TOKEN_REFRESH",
  LOGIN_FAILED = "LOGIN_FAILED"
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    userId?: number;
    action: AuditAction;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        ip: params.ip,
        userAgent: params.userAgent,
        metadata: params.metadata || {},
        createdAt: new Date()
      }
    });
  }

  async getRecentFailedLogins(email: string, minutes: number = 60): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    return this.prisma.auditLog.count({
      where: {
        action: AuditAction.LOGIN_FAILED,
        metadata: { path: ["email"], equals: email },
        createdAt: { gte: since }
      }
    });
  }
}
```

**Esquema Prisma:**

```prisma
model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    Int?
  action    String
  ip        String?
  userAgent String?
  metadata  Json     @default("{}")
  createdAt DateTime @default(now())

  User      User?    @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

### 4. IP Binding (Opcional)

**Ventajas:**

- Dificulta el robo de tokens
- Detecta uso de tokens desde ubicaciones diferentes

**Desventajas:**

- Problemas con IPs dinámicas
- Problemas con usuarios móviles

**Implementación:**

```typescript
// token.service.ts
async setAccessToken(data: {
  id: number;
  email: string;
  rolId: number;
  role: string;
  permissions: string[];
  ip?: string; // Nuevo
}): Promise<string> {
  const { id, email, rolId, role, permissions, ip } = data;
  const tokenId = uuidv4();

  const privateKey = getPrivateKey(this.config);

  const accessToken = this.jwtService.sign(
    { sub: id, email, rolId, role, tokenId, permissions },
    {
      privateKey: privateKey,
      algorithm: "RS256",
      expiresIn: this.config.get<string>("jwt.expiration") || "15m"
    }
  );

  const accessTokenKey = `auth:access:${tokenId}`;

  // Almacenar IP junto con el token
  const tokenData = JSON.stringify({ status: 'valid', ip });
  await this.redisService.set(accessTokenKey, tokenData, 15 * 60);

  return accessToken;
}
```

**Validación en AccessTokenGuard:**

```typescript
// Obtener IP de la request
const ip = request.ip || request.headers["x-forwarded-for"];

// Verificar IP
const tokenData = JSON.parse(await this.redis.get(tokenKey));
if (tokenData.ip && tokenData.ip !== ip) {
  this.logger.warn(`IP mismatch for user ${payload.sub}: ${tokenData.ip} vs ${ip}`);
  // Opcional: bloquear o alertar
}
```

### 5. CSRF Protection

**Para APIs REST con tokens:** No es estrictamente necesario

**Para sesiones con cookies:** Implementar CSRF tokens

```bash
npm install csurf
```

---

## ⚡ Mejoras de Rendimiento

### 1. Caché de Permisos

**Problema:** Consulta permisos en cada refresh

**Solución:** Cachear permisos en Redis

```typescript
// auth.service.ts
async getUserPermissions(roleId: number): Promise<string[]> {
  const cacheKey = `permissions:role:${roleId}`;

  // Intentar desde caché
  const cached = await this.redisService.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Consultar BD
  const permissions = await this.queryBus.execute(
    new GetByRolIdQuery(roleId)
  );

  // Cachear por 1 hora
  await this.redisService.set(
    cacheKey,
    JSON.stringify(permissions),
    60 * 60
  );

  return permissions;
}
```

### 2. Batch Token Verification

Si tienes múltiples microservicios verificando tokens:

```typescript
// Usar una sola instancia de Redis
// Configurar Redis Cluster para escalabilidad
```

### 3. Lazy Loading de Claves RSA

```typescript
// key.service.ts
private publicKeyCache: Map<number, string> = new Map();

async getPublicKey(userId: number): Promise<string> {
  if (this.publicKeyCache.has(userId)) {
    return this.publicKeyCache.get(userId)!;
  }

  const key = await this.queryBus.execute(
    new GetByUserIdUserKeyQuery(userId)
  );

  this.publicKeyCache.set(userId, key.publicKey);
  return key.publicKey;
}
```

---

## 💻 Mejoras de Código

### 1. Tipos Mejorados para Request

**Crear archivo de tipos:**

```typescript
// common/types/express.d.ts
import { IPayload } from "@/core/auth/dto/auth.type";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: number;
        id: number;
        email: string;
        rolId: number;
        role: string;
        tokenId?: string;
        permissions: string[];
        iat: number;
        exp: number;
      };
      token?: string;
    }
  }
}
```

**Uso mejorado:**

```typescript
// Antes
const { sub } = req["user"] as { sub: number; email: string; role: string };

// Después
const { sub } = req.user!; // TypeScript sabe el tipo
```

### 2. Constantes Centralizadas

```typescript
// auth/constants/auth.constants.ts
export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_TTL: 15 * 60, // 15 minutos
  REFRESH_TOKEN_TTL: 7 * 24 * 60 * 60, // 7 días
  VERIFY_CODE_TTL: 3 * 24 * 60 * 60, // 3 días
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60, // 15 minutos
  RSA_KEY_SIZE: 2048
} as const;

export const REDIS_KEYS = {
  accessToken: (tokenId: string) => `auth:access:${tokenId}`,
  refreshToken: (userId: number) => `auth:refresh:${userId}`,
  verifyCode: (userId: number) => `verifyEmailCode:${userId}`,
  loginAttempts: (email: string) => `login:attempts:${email}`,
  loginLocked: (email: string) => `login:locked:${email}`,
  permissions: (roleId: number) => `permissions:role:${roleId}`
} as const;
```

### 3. Error Messages Centralizados

```typescript
// auth/constants/auth.messages.ts
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Inicio de sesión exitoso.",
  LOGOUT_SUCCESS: "Ha cerrado sesión correctamente.",
  REGISTER_SUCCESS: "Registro exitoso. Revisa tu email para verificar tu cuenta.",

  ERROR_INVALID_CREDENTIALS: "Credenciales incorrectas.",
  ERROR_USER_NOT_FOUND: "El usuario no existe en el sistema.",
  ERROR_ACCOUNT_LOCKED: "Cuenta bloqueada por múltiples intentos fallidos.",
  ERROR_INVALID_TOKEN: "Token inválido o expirado.",
  ERROR_EMAIL_ALREADY_EXISTS: "Este correo electrónico ya está asociado a una cuenta.",
  ERROR_UNAUTHORIZED: "No autorizado.",

  EMAIL_VERIFICATION_SENT: "Se ha enviado un código de verificación a tu correo.",
  EMAIL_VERIFIED: "Email verificado exitosamente.",
  PASSWORD_CHANGED: "Contraseña cambiada exitosamente."
} as const;
```

### 4. Validación Mejorada con Custom Decorators

```typescript
// common/validators/is-strong-password.validator.ts
import { registerDecorator, ValidationOptions } from "class-validator";

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isStrongPassword",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== "string") return false;

          // Mínimo 8 caracteres
          if (value.length < 8) return false;

          // Al menos una mayúscula
          if (!/[A-Z]/.test(value)) return false;

          // Al menos una minúscula
          if (!/[a-z]/.test(value)) return false;

          // Al menos un número
          if (!/[0-9]/.test(value)) return false;

          // Al menos un carácter especial
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;

          return true;
        },
        defaultMessage() {
          return "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
        }
      }
    });
  };
}
```

**Uso:**

```typescript
// auth.dto.ts
export class AuthDto {
  @IsNotEmpty({ message: "La contraseña es obligatoria." })
  @IsStrongPassword()
  @Transform(decryptTextTransformer)
  passwd: string;
}
```

---

## 🆕 Nuevas Funcionalidades

### 1. Refresh Token Rotation

**Seguridad mejorada:** Cada vez que se usa un refresh token, se invalida y se genera uno nuevo

```typescript
// token.service.ts
async rotateRefreshToken(userId: number, oldToken: string): Promise<string> {
  // Invalidar el token anterior
  const oldKey = `auth:refresh:${userId}`;
  await this.redisService.del(oldKey);

  // Generar nuevo token
  const newRefreshToken = this.jwtService.sign(
    { sub: userId, tokenVersion: Date.now() },
    {
      secret: this.config.get<string>("jwt.refreshSecret"),
      expiresIn: this.config.get<string>("jwt.refreshToken")
    }
  );

  // Almacenar nuevo token
  await this.redisService.set(oldKey, newRefreshToken, 7 * 24 * 60 * 60);

  return newRefreshToken;
}
```

### 2. Multi-Device Session Management

**Permitir múltiples sesiones activas:**

```typescript
// Cambiar estructura en Redis
// De: auth:refresh:{userId} -> {token}
// A: auth:refresh:{userId}:{deviceId} -> {token}

interface SessionInfo {
  deviceId: string;
  deviceName: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
  lastUsed: Date;
}

async getAllSessions(userId: number): Promise<SessionInfo[]> {
  const pattern = `auth:refresh:${userId}:*`;
  const keys = await this.redisService.keys(pattern);

  const sessions: SessionInfo[] = [];
  for (const key of keys) {
    const data = await this.redisService.get(key);
    if (data) {
      sessions.push(JSON.parse(data));
    }
  }

  return sessions;
}

async revokeSession(userId: number, deviceId: string): Promise<void> {
  const key = `auth:refresh:${userId}:${deviceId}`;
  await this.redisService.del(key);
}
```

### 3. Password Reset via Email

```typescript
// Nuevo endpoint
@Post('forgot-password')
async forgotPassword(@Body() data: { email: string }): Promise<NestResponse<void>> {
  const user = await this.queryBus.execute(
    new FindUniqueUserQuery({ email: data.email })
  );

  if (!user) {
    // No revelar si el usuario existe
    return {
      statusCode: 200,
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña.',
    };
  }

  const resetToken = uuidv4();
  await this.redisService.set(
    `password:reset:${resetToken}`,
    user.id.toString(),
    60 * 60 // 1 hora
  );

  await this.authService.sendPasswordResetEmail(user.email, resetToken);

  return {
    statusCode: 200,
    message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña.',
  };
}

@Post('reset-password')
async resetPassword(
  @Body() data: { token: string; newPassword: string }
): Promise<NestResponse<void>> {
  const userId = await this.redisService.get(`password:reset:${data.token}`);

  if (!userId) {
    throw new BadRequestException('Token inválido o expirado.');
  }

  const hashedPassword = await this.authService.hashPassword(data.newPassword);

  await this.prisma.user.update({
    where: { id: parseInt(userId) },
    data: { passwd: hashedPassword },
  });

  await this.redisService.del(`password:reset:${data.token}`);

  return {
    statusCode: 200,
    message: 'Contraseña restablecida exitosamente.',
  };
}
```

### 4. Two-Factor Authentication (2FA)

**Instalación:**

```bash
npm install speakeasy qrcode
npm install -D @types/speakeasy @types/qrcode
```

**Implementación básica:**

```typescript
// auth.service.ts
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

async enableTwoFactor(userId: number): Promise<{ secret: string; qrCode: string }> {
  const secret = speakeasy.generateSecret({
    name: `Primera Infancia (${userId})`,
    length: 32,
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  // Almacenar secret temporalmente hasta que el usuario lo confirme
  await this.redisService.set(
    `2fa:pending:${userId}`,
    secret.base32,
    60 * 15 // 15 minutos
  );

  return {
    secret: secret.base32,
    qrCode,
  };
}

async verifyAndEnable2FA(userId: number, token: string): Promise<boolean> {
  const secret = await this.redisService.get(`2fa:pending:${userId}`);

  if (!secret) {
    throw new BadRequestException('No hay configuración 2FA pendiente.');
  }

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Permite 2 períodos de tiempo antes/después
  });

  if (verified) {
    // Guardar en BD
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret, twoFactorEnabled: true },
    });

    // Limpiar temporal
    await this.redisService.del(`2fa:pending:${userId}`);
  }

  return verified;
}

async verify2FAToken(userId: number, token: string): Promise<boolean> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return true; // 2FA no habilitado
  }

  return speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2,
  });
}
```

---

## 📦 Código Mejorado Completo

### auth.service.ts (Refactorizado)

```typescript
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { Resend } from "resend";
import { RedisService } from "@/services/redis/redis.service";
import { generateCode, getPublicKey } from "@/common/helpers/functions";
import { ILoginResponse, IUser } from "../dto/auth.type";
import { renderedVerifyEmail } from "../templates/verifyEmail";
import { renderedChangePasswd } from "../templates/changePasswd";
import { AUTH_CONSTANTS, REDIS_KEYS } from "../constants/auth.constants";
import { AUTH_MESSAGES } from "../constants/auth.messages";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon.hash(password, {
      type: argon.argon2id, // Más seguro
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4
    });
  }

  async verifyPasswd(hashedPassword: string, passwd: string): Promise<void> {
    const pwdMatch = await argon.verify(hashedPassword, passwd);

    if (!pwdMatch) {
      throw new UnauthorizedException(AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS);
    }
  }

  async sendVerificationEmail(userId: number, email: string, passwd: string): Promise<void> {
    try {
      const resend = new Resend(this.config.get<string>("resend"));
      const code = generateCode(6);

      await resend.emails.send({
        from: "Docentes Primera Infancia <anriverax@codear.dev>",
        to: [email],
        subject: "Verifica tu correo electrónico - Docentes Primera Infancia",
        html: renderedVerifyEmail(code, passwd)
      });

      // FIX: Usar userId en la clave
      await this.redisService.set(REDIS_KEYS.verifyCode(userId), code, AUTH_CONSTANTS.VERIFY_CODE_TTL);
    } catch (error) {
      this.logger.error(`❌ Error enviando email de verificación:`, error);
      throw new BadRequestException("Error al enviar el correo electrónico. Intenta nuevamente.");
    }
  }

  async sendChangePasswd(email: string): Promise<void> {
    try {
      const resend = new Resend(this.config.get<string>("resend"));

      await resend.emails.send({
        from: "Docentes Primera Infancia <anriverax@codear.dev>",
        to: [email],
        subject: "Cambio de contraseña - Docentes Primera Infancia",
        html: renderedChangePasswd()
      });
    } catch (error) {
      this.logger.error(`❌ Error enviando email de cambio de contraseña:`, error);
      throw new BadRequestException("Error al enviar el correo electrónico. Intenta nuevamente.");
    }
  }

  async logout(id: number, accessToken: string): Promise<boolean> {
    try {
      // Eliminar refresh token
      const refreshTokenKey = REDIS_KEYS.refreshToken(id);
      await this.redisService.del(refreshTokenKey);

      if (accessToken) {
        const publicKey = getPublicKey(this.config);

        const accessTokenPayload = await this.jwtService.verifyAsync(accessToken, {
          publicKey: publicKey,
          algorithms: ["RS256"]
        });

        const accessTokenKey = REDIS_KEYS.accessToken(accessTokenPayload.tokenId);
        await this.redisService.del(accessTokenKey);
      }

      return true;
    } catch (error) {
      this.logger.error("Error en logout:", error);
      throw new UnauthorizedException(AUTH_MESSAGES.ERROR_INVALID_TOKEN);
    }
  }

  async verifyEmailCode(userId: number, code: string): Promise<boolean> {
    try {
      // FIX: Usar userId en la clave
      const storedCode = await this.redisService.get(REDIS_KEYS.verifyCode(userId));

      if (storedCode && storedCode === code) {
        await this.redisService.del(REDIS_KEYS.verifyCode(userId));
        return true;
      }

      throw new BadRequestException("Código de verificación incorrecto o expirado.");
    } catch (error) {
      this.logger.error(`❌ Error verificando código:`, error);

      if (error instanceof BadRequestException) throw error;

      throw new BadRequestException("Error al verificar el código.");
    }
  }

  getData(
    accessToken: string,
    refreshToken: string,
    user: IUser,
    userPermissions: string[]
  ): ILoginResponse {
    const {
      isVerified,
      email,
      avatar,
      Role: { name }
    } = user;

    const firstName = user.Person?.firstName ?? "";
    const lastName = user.Person?.lastName1 ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      accessToken,
      refreshToken,
      user: {
        email,
        isVerified,
        name: fullName,
        picture: avatar,
        role: name
      },
      permissions: userPermissions
    };
  }

  // NUEVO: Tracking de intentos de login
  async trackLoginAttempt(email: string, success: boolean): Promise<void> {
    const key = REDIS_KEYS.loginAttempts(email);

    if (success) {
      await this.redisService.del(key);
      return;
    }

    const attempts = await this.redisService.get(key);
    const count = attempts ? parseInt(attempts) + 1 : 1;

    if (count >= AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      await this.redisService.set(
        REDIS_KEYS.loginLocked(email),
        "locked",
        AUTH_CONSTANTS.LOCKOUT_DURATION
      );

      this.logger.warn(`Cuenta bloqueada: ${email} (${count} intentos)`);

      throw new UnauthorizedException(
        `Cuenta bloqueada por múltiples intentos fallidos. Intenta en ${AUTH_CONSTANTS.LOCKOUT_DURATION / 60} minutos.`
      );
    }

    await this.redisService.set(key, count.toString(), 60 * 60);
  }

  async isAccountLocked(email: string): Promise<boolean> {
    const locked = await this.redisService.get(REDIS_KEYS.loginLocked(email));
    return locked === "locked";
  }
}
```

---

## ✅ Checklist de Implementación

### Prioridad Alta (Seguridad)

- [ ] Fix: Código de verificación con userId
- [ ] Implementar rate limiting
- [ ] Tracking de intentos de login
- [ ] Audit logging básico

### Prioridad Media (Mejoras)

- [ ] Centralizar constantes y mensajes
- [ ] Mejorar tipos TypeScript
- [ ] Caché de permisos
- [ ] Validación de contraseña fuerte

### Prioridad Baja (Features)

- [ ] Password reset via email
- [ ] Multi-device sessions
- [ ] 2FA (opcional)
- [ ] Refresh token rotation

---

**Siguiente paso recomendado:** Empezar con el fix del código de verificación y el rate limiting.
