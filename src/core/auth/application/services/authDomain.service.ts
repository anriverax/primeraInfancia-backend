import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AccountSecurityService } from "./accountSecurity.service";
import { TokenManagementService } from "./tokenManagement.service";
import { PasswordHashingService } from "../../infrastructure/services/passwordHashing.service";
import { KeyService } from "../../infrastructure/services/key.service";
import { ILoginResponse, IUser } from "../dto/auth.type";
import { Request } from "express";

@Injectable()
export class AuthDomainService {
  private readonly logger = new Logger(AuthDomainService.name);
  constructor(
    private readonly passwordHashing: PasswordHashingService,
    private readonly tokenManagement: TokenManagementService,
    private readonly keyService: KeyService,
    private readonly accountSecurity: AccountSecurityService
  ) {
    this.accountSecurity = accountSecurity;
  }

  async authenticate(
    email: string,
    plainPassword: string,
    user: IUser,
    userPermissions: string[]
  ): Promise<ILoginResponse> {
    this.logger.debug(`Autenticando usuario: ${email}`);
    const isLocked = await this.accountSecurity.isAccountLocked(email);
    if (isLocked) {
      this.logger.warn(`Intento en cuenta bloqueada: ${email}`);
      throw new UnauthorizedException(
        "Cuenta bloqueada. Se han detectado múltiples intentos fallidos. Por favor, intente más tarde."
      );
    }

    const isPasswordValid = await this.passwordHashing.comparePasswords(plainPassword, user.passwd);

    if (!isPasswordValid) {
      await this.accountSecurity.trackLoginAttempt(email, false);
      this.logger.warn(`Contraseña incorrecta: ${email}`);
      throw new UnauthorizedException("Credenciales incorrectas.");
    }

    await this.accountSecurity.trackLoginAttempt(email, true);
    this.logger.log(`✅ Login exitoso: ${email}`);

    const tokens = await this.tokenManagement.generateTokens(user, userPermissions);

    return tokens;
  }

  async trackLoginAttempt(email: string, isSuccess: boolean): Promise<void> {
    this.logger.debug(`Registrando intento de login: ${email}, éxito: ${isSuccess}`);
    await this.accountSecurity.trackLoginAttempt(email, isSuccess);
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
    this.logger.debug(`Logout para usuario: ${userId}`);

    await this.tokenManagement.invalidateTokens(userId, tokenId);

    this.logger.log(`✅ Logout exitoso: ${userId}`);
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
    req: Request,
    user: IUser,
    userPermissions: string[]
  ): Promise<ILoginResponse> {
    const accessToken = await this.tokenManagement.refreshToken(req);

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
      refreshToken: req["token"],
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
