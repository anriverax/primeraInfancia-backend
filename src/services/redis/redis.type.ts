/**
 * Interfaz para abstracción de almacenamiento de tokens
 * Permite cambiar Redis por otra implementación sin afectar TokenService
 */
export interface ITokenStore {
  /**
   * Almacena un token de acceso en el store
   * @param tokenId Identificador único del token
   * @param ttl Tiempo de vida en segundos
   */
  storeAccessToken(tokenId: string, ttl: number): Promise<void>;

  /**
   * Almacena un token de refresco en el store
   * @param userId Identificador del usuario
   * @param token Token JWT
   * @param ttl Tiempo de vida en segundos
   */
  storeRefreshToken(userId: number, token: string, ttl: number): Promise<void>;

  /**
   * Obtiene un token de refresco del store
   */
  getRefreshToken(userId: number): Promise<string | null>;

  /**
   * Invalida un token de acceso
   */
  invalidateAccessToken(tokenId: string): Promise<void>;

  /**
   * Invalida un token de refresco
   */
  invalidateRefreshToken(userId: number): Promise<void>;
}
