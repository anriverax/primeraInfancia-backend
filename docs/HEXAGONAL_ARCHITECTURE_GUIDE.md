## Arquitectura Hexagonal - Puertos, Adapters y Servicios

### Conceptos Clave

#### 🎯 **Puerto (Port)** = Interfaz / Contrato

- **Ubicación**: `domain/ports/`
- **Propósito**: Define QUÉ se necesita (abstracción)
- **Dependencia**: NINGUNA (es puro)
- **Patrón**: Interface/Abstract Class
- **Cambio**: Si cambias de tecnología, cambias solo la implementación, no el puerto

**Ejemplo**:

```ts
// domain/ports/security/password-hasher.port.ts
export interface IPasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
}
```

---

#### 🔧 **Adaptador (Adapter)** = Implementación del Puerto

- **Ubicación**: `infrastructure/adapters/`
- **Propósito**: CÓMO se implementa (implementación específica)
- **Dependencia**: Importa el Puerto + las librerías específicas
- **Patrón**: Clase que implementa la interfaz del puerto
- **Cambio**: Si necesitas otra librería (ej: bcrypt en lugar de Argon2), creas un nuevo adapter

**Ejemplo**:

```ts
// infrastructure/adapters/argon-password-hasher.ts
@Injectable()
export class ArgonPasswordHasher implements IPasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return argon.hash(password); // ← Acoplado a Argon2
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return argon.verify(hashedPassword, password); // ← Acoplado a Argon2
  }
}
```

**Otro adapter con bcrypt**:

```ts
// infrastructure/adapters/bcrypt-password-hasher.ts
@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10); // ← Acoplado a bcrypt
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword); // ← Acoplado a bcrypt
  }
}
```

---

#### 🛠️ **Servicio de Infraestructura** = Utilidad/Wrapper

- **Ubicación**: `infrastructure/services/`
- **Propósito**: Servicios auxiliares, utilidades, wrappers
- **Dependencia**: Puede tener cualquier dependencia
- **Patrón**: Clase Injectable que proporciona funcionalidad
- **Nota**: En tu caso, los servicios de infraestructura SON los adaptadores (sin la abstracción del puerto)

**Ejemplo** (TUS servicios actuales):

```ts
// infrastructure/services/passwordHashing.service.ts
@Injectable()
export class PasswordHashingService {
  // ← Esto ES un adapter, pero sin puerto
  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return argon.verify(hashedPassword, password);
  }
}
```

---

### 🔄 Flujo en Hexagonal

```
┌─────────────────────────────────────────┐
│  PRESENTATION (Express/HTTP)            │
│  • auth.controller.ts                   │
│  • Traduce HTTP → Commands puros        │
└──────────────────┬──────────────────────┘
                   │ (Request → Command)
┌──────────────────▼──────────────────────┐
│  APPLICATION (CQRS)                     │
│  • Commands/Queries (PUROS)             │
│  • Handlers (usan QueryBus/CommandBus)  │
│  • Projections                          │
└──────────────────┬──────────────────────┘
                   │ (Dependen de Puertos)
┌──────────────────▼──────────────────────┐
│  DOMAIN (Business Logic)                │
│  • AuthDomainService                    │
│  • Interfaces (Puertos):                │
│    - IPasswordHasher                    │
│    - ITokenGenerator                    │
│    - IUserRepository                    │
│    - IAccountSecurityPolicy             │
│    - IKeyGenerator                      │
└──────────────────┬──────────────────────┘
                   │ (Dependen de interfaces)
┌──────────────────▼──────────────────────┐
│  INFRASTRUCTURE (Adapters)              │
│  • Implementan los Puertos:             │
│    - ArgonPasswordHasher                │
│    - JwtTokenGenerator                  │
│    - PrismaUserRepository               │
│    - RedisSecurityPolicy                │
│    - CryptoKeyGenerator                 │
└─────────────────────────────────────────┘
```

---

### 🎓 Ejemplo Real: Cambiar de Argon2 a bcrypt

#### Paso 1: Crear nuevo adapter

```ts
// infrastructure/adapters/bcrypt-password-hasher.ts
@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
```

#### Paso 2: Actualizar Module (inyección de dependencias)

```ts
// En lugar de:
{ provide: "IPasswordHasher", useClass: ArgonPasswordHasher }

// Cambias a:
{ provide: "IPasswordHasher", useClass: BcryptPasswordHasher }
```

#### Paso 3: Listo ✅

- `AuthDomainService` NO cambió
- `Handlers` NO cambiaron
- `Controllers` NO cambiaron
- Solo el adapter cambió

---

### 📋 Resumen de Ubicaciones

| Componente        | Ubicación                  | Importa                | NO Importa                  |
| ----------------- | -------------------------- | ---------------------- | --------------------------- |
| **Puerto**        | `domain/ports/`            | Nada                   | @nestjs, servicios          |
| **Dominio**       | `domain/services/`         | Puertos, Value Objects | @nestjs (salvo excepciones) |
| **Guard**         | `domain/guards/`           | Express Request        | Lógica de negocio           |
| **Command/Query** | `application/`             | DTOs puros             | Express Request             |
| **Handler**       | `application/`             | Puertos, QueryBus      | Servicios concretos         |
| **Adapter**       | `infrastructure/adapters/` | Puerto + librería      | Otros adapters              |
| **Service**       | `infrastructure/services/` | Lo que necesite        | Nada (utilidad)             |
| **Controller**    | `presentation/`            | Commands, Guards       | Lógica de negocio           |

---

### ✨ En Tu Caso: Los servicios que tienes SON adapters

Tu estructura actual:

```
infrastructure/services/
  ├── PasswordHashingService    ← Adapter de Argon2
  ├── KeyService               ← Adapter de Crypto
  └── TokenManagementService   ← Adapter de JWT
```

Solo necesitas:

1. **Crear puertos** que las interfaces implementen
2. **Mover a adapters/** con el mismo nombre (opcional)
3. **Actualizar imports** para usar puertos en lugar de servicios concretos
4. **Inyectar por interfaz** en el module

Así tu arquitectura será 100% hexagonal.
