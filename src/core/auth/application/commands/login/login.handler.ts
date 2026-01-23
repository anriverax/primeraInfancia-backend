import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { ILoginResponse } from "@/core/auth/application/dto/auth.type";
import { NotFoundException } from "@nestjs/common";
import { AuthDomainService } from "../../services/authDomain.service";
import { GetRolByIdQuery } from "../../queries/get-rol/get-rol-by-id.query";
import { FindUserByIdQuery } from "../../queries/find-user/find-user-by-id.query";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService
  ) {}
  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { value1, value2 } = command;

    const user = await this.queryBus.execute(new FindUserByIdQuery({ email: value1 }));
    if (!user) {
      await this.authDomain.trackLoginAttempt(value1, false);
      throw new NotFoundException("Credenciales incorrectas.");
    }

    const userPermissions = await this.queryBus.execute(new GetRolByIdQuery(user.roleId));

    const tokens = await this.authDomain.authenticate(value1, value2, user, userPermissions);
    return tokens;
  }
}
