import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";
import { ChangePasswdCommand } from "../commands/change-passwd.command";
import { UserProjection } from "../projections/user.projection";
import { FindUniqueUserByIdQuery } from "../queries/findUnique-user-byId.query";
import { AuthDomainService } from "../../domain/services/authDomain.service";

@CommandHandler(ChangePasswdCommand)
export class ChangePasswdHandler implements ICommandHandler<ChangePasswdCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userProjection: UserProjection,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly authDomain: AuthDomainService
  ) {}

  async execute(command: ChangePasswdCommand): Promise<boolean> {
    const { userId, email, data } = command;

    const newEmail: string = data.value1;
    const oldPassword: string = data.value2;
    const newPassword: string = data.value3;

    const user = await this.queryBus.execute(new FindUniqueUserByIdQuery({ email }));

    const result = this.errorHandlingService.requireNotNull(user, "Usuario no encontrado.");

    const newHashedPassword = await this.authDomain.changePassword(
      oldPassword,
      newPassword,
      result.passwd
    );

    // Actualizar contraseña en BD (Write Model)
    await this.userProjection.update(userId, {
      passwd: newHashedPassword,
      isVerified: true,
      email: newEmail
    });

    return true;
  }
}
