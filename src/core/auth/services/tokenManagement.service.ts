import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from "uuid";
import { ILoginResponse, IUser } from "../dto/auth.type";
import { Request } from "express";
import { getPrivateKey } from "@/common/helpers/functions";
import { timingSafeEqual } from "crypto";
import { RedisService } from "../../../services/redis/redis.service";

@Injectable()
export class TokenManagementService {
  private readonly accessTokenPrefix = "auth:access:";
  private readonly refreshTokenPrefix = "auth:refresh:";

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async setAccessToken(data: {
    id: number;
    email: string;
    rolId: number;
    role: string;
    permissions: string[];
  }): Promise<string> {
    const { id, email, rolId, role, permissions } = data;
    const tokenId = uuidv4();

    const privateKey = getPrivateKey(this.config);
    const ttl = 15 * 60; // 15 minutos en segundos
    const accessToken = this.jwtService.sign(
      { sub: id, email, rolId, role, tokenId, permissions },
      {
        privateKey: privateKey,
        algorithm: "RS256",
        expiresIn: this.config.get<string>("jwt.expiration") || "15m"
      }
    );

    await this.redisService.set(`${this.accessTokenPrefix}${tokenId}`, accessToken, ttl);

    return accessToken;
  }

  async setRefreshToken(data: {
    id: number;
    email: string;
    rolId: number;
    role: string;
  }): Promise<string> {
    const { id, email, rolId, role } = data;

    const refreshToken = this.jwtService.sign(
      { sub: id, email, rolId, role },
      {
        secret: this.config.get<string>("jwt.refreshSecret"),
        expiresIn: this.config.get<string>("jwt.refreshToken")
      }
    );

    await this.redisService.set(`${this.refreshTokenPrefix}${id}`, refreshToken, 7 * 24 * 60 * 60);

    return refreshToken;
  }

  async generateTokens(user: IUser, permissions: string[]): Promise<ILoginResponse> {
    const {
      id,
      email,
      isVerified,
      Role: { name }
    } = user;

    const accessToken = await this.setAccessToken({
      id,
      email,
      rolId: user.Role.id,
      role: name,
      permissions
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
      permissions
    };
  }

  async refreshToken(req: Request): Promise<string> {
    const { sub, email, rolId, role, permissions } = req["user"] as {
      email: string;
      sub: number;
      rolId: number;
      role: string;
      permissions: string[];
    };

    const storedToken = await this.redisService.get(`${this.refreshTokenPrefix}${sub}`);

    if (!storedToken || !timingSafeEqual(Buffer.from(storedToken), Buffer.from(req["token"]))) {
      throw new UnauthorizedException(
        "El token de sesión es inválido o ha expirado. Por favor, inicie sesión nuevamente."
      );
    }

    // Generate a new assessToken
    const accessToken = await this.setAccessToken({ id: sub, rolId, email, role, permissions });

    return accessToken;
  }

  async invalidateTokens(userId: number, tokenId?: string): Promise<void> {
    if (tokenId) {
      await this.redisService.del(`${this.accessTokenPrefix}${tokenId}`);
    }

    await this.redisService.del(`${this.refreshTokenPrefix}${userId}`);
  }
}
