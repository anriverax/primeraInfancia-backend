## Puertos vs Adapters vs Servicios - Visual

### 🎯 Definiciones Rápidas

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ARQUITECTURA HEXAGONAL                      │
└─────────────────────────────────────────────────────────────────────┘

CAPA EXTERNA (DETALLES)
├─── PRESENTATION (Express HTTP)
│    └─ AuthController
│       • Recibe requests HTTP
│       • Traduce a Commands/DTOs puros
│       • Llama Guards
│
├─── INFRASTRUCTURE (Adapters & Services)
│    ├─ Adapters/
│    │  ├─ ArgonPasswordHasher implements IPasswordHasher
│    │  ├─ JwtTokenGenerator implements ITokenGenerator
│    │  └─ PrismaUserRepository implements IUserRepository
│    │
│    └─ Services/ (Utilidades/Wrappers)
│       └─ (Servicios auxiliares, logging, etc)
│
└─── INFRASTRUCTURE PORTS (Interfaces que definen contratos)
     ├─ IPasswordHasher
     ├─ ITokenGenerator
     ├─ IUserRepository
     └─ IAccountSecurityPolicy

CAPA INTERNA (LÓGICA DE NEGOCIO)
├─── DOMAIN (Servicios de Dominio)
│    └─ AuthDomainService
│       • Lógica de negocio pura
│       • Depende SOLO de puertos (interfaces)
│       • NO importa @nestjs/common
│
├─── APPLICATION (CQRS)
│    ├─ Commands (puros, sin Express)
│    ├─ Queries (puros, sin Express)
│    └─ Handlers (usan puertos, no servicios concretos)
│
└─── DOMAIN GUARDS (Validación de entrada)
     └─ AuthenticatedRequestGuard
        • Valida request
        • Retorna datos enriquecidos y validados
```

---

### 🔄 Comparación: Flujos

#### ❌ **ANTES** (Acoplado)

```
Controller
    │
    ├─> Valida request aquí manualmente
    │
    ├─> Crea Command con Request dentro
    │   class ChangePasswdCommand {
    │     constructor(req: Request) {
    │       this.validateData(req)  ← Validación en command
    │     }
    │   }
    │
    ├─> Llama handler
    │
    ├─> Handler usa PasswordHashingService (concreto)
    │   authDomain.authenticate()
    │        └─> passwordHashingService.compare()  ← Acoplado
    │
    └─> Error: AuthDomainService usa @nestjs


PROBLEMAS:
❌ Express Request viaja por todo el código
❌ Validación duplicada en Commands/Queries
❌ Servicios concretos acoplados
❌ No reutilizable fuera de HTTP
```

---

#### ✅ **DESPUÉS** (Hexagonal)

```
Controller
    │
    ├─> @UseGuards(AuthenticatedRequestGuard)
    │   ✅ Guard valida y enriquece request
    │       req.authenticatedUser = { id, email, roleId, ... }
    │
    ├─> Extrae datos del request enriquecido
    │   const { id, email } = req.authenticatedUser
    │
    ├─> Crea Command PURO (sin Request)
    │   new ChangePasswdCommand(id, email, data)  ← Datos primitivos
    │
    ├─> Llama handler
    │
    ├─> Handler usa IPasswordHasher (interfaz)
    │   authDomain.authenticate()
    │        └─> passwordHasher.compare()  ← Depende de puerto
    │                 ↓
    │          ArgonPasswordHasher (adapter)
    │               └─ return argon.verify()
    │
    └─> AuthDomainService es puro, reutilizable


VENTAJAS:
✅ Express Request validado en un único lugar (Guard)
✅ Commands/Queries son puros, pueden venir de CLI/gRPC/eventos
✅ Lógica de negocio independiente de framework
✅ Fácil cambiar de Argon2 a bcrypt
✅ Código más testeable
```

---

### 📂 Estructura de Archivos Correcta

```
src/core/auth/
├── domain/
│   ├── ports/                              ← CONTRATOS (Interfaces)
│   │   ├── security/
│   │   │   ├── password-hasher.port.ts
│   │   │   ├── key-generator.port.ts
│   │   │   └── account-security.port.ts
│   │   ├── token/
│   │   │   └── token-generator.port.ts
│   │   └── persistence/
│   │       └── user.repository.port.ts
│   │
│   ├── guards/                             ← VALIDADORES DE ENTRADA
│   │   └── authenticated-request.guard.ts
│   │
│   ├── exceptions/                         ← EXCEPCIONES PURAS
│   │   ├── authentication-failed.exception.ts
│   │   ├── invalid-credentials.exception.ts
│   │   └── account-locked.exception.ts
│   │
│   └── services/                           ← LÓGICA DE NEGOCIO
│       ├── authDomain.service.ts           ← Usa puertos, NO framework
│       └── (otros servicios de dominio)
│
├── application/
│   ├── commands/                           ← CQRS - PUROS
│   │   ├── login/
│   │   │   ├── login.command.ts            ← Datos primitivos
│   │   │   └── login.handler.ts            ← Usa puertos
│   │   ├── create-user/
│   │   ├── changePasswd/
│   │   └── ...
│   │
│   ├── queries/
│   │   ├── find-user/
│   │   │   ├── find-user-by-id.query.ts    ← SIN Express
│   │   │   └── find-user-by-id.handler.ts
│   │   └── ...
│   │
│   ├── dto/
│   │   ├── auth.dto.ts
│   │   └── auth.type.ts
│   │
│   ├── projections/
│   │   └── user.projection.ts
│   │
│   └── services/
│       └── (servicios de aplicación, si los hay)
│
├── infrastructure/
│   ├── adapters/                           ← IMPLEMENTAN LOS PUERTOS
│   │   ├── argon-password-hasher.ts        ← Implementa IPasswordHasher
│   │   ├── jwt-token-generator.ts          ← Implementa ITokenGenerator
│   │   ├── prisma-user.repository.ts       ← Implementa IUserRepository
│   │   ├── crypto-key-generator.ts         ← Implementa IKeyGenerator
│   │   └── redis-security-policy.ts        ← Implementa IAccountSecurityPolicy
│   │
│   └── services/                           ← UTILIDADES AUXILIARES
│       ├── passwordHashing.service.ts      ← O mover a adapters
│       ├── key.service.ts                  ← O mover a adapters
│       └── tokenManagement.service.ts      ← O mover a adapters
│
└── presentation/
    ├── auth.controller.ts
    └── (otros controllers si hay)
```
---

### 📊 Tabla de Decisión

| Necesito...        | Tipo         | Ubicación                  | Patrón                                                        |
| ------------------ | ------------ | -------------------------- | ------------------------------------------------------------- |
| Abstraer de Argon2 | Puerto       | `domain/ports/security/`   | `interface IPasswordHasher`                                   |
| Usar Argon2        | Adapter      | `infrastructure/adapters/` | `class ArgonPasswordHasher implements IPasswordHasher`        |
| Autenticar usuario | Dominio      | `domain/services/`         | `class AuthDomainService { authenticate(...) }`               |
| Ejecutar login     | Comando      | `application/commands/`    | `class LoginCommand { }`                                      |
| Manejar login      | Aplicación   | `application/commands/`    | `class LoginHandler implements ICommandHandler<LoginCommand>` |
| Validar request    | Guard        | `domain/guards/`           | `@Injectable() class AuthenticatedRequestGuard`               |
| Exponer login HTTP | Presentación | `presentation/`            | `@Controller @Post("login")`                                  |

---

### 🚀 Checklist: Tu código está hexagonal cuando...

- [ ] `AuthDomainService` NO importa `@nestjs/common`
- [ ] `AuthDomainService` solo importa interfaces (puertos)
- [ ] `Commands` y `Queries` NO tienen Express `Request` como parámetro
- [ ] `Commands` y `Queries` solo tienen datos primitivos (string, number, objects puros)
- [ ] Existe una interfaz (`IPasswordHasher`) para cada adaptador
- [ ] Los adaptadores implementan las interfaces (`class Argon2... implements IPasswordHasher`)
- [ ] El `Module` inyecta adaptadores por interfaz: `{ provide: "IPasswordHasher", useClass: ArgonPasswordHasher }`
- [ ] El `Controller` usa `@UseGuards(AuthenticatedRequestGuard)` para validar
- [ ] El `Handlers` dependen de puertos, no de servicios concretos

Si cumples todo ✅, tu arquitectura es hexagonal.
