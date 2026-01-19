import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Get
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { AuthService } from "./services/auth.service";
import { AuthDto, ChangePasswdDto, LoginDto } from "./dto/auth.dto";
import { ILoginResponse } from "./dto/auth.type";
import { NestResponse } from "@/common/helpers/types";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { TokenService } from "./services/token.service";
import { RefreshTokenGuard } from "@/common/guards/refreshToken.guard";
import { GetByRolIdQuery } from "./cqrs/queries/role/get-by-rol-id.query";
import { GetAllPermissionQuery } from "./cqrs/queries/menuPermission/get-all-permission.query";
import { ChangePasswdCommand } from "./cqrs/commands/change-passwd/change-passwd.command";
import { RegisterUserCommand } from "./cqrs/commands/register/register-user.handler";
import { FindUniqueUserQuery } from "./cqrs/queries/user/find-unique-user.handler";

@Controller()
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @Post("register")
  async register(@Body() data: AuthDto): Promise<NestResponse<void>> {
    await this.commandBus.execute(new RegisterUserCommand(data));

    return {
      statusCode: 200,
      message:
        "Registro exitoso. Se ha enviado un correo de verificación a su dirección de correo electrónico. Por favor, revise su bandeja de entrada y siga las instrucciones para completar el proceso."
    };
  }

  @AuthRequired()
  @Get("route-permissions")
  async getRoutePermissions(): Promise<NestResponse<Record<string, string[]>>> {
    const map = await this.queryBus.execute(new GetAllPermissionQuery());

    return {
      statusCode: 200,
      message: "Mapa de permisos por ruta",
      data: map
    };
  }

  @Post("login")
  async login(@Body() data: LoginDto): Promise<NestResponse<ILoginResponse>> {
    const { value1, value2 } = data;

    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email: value1 }));
    if (!user) throw new NotFoundException("Credenciales incorrectas.");

    await this.authService.verifyPasswd(user.passwd, value2);
    const userPermissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));

    const result = await this.tokenService.generateTokens(user, userPermissions);

    return {
      statusCode: 200,
      message: "Inicio de sesión exitoso.",
      data: result
    };
  }

  @Post("refresh-token")
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: Request): Promise<NestResponse<ILoginResponse>> {
    const { email } = req["user"] as { email: string; sub: number; role: string };

    const accessToken = await this.tokenService.refreshToken(req);

    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email }));
    if (!user) throw new NotFoundException("El usuario no existe en el sistema.");

    const userPermissions = await this.queryBus.execute(new GetByRolIdQuery(user.roleId));

    const data = this.authService.getData(accessToken, req["token"], user, userPermissions);

    return {
      statusCode: 200,
      message: "Token de actualización generado exitosamente.",
      data
    };
  }

  @AuthRequired()
  @Post("change-password")
  async changePassword(@Req() req: Request, @Body() data: ChangePasswdDto): Promise<NestResponse<void>> {
    if (!req["user"]) throw new UnauthorizedException("Usuario no autenticado.");

    const { id, email } = req["user"] as { id: number; email: string; sub: number; role: string };

    const isExist = await this.queryBus.execute(new FindUniqueUserQuery({ id, email }));

    if (!isExist) {
      return {
        statusCode: 404,
        message: "El usuario no existe en el sistema."
      };
    }
    const isTheSamePassword = await this.authService.comparePasswords(data.value3, isExist.passwd);

    if (isTheSamePassword)
      throw new UnauthorizedException("La nueva contraseña no puede ser igual a la anterior.");

    await this.authService.verifyPasswd(isExist.passwd, data.value2);

    const hashedPassword = await this.authService.hashPassword(data.value3);

    return this.commandBus.execute(
      new ChangePasswdCommand({
        id: isExist.id,
        oldEmail: email,
        newEmail: data.value1.trim().toLowerCase(),
        hashedPassword
      })
    );
  }

  @AuthRequired()
  @Post("logout")
  async logout(@Req() req: Request): Promise<NestResponse<void>> {
    if (!req["user"]) throw new UnauthorizedException("Usuario no autenticado.");

    const { sub } = req["user"] as { sub: number; email: string; role: string };

    const isOk = await this.authService.logout(sub, req["token"]);

    if (!isOk)
      throw new UnauthorizedException("Error al cerrar sesión. Por favor, inténtelo nuevamente.");

    return {
      statusCode: 200,
      message: "Ha cerrado sesión correctamente."
    };
  }
}
