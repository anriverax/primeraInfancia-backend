import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private readonly logger = new Logger(RefreshTokenGuard.name);

  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    if (type !== "Bearer" || !token) {
      this.logger.warn("Refresh token no encontrado.");
      throw new UnauthorizedException("No autorizado.");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>("jwt.refreshSecret") as string,
        algorithms: ["HS256"]
      });

      request["user"] = payload;
      request["token"] = token;
      return true;
    } catch (error) {
      this.logger.error("No se pudo validar el refresh token.", error);
      throw new UnauthorizedException("No tienes permiso para acceder a este recurso.");
    }
  }
}
