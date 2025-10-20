/**
 * Constantes de Autenticación
 *
 * Este archivo centraliza todas las constantes relacionadas con el módulo de autenticación
 */

/**
 * Configuración de tokens y sesiones
 */
export const AUTH_CONSTANTS = {
  /** Tiempo de vida del access token en segundos (15 minutos) */
  ACCESS_TOKEN_TTL: 15 * 60,

  /** Tiempo de vida del refresh token en segundos (7 días) */
  REFRESH_TOKEN_TTL: 7 * 24 * 60 * 60,

  /** Tiempo de vida del código de verificación de email en segundos (3 días) */
  VERIFY_CODE_TTL: 3 * 24 * 60 * 60,

  /** Tiempo de vida del token de reset de contraseña en segundos (1 hora) */
  PASSWORD_RESET_TTL: 60 * 60,

  /** Número máximo de intentos de login fallidos antes de bloquear */
  MAX_LOGIN_ATTEMPTS: 5,

  /** Duración del bloqueo de cuenta en segundos (15 minutos) */
  LOCKOUT_DURATION: 15 * 60,

  /** Tamaño de la clave RSA en bits */
  RSA_KEY_SIZE: 2048,

  /** Longitud del código de verificación */
  VERIFICATION_CODE_LENGTH: 6,

  /** Algoritmo de firma para access tokens */
  ACCESS_TOKEN_ALGORITHM: "RS256",

  /** Algoritmo de firma para refresh tokens */
  REFRESH_TOKEN_ALGORITHM: "HS256"
} as const;

/**
 * Funciones helper para generar claves de Redis
 */
export const REDIS_KEYS = {
  /**
   * Clave para almacenar el estado de un access token
   * @param tokenId - UUID del token
   * @returns Clave Redis: "auth:access:{tokenId}"
   */
  accessToken: (tokenId: string) => `auth:access:${tokenId}`,

  /**
   * Clave para almacenar un refresh token
   * @param userId - ID del usuario
   * @returns Clave Redis: "auth:refresh:{userId}"
   */
  refreshToken: (userId: number) => `auth:refresh:${userId}`,

  /**
   * Clave para almacenar múltiples refresh tokens (multi-device)
   * @param userId - ID del usuario
   * @param deviceId - ID del dispositivo
   * @returns Clave Redis: "auth:refresh:{userId}:{deviceId}"
   */
  refreshTokenMultiDevice: (userId: number, deviceId: string) => `auth:refresh:${userId}:${deviceId}`,

  /**
   * Clave para almacenar el código de verificación de email
   * @param userId - ID del usuario
   * @returns Clave Redis: "verifyEmailCode:{userId}"
   */
  verifyCode: (userId: number) => `verifyEmailCode:${userId}`,

  /**
   * Clave para almacenar el token de reset de contraseña
   * @param token - UUID del token
   * @returns Clave Redis: "password:reset:{token}"
   */
  passwordResetToken: (token: string) => `password:reset:${token}`,

  /**
   * Clave para contar intentos de login fallidos
   * @param email - Email del usuario
   * @returns Clave Redis: "login:attempts:{email}"
   */
  loginAttempts: (email: string) => `login:attempts:${email}`,

  /**
   * Clave para marcar una cuenta como bloqueada
   * @param email - Email del usuario
   * @returns Clave Redis: "login:locked:{email}"
   */
  loginLocked: (email: string) => `login:locked:${email}`,

  /**
   * Clave para cachear permisos de un rol
   * @param roleId - ID del rol
   * @returns Clave Redis: "permissions:role:{roleId}"
   */
  rolePermissions: (roleId: number) => `permissions:role:${roleId}`,

  /**
   * Clave para almacenar configuración 2FA pendiente
   * @param userId - ID del usuario
   * @returns Clave Redis: "2fa:pending:{userId}"
   */
  twoFactorPending: (userId: number) => `2fa:pending:${userId}`
} as const;

/**
 * Mensajes de respuesta estandarizados
 */
export const AUTH_MESSAGES = {
  // Mensajes de éxito
  LOGIN_SUCCESS: "Inicio de sesión exitoso.",
  LOGOUT_SUCCESS: "Ha cerrado sesión correctamente.",
  REGISTER_SUCCESS: "Registro exitoso. Revisa tu email para verificar tu cuenta.",
  REFRESH_TOKEN_SUCCESS: "Token de actualización generado exitosamente.",
  EMAIL_VERIFICATION_SENT: "Se ha enviado un código de verificación a tu correo.",
  EMAIL_VERIFIED_SUCCESS: "Email verificado exitosamente.",
  PASSWORD_CHANGED_SUCCESS: "Contraseña cambiada exitosamente.",
  PASSWORD_RESET_SENT: "Si el email existe, recibirás instrucciones para resetear tu contraseña.",
  PASSWORD_RESET_SUCCESS: "Contraseña restablecida exitosamente.",
  TWO_FACTOR_ENABLED: "Autenticación de dos factores habilitada.",
  TWO_FACTOR_DISABLED: "Autenticación de dos factores deshabilitada.",

  // Mensajes de error - Autenticación
  ERROR_INVALID_CREDENTIALS:
    "Credenciales incorrectas. Por favor, verifique su usuario y contraseña e intente nuevamente.",
  ERROR_USER_NOT_FOUND: "El usuario no existe en el sistema.",
  ERROR_USER_NOT_AUTHENTICATED: "Usuario no autenticado.",
  ERROR_UNAUTHORIZED: "No autorizado.",
  ERROR_FORBIDDEN: "No tienes permisos suficientes para realizar esta acción.",

  // Mensajes de error - Cuenta
  ERROR_ACCOUNT_LOCKED: "Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos.",
  ERROR_ACCOUNT_NOT_VERIFIED: "Debes verificar tu correo electrónico antes de continuar.",
  ERROR_EMAIL_ALREADY_EXISTS: "Este correo electrónico ya está asociado a una cuenta.",
  ERROR_EMAIL_ALREADY_VERIFIED: "Este correo electrónico ya ha sido verificado.",

  // Mensajes de error - Tokens
  ERROR_INVALID_TOKEN:
    "El token de sesión es inválido o ha expirado. Por favor, inicie sesión nuevamente.",
  ERROR_INVALID_ACCESS_TOKEN: "Token de acceso inválido o expirado.",
  ERROR_INVALID_REFRESH_TOKEN:
    "El token de sesión es inválido o ha expirado. Por favor, inicie sesión nuevamente.",
  ERROR_TOKEN_EXPIRED: "La sesión ha expirado. Por favor, inicie sesión nuevamente.",
  ERROR_TOKEN_REVOKED: "La sesión ha sido revocada. Por favor, inicie sesión nuevamente.",

  // Mensajes de error - Verificación
  ERROR_INVALID_VERIFICATION_CODE: "El código de verificación es incorrecto o ha expirado.",
  ERROR_VERIFICATION_CODE_EXPIRED: "El código de verificación ha expirado. Solicita uno nuevo.",
  ERROR_NO_VERIFICATION_PENDING: "No hay ninguna verificación pendiente.",

  // Mensajes de error - Contraseña
  ERROR_WEAK_PASSWORD:
    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
  ERROR_PASSWORD_MISMATCH: "Las contraseñas no coinciden.",
  ERROR_SAME_PASSWORD: "La nueva contraseña debe ser diferente a la anterior.",
  ERROR_INVALID_OLD_PASSWORD: "La contraseña actual es incorrecta.",

  // Mensajes de error - 2FA
  ERROR_INVALID_2FA_TOKEN: "Código de autenticación de dos factores inválido.",
  ERROR_2FA_NOT_ENABLED: "La autenticación de dos factores no está habilitada.",
  ERROR_2FA_ALREADY_ENABLED: "La autenticación de dos factores ya está habilitada.",

  // Mensajes de error - Sistema
  ERROR_EMAIL_SEND_FAILED:
    "Error al enviar el correo electrónico. Por favor, inténtelo nuevamente más tarde.",
  ERROR_DATABASE_ERROR: "Se ha producido un error al procesar su solicitud.",
  ERROR_REDIS_ERROR: "Error de conexión con el servicio de sesiones.",
  ERROR_INTERNAL_SERVER_ERROR: "Error interno del servidor. Por favor, contacte al administrador."
} as const;

/**
 * Patrones de validación comunes
 */
export const VALIDATION_PATTERNS = {
  /** Patrón para DUI de El Salvador: 12345678-9 */
  DUI: /^\d{8}-\d{1}$/,

  /** Patrón para teléfono de El Salvador: 2xxx-xxxx, 6xxx-xxxx, 7xxx-xxxx */
  PHONE_NUMBER: /^(2|6|7)\d{3}-\d{4}$/,

  /** Patrón para email */
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  /** Patrón para contraseña fuerte */
  STRONG_PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/
} as const;

/**
 * Configuración de Argon2 para hashing de contraseñas
 */
export const ARGON2_CONFIG = {
  /** Tipo de Argon2 (más seguro) */
  type: 2, // argon2id

  /** Memoria en KB (64 MB) */
  memoryCost: 65536,

  /** Número de iteraciones */
  timeCost: 3,

  /** Grado de paralelismo */
  parallelism: 4
} as const;

/**
 * Configuración de rate limiting
 */
export const RATE_LIMIT_CONFIG = {
  /** Rate limit para login: 5 intentos por minuto */
  LOGIN: {
    limit: 5,
    ttl: 60000 // 1 minuto en ms
  },

  /** Rate limit para registro: 3 intentos por hora */
  REGISTER: {
    limit: 3,
    ttl: 3600000 // 1 hora en ms
  },

  /** Rate limit para refresh token: 10 intentos por minuto */
  REFRESH_TOKEN: {
    limit: 10,
    ttl: 60000
  },

  /** Rate limit para forgot password: 3 intentos por hora */
  FORGOT_PASSWORD: {
    limit: 3,
    ttl: 3600000
  },

  /** Rate limit para verify email: 5 intentos por hora */
  VERIFY_EMAIL: {
    limit: 5,
    ttl: 3600000
  },

  /** Rate limit por defecto: 100 intentos por minuto */
  DEFAULT: {
    limit: 100,
    ttl: 60000
  }
} as const;

/**
 * Configuración de caché
 */
export const CACHE_CONFIG = {
  /** TTL del caché de permisos (1 hora) */
  PERMISSIONS_TTL: 60 * 60,

  /** TTL del caché de usuario (30 minutos) */
  USER_TTL: 30 * 60,

  /** TTL del caché de roles (1 hora) */
  ROLES_TTL: 60 * 60
} as const;

/**
 * Roles del sistema
 */
export enum UserRole {
  ADMIN = "admin",
  MODERATOR = "moderator",
  MENTOR = "mentor",
  COORDINATOR = "coordinator",
  USER = "user"
}

/**
 * Permisos del sistema
 */
export enum Permission {
  // Usuarios
  USERS_READ = "users.read",
  USERS_CREATE = "users.create",
  USERS_UPDATE = "users.update",
  USERS_DELETE = "users.delete",

  // Roles
  ROLES_READ = "roles.read",
  ROLES_CREATE = "roles.create",
  ROLES_UPDATE = "roles.update",
  ROLES_DELETE = "roles.delete",

  // Permisos
  PERMISSIONS_READ = "permissions.read",
  PERMISSIONS_CREATE = "permissions.create",
  PERMISSIONS_UPDATE = "permissions.update",
  PERMISSIONS_DELETE = "permissions.delete",

  // Dashboard
  DASHBOARD_READ = "dashboard.read",

  // Reportes
  REPORTS_READ = "reports.read",
  REPORTS_EXPORT = "reports.export",

  // Configuración
  SETTINGS_READ = "settings.read",
  SETTINGS_UPDATE = "settings.update"
}

/**
 * Tipos de acciones auditadas
 */
export enum AuditAction {
  // Autenticación
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  LOGIN_FAILED = "LOGIN_FAILED",
  REGISTER = "REGISTER",

  // Tokens
  TOKEN_REFRESH = "TOKEN_REFRESH",
  TOKEN_REVOKED = "TOKEN_REVOKED",

  // Cuenta
  EMAIL_VERIFY = "EMAIL_VERIFY",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  PASSWORD_RESET = "PASSWORD_RESET",

  // 2FA
  TWO_FACTOR_ENABLED = "TWO_FACTOR_ENABLED",
  TWO_FACTOR_DISABLED = "TWO_FACTOR_DISABLED",

  // Usuario
  USER_CREATE = "USER_CREATE",
  USER_UPDATE = "USER_UPDATE",
  USER_DELETE = "USER_DELETE",

  // Roles y permisos
  ROLE_CREATE = "ROLE_CREATE",
  ROLE_UPDATE = "ROLE_UPDATE",
  ROLE_DELETE = "ROLE_DELETE",
  PERMISSION_GRANT = "PERMISSION_GRANT",
  PERMISSION_REVOKE = "PERMISSION_REVOKE"
}

/**
 * Estados de sesión
 */
export enum SessionStatus {
  VALID = "valid",
  EXPIRED = "expired",
  REVOKED = "revoked",
  LOCKED = "locked"
}

/**
 * Tipos de dispositivos
 */
export enum DeviceType {
  WEB = "web",
  MOBILE = "mobile",
  TABLET = "tablet",
  DESKTOP = "desktop",
  UNKNOWN = "unknown"
}

/**
 * Helper para obtener el tipo de dispositivo desde el user agent
 */
export function getDeviceType(userAgent: string): DeviceType {
  if (!userAgent) return DeviceType.UNKNOWN;

  const ua = userAgent.toLowerCase();

  if (ua.includes("mobile")) return DeviceType.MOBILE;
  if (ua.includes("tablet") || ua.includes("ipad")) return DeviceType.TABLET;
  if (ua.includes("electron")) return DeviceType.DESKTOP;

  return DeviceType.WEB;
}

/**
 * Helper para validar formato de email
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email);
}

/**
 * Helper para validar formato de DUI
 */
export function isValidDUI(dui: string): boolean {
  return VALIDATION_PATTERNS.DUI.test(dui);
}

/**
 * Helper para validar formato de teléfono
 */
export function isValidPhoneNumber(phone: string): boolean {
  return VALIDATION_PATTERNS.PHONE_NUMBER.test(phone);
}

/**
 * Helper para validar contraseña fuerte
 */
export function isStrongPassword(password: string): boolean {
  return VALIDATION_PATTERNS.STRONG_PASSWORD.test(password);
}

/**
 * Helper para sanitizar email (lowercase, trim)
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Helper para generar un código alfanumérico aleatorio
 */
export function generateRandomCode(length: number = AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Helper para generar un código numérico aleatorio
 */
export function generateNumericCode(length: number = 6): string {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
