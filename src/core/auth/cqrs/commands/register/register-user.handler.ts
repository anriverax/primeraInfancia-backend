import { Command } from "@nestjs/cqrs";
import { IAuth } from "@/core/auth/dto/auth.type";

/**
 * Comando para registrar un nuevo usuario
 *
 * El DTO (AuthDto) valida formato/tipo de datos
 * Este Command valida invariantes del dominio:
 * - Email único
 * - DUI único
 * - Contraseña cumple con hash
 */
export class RegisterUserCommand extends Command<void> {
  constructor(public readonly data: IAuth) {
    super();
  }
}
