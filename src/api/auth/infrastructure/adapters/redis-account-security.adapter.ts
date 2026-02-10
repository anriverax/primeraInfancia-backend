import { RedisService } from "@/services/redis/redis.service";
import { Injectable } from "@nestjs/common";
import {
  IRedisAccountSecurity,
  ILoginAttemptResult,
  IAccountLockStatus
} from "../../domain/ports/security/redis-account-security.port";

@Injectable()
export class RedisAccountSecurity implements IRedisAccountSecurity {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_TTL = 15 * 60; // 15 minutos en segundos

  constructor(private readonly redisService: RedisService) {}

  async trackLoginAttempt(email: string, success: boolean): Promise<ILoginAttemptResult> {
    const attemptsKey = `login:attempts:${email}`;
    const lockoutKey = `login:locked:${email}`;
    const lockoutTimeKey = `login:locked_time:${email}`;

    if (success) {
      await this.redisService.del(attemptsKey);
      return {
        success: true,
        attemptsRemaining: this.MAX_ATTEMPTS,
        isNowLocked: false
      };
    }

    const attempts = await this.redisService.get(attemptsKey);
    const currentAttempts = (attempts ? parseInt(attempts, 10) : 0) + 1;

    await this.redisService.set(attemptsKey, String(currentAttempts), this.LOCKOUT_TTL);

    const isNowLocked = currentAttempts >= this.MAX_ATTEMPTS;

    if (isNowLocked) {
      await this.redisService.set(lockoutKey, "locked", this.LOCKOUT_TTL);
      await this.redisService.set(lockoutTimeKey, String(Date.now()), this.LOCKOUT_TTL);
    }

    return {
      success: false,
      attemptsRemaining: Math.max(0, this.MAX_ATTEMPTS - currentAttempts),
      isNowLocked
    };
  }

  async isAccountLocked(email: string): Promise<IAccountLockStatus> {
    const lockoutKey = `login:locked:${email}`;
    const lockoutTimeKey = `login:locked_time:${email}`;

    const isLockedValue = await this.redisService.get(lockoutKey);

    const isLocked = !!isLockedValue;

    if (!isLocked) {
      return {
        isLocked: false,
        minutesRemaining: 0
      };
    }

    // Obtener el timestamp de bloqueo para calcular tiempo restante
    const lockTimeStr = await this.redisService.get<string>(lockoutTimeKey);

    if (lockTimeStr) {
      const lockTime = parseInt(lockTimeStr, 10);
      const now = Date.now();
      const elapsedMs = now - lockTime;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const remainingSeconds = Math.max(0, this.LOCKOUT_TTL - elapsedSeconds);
      const minutesRemaining = Math.ceil(remainingSeconds / 60);

      return {
        isLocked: true,
        minutesRemaining: Math.max(1, minutesRemaining)
      };
    }

    // Fallback: mostrar 15 minutos si no hay timestamp
    return {
      isLocked: true,
      minutesRemaining: 15
    };
  }

  async resetLoginAttempts(email: string): Promise<void> {
    const attemptsKey = `login:attempts:${email}`;
    const lockoutKey = `login:locked:${email}`;

    await this.redisService.del(attemptsKey);
    await this.redisService.del(lockoutKey);
  }
}
