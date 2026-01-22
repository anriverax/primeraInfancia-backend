import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { ILoginResponse } from "@/core/auth/dto/auth.type";
import { AuthService } from "@/core/auth/services/auth.service";
import { FindUniqueUserQuery } from "../../queries/user/find-unique-user.handler";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { GetByRolIdQuery } from "../../queries/role/get-by-rol-id.query";
import { TokenService } from "@/core/auth/services/token.service";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}
  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { value1, value2 } = command;

    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email: value1 }));
    if (!user) throw new NotFoundException("Credenciales incorrectas.");

    const isPasswordValid = await this.authService.comparePasswords(value2, user.passwd);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        "Credenciales incorrectas. Por favor, verifique su usuario y contraseña e intente nuevamente."
      );
    }
    const userPermissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));

    const result = await this.tokenService.generateTokens(user, userPermissions);

    return result;
  }
}
