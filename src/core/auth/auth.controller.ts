import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { AuthService } from "./services/auth.service";
import { AuthDto, ChangePasswdDto, LoginDto } from "./dto/auth.dto";
import { ILoginResponse } from "./dto/auth.type";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { NestResponse } from "@/common/helpers/dto";
import { AuthRequired } from "@/services/jwt/decorators/authRequired.decorator";
import { TokenService } from "./services/token.service";
import { RefreshTokenGuard } from "@/common/guards/refreshToken.guard";
import { RegisterUserCommand } from "./cqrs/commands/register/registerUser.command";
import { FindUniqueUserQuery } from "./cqrs/queries/user/findUniqueUser.query";
import { ChangePasswdCommand } from "./cqrs/commands/changePasswd/changePasswd.command";
import { VerifyEmailCommand } from "./cqrs/commands/verifyEmail/verifyEmail.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @Post("register")
  async register(@Body() data: AuthDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new RegisterUserCommand(data));
  }

  @Post("login")
  async login(@Body() data: LoginDto): Promise<NestResponse<ILoginResponse>> {
    const { value1, value2 } = data;

    const user = await this.queryBus.execute(new FindUniqueUserQuery({ email: value1 }));
    if (!user) throw new NotFoundException("El usuario no existe en el sistema.");

    await this.authService.verifyPasswd(user.passwd, value2);
    const result = await this.tokenService.generateTokens(user);

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

    const data = this.authService.getData(accessToken, req["token"], user);

    return {
      statusCode: 200,
      message: "Token de actualización generado exitosamente.",
      data
    };
  }

  @AuthRequired()
  @Post("verify-email")
  async verifyEmail(
    @Req() req: Request,
    @Body() data: { verifyCode: string }
  ): Promise<NestResponse<boolean>> {
    if (!req["user"]) throw new UnauthorizedException("Usuario no autenticado.");

    const { id, email } = req["user"] as { id: number; email: string; sub: number; role: string };

    return this.commandBus.execute(new VerifyEmailCommand({ id, email, ...data }));
  }

  @AuthRequired()
  @Post("change-password")
  async changePassword(
    @Req() req: Request,
    @Body() data: ChangePasswdDto
  ): Promise<NestResponse<{ isVerified: boolean; avatar: string | null }>> {
    if (!req["user"]) throw new UnauthorizedException("Usuario no autenticado.");

    const { id, email } = req["user"] as { id: number; email: string; sub: number; role: string };

    return this.commandBus.execute(
      new ChangePasswdCommand({ id, email, oldPasswd: data.value1, newPasswd: data.value2 })
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
