import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { RedisService } from "@/services/redis/redis.service";
import { generateCode } from "@/common/helpers/functions";
import { ILoginResponse, IUser } from "../dto/auth.type";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";

@Injectable({})
export class AuthService {
  private readonly logger = new Logger("AuthService");
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly errorHandlingService: ErrorHandlingService
  ) {}



  async createCodeVerificationEmail(email: string): Promise<void> {
    try {
      const code = generateCode(6);

      await this.redisService.set(`verifyEmailCode:${email}`, code, 3 * 24 * 60 * 60); // TTL de 3 días
    } catch (error) {
      this.errorHandlingService.handleBusinessLogicError(
        "Se ha producido un error al intentar enviar el correo electrónico. Por favor, inténtelo nuevamente más tarde",
        error
      );
    }
  }

  async logout(id: number, accessToken: string): Promise<boolean> {
    try {
      // Remove the Redis refreshToken
      const refreshTokenKey = `auth:refresh:${id}`;

      await this.redisService.del(refreshTokenKey);

      if (accessToken) {
        try {
          const decoded = this.jwtService.decode(accessToken);
          if (decoded?.tokenId) {
            await this.redisService.del(`auth:access:${decoded.tokenId}`);
          }
        } catch (error) {
          this.logger.warn("Invalid token format during logout", error);
        }
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        "El token de sesión es inválido. Por favor, inicie sesión nuevamente.",
        error
      );
    }
  }

  getData(
    accessToken: string,
    refreshToken: string,
    user: IUser,
    userPermissions: string[]
  ): ILoginResponse {
    const {
      isVerified,
      email,
      avatar,
      Role: { name }
    } = user;

    const firstName = user.Person ? user.Person.firstName : "";
    const lastName = user.Person ? user.Person.lastName1 : "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    return {
      accessToken,
      refreshToken,
      user: {
        email,
        isVerified,
        name: fullName,
        picture: avatar,
        role: name
      },
      permissions: userPermissions
    };
  }
}
