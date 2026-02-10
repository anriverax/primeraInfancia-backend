import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { LoginCommand } from "../commands/login.command";
import { ILoginResponse } from "@/api/auth/application/dto/auth.type";
import { NotFoundException } from "@nestjs/common";
import { FindUniqueRolByEmailQuery } from "../queries/findUnique-rol-byEmail.query";
import { AuthDomainService } from "../../domain/services/authDomain.service";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService
  ) {}
  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { email, password } = command;

    const user = await this.queryBus.execute(new FindUniqueRolByEmailQuery(email));

    if (!user) {
      await this.authDomain.trackLoginAttempt(email, false);
      throw new NotFoundException("Credenciales incorrectas.");
    }

    const tokens = await this.authDomain.authenticate(email, password, user);
    return tokens;
  }
}
