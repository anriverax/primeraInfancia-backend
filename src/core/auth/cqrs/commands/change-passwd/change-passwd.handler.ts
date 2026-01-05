import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserProjection } from "../../projections/user.projection";
import { NestResponse } from "@/common/helpers/types";
import { ChangePasswdCommand } from "./change-passwd.command";

@CommandHandler(ChangePasswdCommand)
export class ChangePasswdHandler implements ICommandHandler<ChangePasswdCommand> {
  constructor(private readonly userProjection: UserProjection) {}

  /**
   * Ejecuta el cambio de contraseña
   *
   * Invariantes validados por el Controller:
   * - Usuario existe
   * - Contraseña anterior es correcta
   * - Nueva contraseña es diferente
   */
  async execute(command: ChangePasswdCommand): Promise<NestResponse<void>> {
    const { data } = command;

    // Actualizar contraseña en BD (Write Model)
    await this.userProjection.updatePasswdIsVerified({
      id: data.id,
      email: data.oldEmail,
      data: { passwd: data.hashedPassword, isVerified: true, email: data.newEmail }
    });

    return {
      statusCode: 200,
      message: "¡Tu perfil está listo!"
    };
  }
}
