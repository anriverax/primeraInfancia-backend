import { AccessTokenGuard } from "@/common/guards/accessToken.guard";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";

// Constante que define la clave de metadatos utilizada para marcar rutas o controladores
// que no requieren autenticación.
export const AUTH_REQUIRED = "auth:isPrivate";

/**
 * Decorador personalizado `NoAuthRequired`.
 *
 * Este decorador marca rutas o controladores como públicos, es decir, exentos de autenticación.
 * Al aplicarlo, se establece un metadato con la clave `NO_AUTH_REQUIRED` y el valor `true`.
 * Esto puede ser interpretado por un guard o middleware para omitir la verificación de autenticación
 * en las rutas marcadas.
 *
 * ### Ejemplo de uso:
 *
 * ```typescript
 * @NoAuthRequired()
 * @Get('public-endpoint')
 * getPublicData() {
 *   return { message: "Este endpoint no requiere autenticación." };
 * }
 * ```
 *
 * En este caso, el endpoint `public-endpoint` será accesible sin autenticación.
 *
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types */
export const AuthRequired = () =>
  applyDecorators(SetMetadata(AUTH_REQUIRED, true), UseGuards(AccessTokenGuard));

/* eslint-enable @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types */
