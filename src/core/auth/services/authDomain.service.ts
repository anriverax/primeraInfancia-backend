import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AccountSecurityService } from "./accountSecurity.service";
import { PasswordHashingService } from "./passwordHashing.service";
import { TokenManagementService } from "./tokenManagement.service";
import { KeyService } from "./key.service";
import { IUser, ILoginResponse } from "../dto/auth.type";

/**
 * ORQUESTADOR DE DOMINIO
 *
 * Este servicio orquesta la lógica de autenticación usando servicios especializados.
 * NO contiene lógica de negocio, solo coordina.
 *
 * Responsabilidades:
 * - Autenticar usuarios (login)
 * - Registrar usuarios (setup inicial)
 * - Cambiar contraseña
 * - Verificar email
 * - Logout
 */
@Injectable()
export class AuthDomainService {
  private readonly logger = new Logger(AuthDomainService.name);

  constructor(
    private readonly passwordHashing: PasswordHashingService,
    private readonly accountSecurity: AccountSecurityService,
    private readonly tokenManagement: TokenManagementService,
    private readonly keyService: KeyService
  ) {}

  /**
   * CASO DE USO: Autenticar Usuario (Login)
   *
   * Flujo:
   * 1. Verificar si cuenta está bloqueada
   * 2. Validar contraseña contra hash almacenado
   * 3. Registrar intento (exitoso o fallido)
   * 4. Generar tokens
   *
   * @param email - Email del usuario
   * @param plainPassword - Contraseña en texto plano
   * @param user - Usuario obtenido de base de datos
   * @param userPermissions - Permisos del usuario
   * @returns Tokens y datos de usuario
   */
  async authenticate(
    email: string,
    plainPassword: string,
    user: IUser,
    userPermissions: string[]
  ): Promise<ILoginResponse> {
    this.logger.debug(`Autenticando usuario: ${email}`);

    // 1. ¿Cuenta bloqueada?
    const isLocked = await this.accountSecurity.isAccountLocked(email);
    if (isLocked) {
      this.logger.warn(`Intento en cuenta bloqueada: ${email}`);
      throw new UnauthorizedException(
        "Cuenta bloqueada. Se han detectado múltiples intentos fallidos. Por favor, intente más tarde."
      );
    }

    const isPasswordValid = await this.passwordHashing.comparePasswords(plainPassword, user.passwd);

    if (!isPasswordValid) {
      // Registrar intento fallido
      await this.accountSecurity.trackLoginAttempt(email, false);
      this.logger.warn(`Contraseña incorrecta: ${email}`);
      throw new UnauthorizedException("Credenciales incorrectas.");
    }

    // 3. Registrar intento exitoso
    await this.accountSecurity.trackLoginAttempt(email, true);
    this.logger.log(`✅ Login exitoso: ${email}`);

    // 4. Generar y retornar tokens
    const tokens = await this.tokenManagement.generateTokens(user, userPermissions);

    return tokens;
  }

  /**
   * CASO DE USO: Registrar Usuario (Registration)
   *
   * Flujo:
   * 1. Generar claves criptográficas
   * 2. Hashear contraseña
   * 3. Preparar datos para persistencia
   *
   * Nota: El guardado en BD lo hace el Handler + Repository
   *       Esta función solo prepara los datos.
   *
   * @param plainPassword - Contraseña en texto plano
   * @returns Objeto con datos procesados para registro
   */
  async prepareUserRegistrationData(plainPassword: string): Promise<{
    hashedPassword: string;
    publicKey: string;
    encryptedPrivateKey: string;
  }> {
    this.logger.debug("Preparando datos de registro");

    // 1. Hashear contraseña
    const hashedPassword = await this.passwordHashing.hash(plainPassword);

    // 2. Generar claves criptográficas
    const { publicKey, privateKey } = this.keyService.generateKeyPair();
    const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);

    this.logger.debug("Datos de registro preparados");

    return {
      hashedPassword,
      publicKey,
      encryptedPrivateKey
    };
  }

  /**
   * CASO DE USO: Cambiar Contraseña
   *
   * Flujo:
   * 1. Validar contraseña actual
   * 2. Validar nueva contraseña (no igual a la anterior)
   * 3. Hashear nueva contraseña
   *
   * @param oldPassword - Contraseña actual en texto plano
   * @param newPassword - Nueva contraseña en texto plano
   * @param currentHashedPassword - Hash de contraseña actual
   * @returns Hash de nueva contraseña
   */
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

  /**
   * CASO DE USO: Logout
   *
   * Revoca todos los tokens del usuario
   *
   * @param userId - ID del usuario
   * @param tokenId - ID del token de acceso
   */
  async logout(userId: number, tokenId: string): Promise<void> {
    this.logger.debug(`Logout para usuario: ${userId}`);

    await this.tokenManagement.revokeUserTokens(userId, tokenId);

    this.logger.log(`✅ Logout exitoso: ${userId}`);
  }

  /**
   * CASO DE USO: Resetear intentos de login fallidos
   *
   * Se usa después de una verificación exitosa
   *
   * @param email - Email del usuario
   */
  async resetLoginAttempts(email: string): Promise<void> {
    this.logger.debug(`Reset intentos de login: ${email}`);
    await this.accountSecurity.resetLoginAttempts(email);
  }

  /**
   * CASO DE USO: Crear código de verificación de email
   *
   * Se crea durante el registro. El Handler lo publica como evento.
   *
   * @param email - Email a verificar
   * @returns Código de verificación generado
   */
  async createVerificationCode(email: string): Promise<string> {
    this.logger.debug(`Creando código de verificación: ${email}`);
    return await this.accountSecurity.createVerificationCode(email);
  }

  /**
   * CASO DE USO: Verificar email
   *
   * Valida el código de verificación
   *
   * @param email - Email a verificar
   * @param code - Código proporcionado por usuario
   * @returns true si es válido
   */
  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    this.logger.debug(`Verificando código de email: ${email}`);
    return await this.accountSecurity.verifyEmailCode(email, code);
  }
}
