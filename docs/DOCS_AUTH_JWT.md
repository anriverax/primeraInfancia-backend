# Documentación del Módulo de Autenticación y JWT

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Componentes Principales](#componentes-principales)
4. [Sistema de Tokens](#sistema-de-tokens)
5. [Guards y Decoradores](#guards-y-decoradores)
6. [Gestión de Claves](#gestión-de-claves)
7. [Seguridad](#seguridad)
8. [Recomendaciones de Mejora](#recomendaciones-de-mejora)

---

## 🏗️ Arquitectura General

El módulo de autenticación implementa un sistema robusto basado en:

- **JWT con firma asimétrica (RS256)** para access tokens
- **JWT con firma simétrica (HS256)** para refresh tokens
- **Redis** para gestión de sesiones y revocación de tokens
- **CQRS** (Command Query Responsibility Segregation)
- **Argon2** para hashing de contraseñas
- **Rotación de claves RSA** por usuario

### Estructura de Archivos

```
src/core/auth/
├── auth.module.ts              # Módulo principal
├── auth.controller.ts          # Endpoints HTTP
├── services/
│   ├── auth.service.ts         # Lógica de autenticación
│   ├── token.service.ts        # Gestión de tokens JWT
│   └── key.service.ts          # Gestión de claves RSA
├── cqrs/
│   ├── commands/              # Comandos (registro, cambio contraseña)
│   ├── queries/               # Consultas (buscar usuarios, roles)
│   ├── events/                # Eventos del dominio
│   └── projections/           # Proyecciones de datos
├── dto/
│   ├── auth.dto.ts           # DTOs de validación
│   └── auth.type.ts          # Tipos TypeScript
└── templates/                # Plantillas de email
```

---

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario

```
POST /register
├── Validación de datos (AuthDto)
├── Hash de contraseña (Argon2)
├── Generación de par de claves RSA
├── Almacenamiento en BD
├── Envío de email de verificación
└── Código de verificación guardado en Redis (TTL: 3 días)
```

**DTO de Registro:**

- Datos personales (firstName, lastName1, lastName2, DUI, género, etc.)
- Datos académicos (career, nip)
- Credenciales (email, passwd)
- Validaciones con class-validator

### 2. Login

```
POST /login
├── Buscar usuario por email
├── Verificar contraseña con Argon2
├── Obtener permisos del rol
├── Generar Access Token (RS256, TTL: 15min)
├── Generar Refresh Token (HS256, TTL: 7 días)
├── Almacenar tokens en Redis
└── Retornar tokens + datos usuario
```

**Respuesta:**

```typescript
{
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    isVerified: boolean;
    name: string;
    picture: string | null;
    role: string;
  };
  permissions: string[];
}
```

### 3. Refresh Token

```
POST /refresh-token
├── Validar refresh token (RefreshTokenGuard)
├── Verificar token en Redis
├── Generar nuevo access token
├── Retornar nuevo access token + datos actualizados
```

### 4. Logout

```
POST /logout
├── Validar access token
├── Eliminar refresh token de Redis
├── Eliminar access token de Redis
└── Sesión terminada
```

---

## 🔧 Componentes Principales

### AuthService (`auth.service.ts`)

**Responsabilidades:**

- Hash y verificación de contraseñas
- Envío de emails (verificación y cambio de contraseña)
- Logout y revocación de tokens
- Verificación de códigos de email

**Métodos principales:**

```typescript
// Hash de contraseña con Argon2
async hashPassword(password: string): Promise<string>

// Verificar contraseña
async verifyPasswd(hashedPassword: string, passwd: string): Promise<void>

// Enviar email de verificación
async sendVerificationEmail(email: string, passwd: string): Promise<void>

// Logout con revocación de tokens
async logout(id: number, accessToken: string): Promise<boolean>

// Verificar código de email
async verifyEmailCode(code: string): Promise<boolean>
```

### TokenService (`token.service.ts`)

**Responsabilidades:**

- Generación de access tokens (RS256)
- Generación de refresh tokens (HS256)
- Refresh de tokens
- Almacenamiento en Redis

**Access Token:**

```typescript
{
  sub: number;              // User ID
  email: string;
  rolId: number;
  role: string;
  tokenId: string;          // UUID único
  permissions: string[];
  iat: number;
  exp: number;
}
```

- **Algoritmo:** RS256 (RSA + SHA256)
- **Firma:** Clave privada del sistema
- **TTL:** 15 minutos
- **Redis Key:** `auth:access:{tokenId}`

**Refresh Token:**

```typescript
{
  sub: number; // User ID
  email: string;
  rolId: number;
  role: string;
  iat: number;
  exp: number;
}
```

- **Algoritmo:** HS256 (HMAC + SHA256)
- **Secret:** JWT_REFRESH_SECRET
- **TTL:** 7 días
- **Redis Key:** `auth:refresh:{userId}`

### KeyService (`key.service.ts`)

**Responsabilidades:**

- Generación de pares de claves RSA (2048 bits)
- Encriptación/desencriptación de claves privadas
- Rotación de claves por usuario
- Firma y verificación de datos

**Características:**

- Claves RSA de 2048 bits
- Encriptación de claves privadas con AES-256-CBC
- Soporte para múltiples claves activas por usuario
- Verificación con cualquier clave pública del usuario

---

## 🛡️ Sistema de Tokens

### Access Token (RS256)

**Generación:**

1. Se crea un UUID único (`tokenId`)
2. Se firma el payload con la clave privada del sistema
3. Se almacena `tokenId: "valid"` en Redis con TTL de 15 minutos
4. Se retorna el token firmado

**Validación:**

1. Se verifica la firma con la clave pública del sistema
2. Se comprueba que el `tokenId` existe en Redis
3. Se verifica que el valor sea "valid"
4. Se añade el payload a `request.user`

**Ventajas:**

- No se puede falsificar (firma asimétrica)
- Se puede revocar inmediatamente (Redis)
- Incluye permisos en el payload

### Refresh Token (HS256)

**Generación:**

1. Se firma con secret simétrico
2. Se almacena en Redis: `auth:refresh:{userId}: {token}`
3. TTL de 7 días

**Validación:**

1. Se verifica la firma con el secret
2. Se compara con el token almacenado en Redis
3. Si coincide, se genera un nuevo access token

---

## 🔒 Guards y Decoradores

### AccessTokenGuard

**Ubicación:** `src/common/guards/accessToken.guard.ts`

**Función:**

- Valida el access token en cada petición protegida
- Verifica la firma RS256 con clave pública
- Comprueba que el token no esté revocado en Redis
- Inyecta el payload en `request.user`

**Uso:**

```typescript
@UseGuards(AccessTokenGuard)
@Get('protected-route')
async protectedRoute(@Req() req: Request) {
  const user = req['user']; // { sub, email, role, permissions, ... }
}
```

### RefreshTokenGuard

**Ubicación:** `src/common/guards/refreshToken.guard.ts`

**Función:**

- Valida el refresh token
- Verifica la firma HS256
- No verifica Redis (lo hace TokenService.refreshToken)

### @AuthRequired Decorator

**Ubicación:** `src/common/decorators/authRequired.decorator.ts`

**Función:**

- Marca una ruta como protegida
- Aplica automáticamente AccessTokenGuard
- Establece metadata `auth:isPrivate: true`

**Uso:**

```typescript
@AuthRequired()
@Post('my-protected-endpoint')
async myProtectedEndpoint() {
  // Solo accesible con token válido
}
```

---

## 🔑 Gestión de Claves

### Claves del Sistema (JWT)

**Ubicación:** `keys/jwt/`

- `private.key` - Clave privada RSA para firmar access tokens
- `public.key` - Clave pública RSA para verificar access tokens

**Carga de Claves:**

```typescript
// En desarrollo: Lee del filesystem
if (process.env.NODE_ENV === "development") {
  return fs.readFileSync(process.env.JWT_PRIVATE_KEY!, "utf8");
}

// En producción: Desde variable de entorno o filesystem
const privateKey =
  configService.get<string>("jwt.privateKey") ||
  fs.readFileSync(configService.get<string>("jwt.privateKey")!, "utf8");
```

### Claves de Usuario (UserKey)

**Propósito:** Firma y verificación de datos específicos del usuario

**Esquema:**

```prisma
model UserKey {
  id         Int      @id @default(autoincrement())
  userId     Int
  publicKey  String
  privateKey String   // Encriptada con AES-256-CBC
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
}
```

**Encriptación:**

- Algoritmo: AES-256-CBC
- Secret: Variable de entorno `PRIVATEKEY_SECRET` (32 bytes hex)
- IV: 16 bytes aleatorios
- Formato: `{iv_hex}:{encrypted_hex}`

**Rotación de Claves:**

```typescript
// Desactiva todas las claves anteriores
await projection.updateMany(userId);

// Genera nuevo par RSA
const { publicKey, privateKey } = generateKeyPair();

// Encripta y almacena
const encrypted = encryptPrivateKey(privateKey);
await projection.create({ userId, publicKey, privateKey: encrypted });
```

---

## 🔐 Seguridad

### ✅ Buenas Prácticas Implementadas

1. **Hashing Seguro:**
   - Argon2 para contraseñas (ganador PHC)
   - Resistente a ataques GPU/ASIC

2. **Tokens Firmados:**
   - RS256 para access tokens (no repudiable)
   - HS256 para refresh tokens (más rápido)

3. **Revocación Inmediata:**
   - Tokens almacenados en Redis
   - Logout revoca ambos tokens

4. **TTL Apropiados:**
   - Access: 15 minutos
   - Refresh: 7 días
   - Códigos de verificación: 3 días

5. **Permisos en Token:**
   - Incluidos en access token
   - No requiere consulta a BD en cada request

6. **Validación Robusta:**
   - DTOs con class-validator
   - Regex para DUI, teléfono, email
   - Enums para género

7. **Encriptación de Claves:**
   - Claves privadas de usuario encriptadas
   - AES-256-CBC con IV aleatorio

### 🔍 Puntos de Mejora

1. **Rate Limiting:**
   - Falta protección contra fuerza bruta en login
   - Falta límite de intentos de refresh token

2. **Logging de Seguridad:**
   - Loguear intentos fallidos de login
   - Alertar sobre múltiples fallos desde misma IP

3. **Rotación de Secrets:**
   - JWT_REFRESH_SECRET es estático
   - No hay mecanismo de rotación

4. **Verificación de Email:**
   - Código almacenado con clave fija `verifyEmailCode`
   - Debería ser `verifyEmailCode:{userId}` para evitar colisiones

5. **CSRF Protection:**
   - Considerar CSRF tokens para operaciones sensibles

6. **IP Binding:**
   - Tokens no están vinculados a IP
   - Susceptible a robo de token

---

## 📊 Flujos Adicionales

### Verificación de Email

```
POST /verify-email
├── @AuthRequired (debe estar logueado)
├── Obtener userId del token
├── Comparar código con Redis
├── Si coincide: marcar isVerified = true
├── Eliminar código de Redis
└── Retornar éxito
```

### Cambio de Contraseña

```
POST /change-password
├── @AuthRequired
├── Validar contraseña anterior
├── Hash nueva contraseña
├── Actualizar en BD
├── Enviar email de notificación
└── Retornar datos actualizados
```

---

## 🔧 Variables de Entorno Requeridas

```env
# JWT
JWT_EXPIRATION=15m
JWT_REFRESH_TOKEN=7d
JWT_REFRESH_SECRET=your-secret-here
JWT_PRIVATE_KEY=./keys/jwt/private.key
JWT_PUBLIC_KEY=./keys/jwt/public.key

# Encriptación
PRIVATEKEY_SECRET=64-char-hex-string
PLAIN_TEXT=encryption-secret

# Redis
REDIS=redis://localhost:6379

# Email
RESEND=your-resend-api-key

# Node
NODE_ENV=development|production
```

---

## 📝 Endpoints Disponibles

### Públicos

| Método | Ruta             | Descripción               |
| ------ | ---------------- | ------------------------- |
| POST   | `/register`      | Registro de nuevo usuario |
| POST   | `/login`         | Inicio de sesión          |
| POST   | `/refresh-token` | Renovar access token      |

### Protegidos (@AuthRequired)

| Método | Ruta               | Descripción                  |
| ------ | ------------------ | ---------------------------- |
| POST   | `/verify-email`    | Verificar correo electrónico |
| POST   | `/change-password` | Cambiar contraseña           |
| POST   | `/logout`          | Cerrar sesión                |

---

## 🚀 Uso en Otros Módulos

### Proteger un Endpoint

```typescript
import { AuthRequired } from "@/common/decorators/authRequired.decorator";

@Controller("my-module")
export class MyController {
  @AuthRequired()
  @Get("protected")
  async protectedEndpoint(@Req() req: Request) {
    const { sub, email, role, permissions } = req["user"];
    // Tu lógica aquí
  }
}
```

### Obtener Información del Usuario

```typescript
@AuthRequired()
@Post('create-something')
async create(@Req() req: Request, @Body() dto: CreateDto) {
  const userId = req['user'].sub;
  const userEmail = req['user'].email;
  const userRole = req['user'].role;
  const userPermissions = req['user'].permissions;

  // Usar la información...
}
```

### Verificar Permisos Manualmente

```typescript
@AuthRequired()
@Post('admin-action')
async adminAction(@Req() req: Request) {
  const permissions = req['user'].permissions;

  if (!permissions.includes('admin.write')) {
    throw new ForbiddenException('No tienes permisos suficientes');
  }

  // Acción de admin...
}
```

---

## 🐛 Debugging

### Verificar Token en Redis

```bash
# Access Token
redis-cli GET "auth:access:{tokenId}"

# Refresh Token
redis-cli GET "auth:refresh:{userId}"

# Código de verificación
redis-cli GET "verifyEmailCode"
```

### Logs Importantes

- **AuthService:** Errores de email, verificación de códigos
- **AccessTokenGuard:** Validación de tokens, tokens expirados
- **RefreshTokenGuard:** Validación de refresh tokens

---

## 📚 Referencias

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Argon2 Specification](https://github.com/P-H-C/phc-winner-argon2)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 📞 Soporte

Para dudas o problemas con el módulo de autenticación, revisar:

1. Logs de la aplicación
2. Estado de Redis
3. Variables de entorno
4. Claves RSA en `/keys/jwt/`

---

**Última actualización:** 16 de octubre de 2025
**Versión:** 1.0.0
