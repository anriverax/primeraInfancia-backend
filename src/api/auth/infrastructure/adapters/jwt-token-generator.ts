import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "@/services/redis/redis.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { getPrivateKey } from "@/common/helpers/functions";
import { timingSafeEqual } from "crypto";
import {
  AccessTokenData,
  ITokenData,
  ITokenGenerator
} from "../../domain/ports/token/token-generator.port";
import { ILoginResponse, IUserWithPermissionsResponse } from "../../application/dto/auth.type";

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  private readonly accessTokenPrefix = "auth:access:";
  private readonly refreshTokenPrefix = "auth:refresh:";
  /* eslint-disable @typescript-eslint/no-explicit-any */
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}
  async setAccessToken(data: AccessTokenData): Promise<string> {
    const { id, email, rolId, role, permissions } = data;
    const tokenId = uuidv4();

    const privateKey = getPrivateKey(this.config);
    const ttl = 15 * 60; // 15 minutos en segundos
    const accessToken = this.jwtService.sign(
      { sub: id, email, rolId, role, tokenId, permissions } as any,
      {
        privateKey: privateKey,
        algorithm: "RS256",
        expiresIn: this.config.get<string>("jwt.expiration") || "15m"
      } as any
    ) as string;

    await this.redisService.set(`${this.accessTokenPrefix}${tokenId}`, accessToken, ttl);

    return accessToken;
  }

  async setRefreshToken(data: ITokenData): Promise<string> {
    const { id, email, rolId, role } = data;

    const refreshToken = this.jwtService.sign(
      { sub: id, email, rolId, role } as any,
      {
        secret: this.config.get<string>("jwt.refreshSecret"),
        expiresIn: this.config.get<string>("jwt.refreshToken")
      } as any
    ) as string;

    await this.redisService.set(`${this.refreshTokenPrefix}${id}`, refreshToken, 7 * 24 * 60 * 60);

    return refreshToken;
  }

  async generateTokens(user: IUserWithPermissionsResponse): Promise<ILoginResponse> {
    const {
      id,
      email,
      isVerified,
      Role: { name, Permissions }
    } = user;

    const accessToken = await this.setAccessToken({
      id,
      email,
      rolId: user.Role.id,
      role: name,
      permissions: JSON.stringify(Permissions)
    });

    const refreshToken = await this.setRefreshToken({ id, email, rolId: user.Role.id, role: name });

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
        picture: user.avatar,
        role: name
      },
      permissions: Permissions
    };
  }

  async refreshToken(user: IUserWithPermissionsResponse, token: string): Promise<string> {
    const {
      id,
      email,
      Role: { id: rolId, name: role, Permissions }
    } = user;

    const storedToken = await this.redisService.get(`${this.refreshTokenPrefix}${id}`);

    if (!storedToken || !timingSafeEqual(Buffer.from(storedToken), Buffer.from(token))) {
      throw new UnauthorizedException(
        "El token de sesión es inválido o ha expirado. Por favor, inicie sesión nuevamente."
      );
    }

    // Generate a new assessToken
    const accessToken = await this.setAccessToken({
      id,
      rolId,
      email,
      role,
      permissions: JSON.stringify(Permissions)
    });

    return accessToken;
  }

  async invalidateTokens(userId: number, tokenId?: string): Promise<void> {
    if (tokenId) {
      await this.redisService.del(`${this.accessTokenPrefix}${tokenId}`);
    }

    await this.redisService.del(`${this.refreshTokenPrefix}${userId}`);
  }

  /* eslint-enable @typescript-eslint/no-explicit-any */
}
