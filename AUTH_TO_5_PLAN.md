# 🎯 PLAN: Auth Module → 5.0/5

## Estado Actual

- **Score:** 4.0/5
- **Ubicación:** `src/core/auth/`

## Qué Falta para 5.0/5

### 1. ❌ Event Handlers Vacíos

**Problema:** `UserRegisteredHandler` y `PasswdChangedHandler` solo hacen `console.log`

**Solución:** Implementar side effects reales

- Actualizar read model
- Enviar notificaciones
- Registrar en audit log

### 2. ⚠️ Commands sin Validación

**Problema:** `RegisterUserCommand`, `VerifyEmailCommand`, `ChangePasswdCommand` no validan invariantes

**Solución:** Validación en constructor

- Validar email formato
- Validar contraseña requisitos
- Lanzar excepciones si inválido

### 3. ⚠️ Commands sin Tipos de Retorno

**Problema:** Commands heredan de `Command` sin especificar tipo genérico

**Solución:**

```typescript
// Antes ❌
export class RegisterUserCommand extends Command {}

// Después ✅
export class RegisterUserCommand extends Command<NestResponse<User>> {}
```

---

## Plan de Acción (3 fases)

### FASE 1: Mejorar Commands (1 hora)

- [ ] Agregar tipos de retorno explícitos
- [ ] Agregar validación en constructores
- [ ] Agregar JSDoc documentation

### FASE 2: Implementar Event Handlers (1.5 horas)

- [ ] UserRegisteredHandler con side effects reales
- [ ] PasswdChangedHandler con side effects reales
- [ ] Manejo de errores adecuado

### FASE 3: Validar Estructura (30 min)

- [ ] Verificar que compile sin errores
- [ ] Revisar que se cumplan principios CQRS
- [ ] Documentar

---

## Resultado Esperado

✅ Score: **5.0/5** 🎉

- ✅ Commands: 5/5 (tipos + validación)
- ✅ Queries: 4/5 (ya están bien)
- ✅ Projections: 4/5 (ya están bien)
- ✅ Event Handlers: 5/5 (implementados)
- ✅ Estructura: 5/5 (ya está bien)

---

## Archivos a Modificar

1. `src/core/auth/cqrs/commands/register/registerUser.command.ts`
2. `src/core/auth/cqrs/commands/verifyEmail/verifyEmail.command.ts`
3. `src/core/auth/cqrs/commands/changePasswd/changePasswd.handler.ts`
4. `src/core/auth/cqrs/events/registered/userRegistered.handler.ts`
5. `src/core/auth/cqrs/events/passwdChanged/passwdChanged.handler.ts`

---

¿Comenzamos?
