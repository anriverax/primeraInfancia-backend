import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { ILoginResponse } from "@/core/auth/dto/auth.type";
import { AuthService } from "@/core/auth/services/auth.service";
import { FindUniqueUserQuery } from "../../queries/find-user-by-id.handler";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { GetByRolIdQuery } from "../../queries/role/get-by-rol-id.query";
import { TokenService } from "@/core/auth/services/tokenManagement.service";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}
  async execute(command: LoginCommand): Promise<ILoginResponse> {
    const { value1, value2 } = command;

    const isLocked = await this.authService.isAccountLocked(value1);
    if (isLocked) {
      throw new UnauthorizedException(
        "Cuenta bloqueada. Se han detectado múltiples intentos fallidos. Por favor, intente más tarde."
      );
    }

    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email: value1 }));
    if (!user) {
      await this.authService.trackLoginAttempt(value1, false);
      throw new NotFoundException("Credenciales incorrectas.");
    }

    const isPasswordValid = await this.authService.comparePasswords(value2, user.passwd);

    if (!isPasswordValid) {
      await this.authService.trackLoginAttempt(value1, false);
      throw new UnauthorizedException(
        "Credenciales incorrectas. Por favor, verifique su usuario y contraseña e intente nuevamente."
      );
    }

    await this.authService.trackLoginAttempt(value1, true);

    const userPermissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));

    const result = await this.tokenService.generateTokens(user, userPermissions);

    return result;
  }
}
