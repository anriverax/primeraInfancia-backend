import { Body, Controller, Post, Req, UnauthorizedException, UseGuards, Get } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { AuthDto, ChangePasswdDto, LoginDto } from "../application/dto/auth.dto";
import { ILoginResponse } from "../application/dto/auth.type";
import { NestResponse } from "@/common/helpers/types";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { RefreshTokenGuard } from "@/common/guards/refreshToken.guard";
import { GetAllPermissionQuery } from "../application/queries/menu-permission/get-all-permission.query";
import { ChangePasswdCommand } from "../application/commands/change-passwd/change-passwd.command";
import { LoginCommand } from "../application/commands/login/login.command";
import { GetRefreshTokenQuery } from "../application/queries/refresh-token/refresh-token.query";
import { CreateUserCommand } from "../application/commands/create-user/create-user.command";
import { AuthDomainService } from "../application/services/authDomain.service";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly authDomainService: AuthDomainService
  ) {}

  @Post("register")
  async register(@Body() data: AuthDto): Promise<NestResponse<void>> {
    await this.commandBus.execute(new CreateUserCommand(data));

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
    const result = await this.commandBus.execute(new LoginCommand(data.value1, data.value2));

    return {
      statusCode: 200,
      message: "Inicio de sesión exitoso.",
      data: result
    };
  }

  @Post("refresh-token")
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: Request): Promise<NestResponse<ILoginResponse>> {
    const data = await this.queryBus.execute(new GetRefreshTokenQuery(req));

    return {
      statusCode: 200,
      message: "Token de actualización generado exitosamente.",
      data
    };
  }

  @AuthRequired()
  @Post("change-password")
  async changePassword(@Req() req: Request, @Body() data: ChangePasswdDto): Promise<NestResponse<void>> {
    await this.commandBus.execute(new ChangePasswdCommand(req, data));

    return {
      statusCode: 200,
      message: "¡Tu perfil está listo!"
    };
  }

  @AuthRequired()
  @Post("logout")
  async logout(@Req() req: Request): Promise<NestResponse<void>> {
    if (!req["user"]) throw new UnauthorizedException("Usuario no autenticado.");

    const { sub } = req["user"] as { sub: number; email: string; role: string };

    await this.authDomainService.logout(sub, req["token"]);

    return {
      statusCode: 200,
      message: "Ha cerrado sesión correctamente."
    };
  }
}
