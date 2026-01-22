import { RedisService } from "@/services/redis/redis.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AccountSecurityService {
  private readonly logger = new Logger("AuthService");
  constructor(private readonly redisService: RedisService) {}
  async trackLoginAttempt(email: string, success: boolean): Promise<void> {
    const attemptsKey = `login:attempts:${email}`;
    const lockoutKey = `login:locked:${email}`;

    if (success) {
      await this.redisService.del(attemptsKey);
      this.logger.log(`✅ Login exitoso para ${email}`);
      return;
    }

    const attempts = await this.redisService.get(attemptsKey);
    const currentAttempts = (attempts ? parseInt(attempts, 10) : 0) + 1;

    const ttl = 15 * 60;

    await this.redisService.set(attemptsKey, String(currentAttempts), ttl);

    if (currentAttempts >= 5) {
      await this.redisService.set(lockoutKey, "locked", ttl);
      this.logger.warn(
        `🔒 Cuenta bloqueada por 15 minutos: ${email} (${currentAttempts} intentos fallidos)`
      );
    }

    this.logger.warn(`⚠️ Intento de login fallido para ${email} (${currentAttempts}/5)`);
  }

  async isAccountLocked(email: string): Promise<boolean> {
    const lockoutKey = `login:locked:${email}`;
    const isLocked = await this.redisService.get(lockoutKey);

    if (isLocked) {
      this.logger.warn(`🔒 Intento de acceso a cuenta bloqueada: ${email}`);
      return true;
    }

    return false;
  }
}
