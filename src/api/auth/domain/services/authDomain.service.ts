import { Injectable, Logger, UnauthorizedException, Inject } from "@nestjs/common";
import { ILoginResponse, IUserWithPermissionsResponse } from "../../application/dto/auth.type";
import { IPasswordHasher } from "../ports/security/password-hasher.port";
import { ITokenGenerator } from "../ports/token/token-generator.port";
import { IKeyGenerator } from "../ports/security/key-generator.port";
import { IRedisAccountSecurity } from "../ports/security/redis-account-security.port";

@Injectable()
export class AuthDomainService {
  private readonly logger = new Logger(AuthDomainService.name);
  constructor(
    @Inject("IPasswordHasher") private readonly passwordHashing: IPasswordHasher,
    @Inject("ITokenGenerator") private readonly tokenManagement: ITokenGenerator,
    @Inject("IKeyGenerator") private readonly keyService: IKeyGenerator,
    @Inject("IRedisAccountSecurity") private readonly accountSecurity: IRedisAccountSecurity
  ) {}

  async authenticate(
    email: string,
    plainPassword: string,
    user: IUserWithPermissionsResponse
  ): Promise<ILoginResponse> {
    this.logger.debug(`Autenticando usuario: ${email}`);
    await this.isAccountLocked(email);

    const isPasswordValid = await this.passwordHashing.comparePasswords(plainPassword, user.passwd);

    if (!isPasswordValid) {
      await this.trackLoginAttempt(email, false);
    }

    await this.accountSecurity.trackLoginAttempt(email, true);
    this.logger.log(`✅ Login exitoso: ${email}`);

    const tokens = await this.tokenManagement.generateTokens(user);

    return tokens;
  }

  async isAccountLocked(email: string): Promise<void> {
    const lockStatus = await this.accountSecurity.isAccountLocked(email);

    if (lockStatus.isLocked) {
      throw new UnauthorizedException(
        `Cuenta bloqueada por múltiples intentos fallidos. Intente de nuevo en ${lockStatus.minutesRemaining} minutos.`
      );
    }
  }

  async trackLoginAttempt(email: string, isSuccess: boolean): Promise<void> {
    this.logger.debug(`Registrando intento de login: ${email}, éxito: ${isSuccess}`);
    await this.isAccountLocked(email);

    const attemptResult = await this.accountSecurity.trackLoginAttempt(email, isSuccess);

    if (attemptResult.isNowLocked) {
      throw new UnauthorizedException(
        `Cuenta bloqueada tras ${5} intentos fallidos. Intente de nuevo en 15 minutos.`
      );
    }

    throw new UnauthorizedException(
      `Credenciales incorrectas. Intentos restantes: ${attemptResult.attemptsRemaining}`
    );
  }

  async prepareUserRegistrationData(plainPassword: string): Promise<{
    hashedPassword: string;
    publicKey: string;
    encryptedPrivateKey: string;
  }> {
    this.logger.debug("Preparando datos de registro");

    const hashedPassword = await this.passwordHashing.hashPassword(plainPassword);

    const { publicKey, encryptedPrivateKey } = this.generateEncryptedKeyPair();

    this.logger.debug("Datos de registro preparados");

    return {
      hashedPassword,
      publicKey,
      encryptedPrivateKey
    };
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    currentHashedPassword: string
  ): Promise<string> {
    this.logger.debug("Iniciando cambio de contraseña");

    const isCurrentPasswordValid = await this.passwordHashing.comparePasswords(
      oldPassword,
      currentHashedPassword
    );

    if (!isCurrentPasswordValid) {
      this.logger.warn("Contraseña actual incorrecta en cambio de contraseña");
      throw new UnauthorizedException("Contraseña actual incorrecta.");
    }

    const isSamePassword = await this.passwordHashing.comparePasswords(
      newPassword,
      currentHashedPassword
    );

    if (isSamePassword) {
      this.logger.warn("Nueva contraseña igual a la anterior");
      throw new UnauthorizedException("La nueva contraseña debe ser diferente.");
    }

    const newHashedPassword = await this.passwordHashing.hashPassword(newPassword);
    this.logger.log("✅ Contraseña cambiada exitosamente");

    return newHashedPassword;
  }

  async logout(userId: number, tokenId: string): Promise<void> {
    await this.tokenManagement.invalidateTokens(userId, tokenId);
  }

  async resetLoginAttempts(email: string): Promise<void> {
    this.logger.debug(`Reset intentos de login: ${email}`);
    await this.accountSecurity.resetLoginAttempts(email);
  }

  generateEncryptedKeyPair(): { publicKey: string; encryptedPrivateKey: string } {
    const { publicKey, privateKey } = this.keyService.generateKeyPair();
    const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);
    return { publicKey, encryptedPrivateKey };
  }

  async refreshTokenAndBuildLogin(
    token: string,
    user: IUserWithPermissionsResponse
  ): Promise<ILoginResponse> {
    const accessToken = await this.tokenManagement.refreshToken(user, token);

    const {
      isVerified,
      email,
      avatar,
      Role: { name, Permissions }
    } = user;

    const firstName = user.Person ? user.Person.firstName : "";
    const lastName = user.Person ? user.Person.lastName1 : "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    return {
      accessToken,
      refreshToken: token,
      user: {
        email,
        isVerified,
        name: fullName,
        picture: avatar,
        role: name
      },
      permissions: Permissions
    };
  }

  /**
   * USE CASE: Create Email Verification Code (feature disabled)
  async createVerificationCode(email: string): Promise<string> {
    this.logger.debug(`Creando código de verificación: ${email}`);
    return await this.accountSecurity.createVerificationCode(email);
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    this.logger.debug(`Verificando código de email: ${email}`);
    return await this.accountSecurity.verifyEmailCode(email, code);
  }
  */
}
