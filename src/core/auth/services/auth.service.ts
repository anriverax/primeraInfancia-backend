import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { RedisService } from "@/services/redis/redis.service";
import { generateCode } from "@/common/helpers/functions";
import { ILoginResponse, IUser } from "../dto/auth.type";

@Injectable({})
export class AuthService {
  private readonly logger = new Logger("AuthService");
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async verifyPasswd(hashedPassword: string, passwd: string): Promise<void> {
    const pwdMatch = await argon.verify(hashedPassword, passwd);

    if (!pwdMatch) {
      throw new UnauthorizedException(
        "Credenciales incorrectas. Por favor, verifique su usuario y contraseña e intente nuevamente."
      );
    }
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return argon.verify(hashedPassword, password);
  }

  async createCodeVerificationEmail(email: string): Promise<void> {
    try {
      const code = generateCode(6);

      await this.redisService.set(`verifyEmailCode:${email}`, code, 3 * 24 * 60 * 60); // TTL de 3 días
    } catch (error) {
      this.logger.error(`❌ Se produjo un error: `, error);
      throw new BadRequestException(
        "Se ha producido un error al intentar enviar el correo electrónico. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }

  async logout(id: number, accessToken: string): Promise<boolean> {
    try {
      // Remove the Redis refreshToken
      const refreshTokenKey = `auth:refresh:${id}`;

      await this.redisService.del(refreshTokenKey);

      if (accessToken) {
        const decoded = this.jwtService.decode(accessToken);
        const accessTokenKey = decoded.tokenId;
        await this.redisService.del(`auth:access:${accessTokenKey}`);
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
    const fullName = `${firstName} ${lastName}`;

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
