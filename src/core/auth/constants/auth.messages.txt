/**
 * Mensajes de respuesta estandarizados para el módulo de autenticación
 *
 * Estos mensajes están separados de las constantes para facilitar
 * la internacionalización (i18n) en el futuro
 */

export const AUTH_MESSAGES = {
  // ============================================
  // MENSAJES DE ÉXITO
  // ============================================

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
  SESSION_REVOKED: "Sesión revocada exitosamente.",
  ALL_SESSIONS_REVOKED: "Todas las sesiones han sido revocadas.",

  // ============================================
  // ERRORES DE AUTENTICACIÓN
  // ============================================

  ERROR_INVALID_CREDENTIALS:
    "Credenciales incorrectas. Por favor, verifique su usuario y contraseña e intente nuevamente.",
  ERROR_USER_NOT_FOUND: "El usuario no existe en el sistema.",
  ERROR_USER_NOT_AUTHENTICATED: "Usuario no autenticado.",
  ERROR_UNAUTHORIZED: "No autorizado.",
  ERROR_FORBIDDEN: "No tienes permisos suficientes para realizar esta acción.",
  ERROR_ACCESS_DENIED: "Acceso denegado.",
  ERROR_PERMISSION_REQUIRED: "Se requiere el permiso: {permission}",

  // ============================================
  // ERRORES DE CUENTA
  // ============================================

  ERROR_ACCOUNT_LOCKED:
    "Cuenta bloqueada por múltiples intentos fallidos. Intenta en {minutes} minutos.",
  ERROR_ACCOUNT_LOCKED_DEFAULT: "Cuenta bloqueada por múltiples intentos fallidos. Intenta más tarde.",
  ERROR_ACCOUNT_NOT_VERIFIED: "Debes verificar tu correo electrónico antes de continuar.",
  ERROR_ACCOUNT_DISABLED: "Esta cuenta ha sido deshabilitada. Contacta al administrador.",
  ERROR_ACCOUNT_SUSPENDED: "Esta cuenta ha sido suspendida. Contacta al administrador.",
  ERROR_EMAIL_ALREADY_EXISTS: "Este correo electrónico ya está asociado a una cuenta.",
  ERROR_EMAIL_ALREADY_VERIFIED: "Este correo electrónico ya ha sido verificado.",
  ERROR_EMAIL_NOT_VERIFIED: "El correo electrónico no ha sido verificado.",
  ERROR_DUI_ALREADY_EXISTS: "Este DUI ya está asociado a una cuenta.",

  // ============================================
  // ERRORES DE TOKENS
  // ============================================

  ERROR_INVALID_TOKEN:
    "El token de sesión es inválido o ha expirado. Por favor, inicie sesión nuevamente.",
  ERROR_INVALID_ACCESS_TOKEN: "Token de acceso inválido o expirado.",
  ERROR_INVALID_REFRESH_TOKEN:
    "El token de sesión es inválido o ha expirado. Por favor, inicie sesión nuevamente.",
  ERROR_TOKEN_EXPIRED: "La sesión ha expirado. Por favor, inicie sesión nuevamente.",
  ERROR_TOKEN_REVOKED: "La sesión ha sido revocada. Por favor, inicie sesión nuevamente.",
  ERROR_TOKEN_NOT_FOUND: "Token no encontrado.",
  ERROR_TOKEN_MISMATCH: "El token no coincide con el almacenado.",
  ERROR_MISSING_TOKEN: "Token de autorización requerido.",
  ERROR_MALFORMED_TOKEN: "Token mal formado.",

  // ============================================
  // ERRORES DE VERIFICACIÓN
  // ============================================

  ERROR_INVALID_VERIFICATION_CODE: "El código de verificación es incorrecto o ha expirado.",
  ERROR_VERIFICATION_CODE_EXPIRED: "El código de verificación ha expirado. Solicita uno nuevo.",
  ERROR_NO_VERIFICATION_PENDING: "No hay ninguna verificación pendiente.",
  ERROR_VERIFICATION_ALREADY_COMPLETED: "La verificación ya ha sido completada.",
  ERROR_TOO_MANY_VERIFICATION_ATTEMPTS: "Demasiados intentos de verificación. Solicita un nuevo código.",

  // ============================================
  // ERRORES DE CONTRASEÑA
  // ============================================

  ERROR_WEAK_PASSWORD:
    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
  ERROR_PASSWORD_MISMATCH: "Las contraseñas no coinciden.",
  ERROR_SAME_PASSWORD: "La nueva contraseña debe ser diferente a la anterior.",
  ERROR_INVALID_OLD_PASSWORD: "La contraseña actual es incorrecta.",
  ERROR_PASSWORD_REQUIRED: "La contraseña es requerida.",
  ERROR_PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",
  ERROR_PASSWORD_TOO_LONG: "La contraseña no debe exceder 128 caracteres.",
  ERROR_PASSWORD_RECENTLY_USED: "Esta contraseña ha sido utilizada recientemente. Elige una diferente.",

  // ============================================
  // ERRORES DE 2FA
  // ============================================

  ERROR_INVALID_2FA_TOKEN: "Código de autenticación de dos factores inválido.",
  ERROR_2FA_NOT_ENABLED: "La autenticación de dos factores no está habilitada.",
  ERROR_2FA_ALREADY_ENABLED: "La autenticación de dos factores ya está habilitada.",
  ERROR_2FA_REQUIRED: "Se requiere autenticación de dos factores.",
  ERROR_2FA_SETUP_INCOMPLETE: "La configuración de 2FA está incompleta.",

  // ============================================
  // ERRORES DE SISTEMA
  // ============================================

  ERROR_EMAIL_SEND_FAILED:
    "Error al enviar el correo electrónico. Por favor, inténtelo nuevamente más tarde.",
  ERROR_DATABASE_ERROR: "Se ha producido un error al procesar su solicitud.",
  ERROR_REDIS_ERROR: "Error de conexión con el servicio de sesiones.",
  ERROR_INTERNAL_SERVER_ERROR: "Error interno del servidor. Por favor, contacte al administrador.",
  ERROR_SERVICE_UNAVAILABLE: "Servicio no disponible temporalmente. Intenta más tarde.",
  ERROR_RATE_LIMIT_EXCEEDED:
    "Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.",

  // ============================================
  // ERRORES DE VALIDACIÓN
  // ============================================

  ERROR_INVALID_EMAIL: "El formato del correo electrónico no es válido.",
  ERROR_INVALID_DUI: "El formato del DUI no es válido (debe ser: 12345678-9).",
  ERROR_INVALID_PHONE:
    "El formato del teléfono no es válido (debe ser: 2XXX-XXXX, 6XXX-XXXX o 7XXX-XXXX).",
  ERROR_REQUIRED_FIELD: "Este campo es requerido.",
  ERROR_INVALID_DATA: "Los datos proporcionados no son válidos.",
  ERROR_VALIDATION_FAILED: "La validación de datos ha fallado.",

  // ============================================
  // MENSAJES INFORMATIVOS
  // ============================================

  INFO_CHECK_EMAIL: "Revisa tu correo electrónico para continuar.",
  INFO_LOGIN_REQUIRED: "Debes iniciar sesión para continuar.",
  INFO_SESSION_ABOUT_TO_EXPIRE: "Tu sesión está por expirar. Guarda tu trabajo.",
  INFO_NEW_DEVICE_DETECTED: "Se ha detectado un inicio de sesión desde un nuevo dispositivo.",
  INFO_PASSWORD_STRENGTH_WEAK: "Contraseña débil. Se recomienda usar una más segura.",
  INFO_PASSWORD_STRENGTH_MEDIUM: "Contraseña de seguridad media.",
  INFO_PASSWORD_STRENGTH_STRONG: "Contraseña segura."
} as const;

/**
 * Helper para formatear mensajes con parámetros
 */
export function formatMessage(template: string, params: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() ?? match;
  });
}

/**
 * Ejemplos de uso:
 *
 * formatMessage(AUTH_MESSAGES.ERROR_PERMISSION_REQUIRED, { permission: 'users.delete' })
 * // "Se requiere el permiso: users.delete"
 *
 * formatMessage(AUTH_MESSAGES.ERROR_ACCOUNT_LOCKED, { minutes: 15 })
 * // "Cuenta bloqueada por múltiples intentos fallidos. Intenta en 15 minutos."
 */
