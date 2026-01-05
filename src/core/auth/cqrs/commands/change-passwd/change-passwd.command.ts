import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { IUser } from "@/core/auth/dto/auth.type";

interface IChangePasswd extends Pick<IUser, "id"> {
  oldEmail: string;
  newEmail: string;
  hashedPassword: string;
}

/**
 * Comando para cambiar la contraseña del usuario
 *
 * El DTO (ChangePasswdDto) valida formato de datos
 * El Controller valida:
 * - Usuario autenticado
 * - Nueva contraseña diferente a la anterior
 * - Contraseña actual correcta
 *
 * Este Command encapsula la intención de cambiar contraseña
 */
export class ChangePasswdCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IChangePasswd) {
    super();
  }
}
