import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "@/services/redis/redis.service";
import { Request } from "express";
import { AUTH_REQUIRED } from "@/common/decorators/authRequired.decorator";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(AccessTokenGuard.name);

  /**
   * AccessTokenGuard class constructor.
   * @param jwtService - NestJS JwtService for JWT operations.
   * @param configService - NestJS ConfigService for configuration recovery.
   * @param reflector - NestJS reflector for metadata reflection.
   */
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redis: RedisService,
    private readonly config: ConfigService
  ) {}

  /**
   * Method to determine if the path is accessible based on the presence and validity of the access token.
   * @param context - NestJS ExecutionContext containing information about the current request.
   * @returns A Promise that resolves to a boolean indicating whether the path is reachable.
   * @throws UnauthorizedException if the token is absent or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const authRequired = this.reflector.getAllAndOverride<boolean>(AUTH_REQUIRED, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!authRequired) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    if (type !== "Bearer" || !token) {
      this.logger.warn("Token de acceso no encontrado.");
      throw new UnauthorizedException("No autorizado.");
    }

    try {
      const publicKey =
        this.config.get<string>("jwt.publicKey") ||
        fs.readFileSync(this.config.get<string>("jwt.publicKey")!, "utf8");

      // Verify the token using the public key
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: publicKey,
        algorithms: ["RS256"] // Algoritmo asimétrico
      });

      // We check if the token is in Redis (valid and not revoked).
      const tokenKey = `auth:access:${payload.tokenId}`;
      const tokenInRedis = await this.redis.get(tokenKey);

      if (tokenInRedis !== "valid") {
        this.logger.warn(`La sesión ha expirado o ha sido revocada para el usuario: ${payload.sub}`);
        throw new UnauthorizedException("Acceso no autorizado.");
      }

      request["user"] = payload;
      request["token"] = token;
      this.logger.log("Se pudo validar el token de acceso.");
      return true;
    } catch (error) {
      this.logger.error("No se pudo validar el token de acceso.", error);
      throw new UnauthorizedException("No tienes permiso para acceder a este recurso.");
    }
  }
}
