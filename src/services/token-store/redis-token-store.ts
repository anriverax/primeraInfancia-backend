import { Injectable } from "@nestjs/common";
import { RedisService } from "@/services/redis/redis.service";
import { ITokenStore } from '../redis/redis.type';

/**
 * Implementación de TokenStore usando Redis
 * Almacena tokens en Redis con TTL automático
 */
@Injectable()
export class RedisTokenStore implements ITokenStore {
  private readonly accessTokenPrefix = "auth:access:";
  private readonly refreshTokenPrefix = "auth:refresh:";

  constructor(private readonly redisService: RedisService) {}

  async storeAccessToken(tokenId: string, ttl: number): Promise<void> {
    const key = `${this.accessTokenPrefix}${tokenId}`;
    await this.redisService.set(key, "valid", ttl);
  }

  async storeRefreshToken(userId: number, token: string, ttl: number): Promise<void> {
    const key = `${this.refreshTokenPrefix}${userId}`;
    await this.redisService.set(key, token, ttl);
  }

  async getRefreshToken(userId: number): Promise<string | null> {
    const key = `${this.refreshTokenPrefix}${userId}`;
    const token = await this.redisService.get(key);
    return token || null;
  }

  async invalidateAccessToken(tokenId: string): Promise<void> {
    const key = `${this.accessTokenPrefix}${tokenId}`;
    await this.redisService.del(key);
  }

  async invalidateRefreshToken(userId: number): Promise<void> {
    const key = `${this.refreshTokenPrefix}${userId}`;
    await this.redisService.del(key);
  }
}
