import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UserProjection } from "../../projections/user.projection";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { FindUserByIdQuery } from "../../queries/find-user/find-user-by-id.query";
import { ChangePasswdCommand } from "./change-passwd.command";
import { AuthDomainService } from "../../services/authDomain.service";

@CommandHandler(ChangePasswdCommand)
export class ChangePasswdHandler implements ICommandHandler<ChangePasswdCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userProjection: UserProjection,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly authDomain: AuthDomainService
  ) {}

  async execute(command: ChangePasswdCommand): Promise<boolean> {
    const { userId, oldEmail, oldPassword, newPassword, newEmail } = command;

    const user = await this.queryBus.execute(new FindUserByIdQuery({ email: oldEmail }));

    const result = this.errorHandlingService.requireNotNull(user, "Usuario no encontrado.");

    const newHashedPassword = await this.authDomain.changePassword(
      oldPassword,
      newPassword,
      result.passwd
    );

    // Actualizar contraseña en BD (Write Model)
    await this.userProjection.updatePasswdIsVerified({
      id: userId,
      email: oldEmail,
      data: { passwd: newHashedPassword, isVerified: true, email: newEmail }
    });

    return true;
  }
}
