import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from "@nestjs/common";

@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  /**
   * Maneja errores de Prisma y lanza excepciones NestJS apropiadas
   *
   * @param context Contexto donde ocurrió el error (para logging)
   * @param error Error de Prisma
   * @throws {ConflictException} Si hay violación de unique constraint
   * @throws {NotFoundException} Si el registro no existe
   * @throws {BadRequestException} Si hay errores de validación
   * @throws {InternalServerErrorException} Para otros errores
   */
  handlePrismaError(context: string, error: any): never {
    this.logger.error(`[${context}] Prisma Error:`, {
      code: error.code,
      message: error.message,
      meta: error.meta
    });

    // P2002: Violación de unique constraint
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      throw new ConflictException(`Ya existe un registro con este ${field}`);
    }

    // P2025: No encontrado
    if (error.code === "P2025") {
      throw new NotFoundException("El registro solicitado no fue encontrado");
    }

    // P2003: Violación de foreign key
    if (error.code === "P2003") {
      const relation = error.meta?.field_name || "relation";
      throw new BadRequestException(`Referencia inválida: ${relation}`);
    }

    // P2014: Relación requerida pero nula
    if (error.code === "P2014") {
      throw new BadRequestException(
        "No se puede eliminar este registro porque está siendo referenciado"
      );
    }

    // Por defecto
    throw new InternalServerErrorException("Error en la base de datos. Por favor intente más tarde.");
  }

  /**
   * Maneja errores de lógica de negocio
   *
   * @param context Contexto donde ocurrió el error
   * @param error Error capturado
   * @throws {BadRequestException | NotFoundException | ConflictException | InternalServerErrorException}
   */
  handleBusinessLogicError(context: string, error: any): never {
    this.logger.error(`[${context}] Business Logic Error:`, error);

    // Si ya es una excepción NestJS, relanzar
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof ConflictException
    ) {
      throw error;
    }

    // Si es error de validación personalizado
    if (error.name === "ValidationError") {
      throw new BadRequestException(error.message);
    }

    // Por defecto
    throw new InternalServerErrorException(error.message || "Error procesando la solicitud");
  }

  /**
   * Maneja errores de servicios externos (email, S3, etc.)
   *
   * @param context Contexto donde ocurrió el error
   * @param service Nombre del servicio externo
   * @param error Error capturado
   * @throws {InternalServerErrorException}
   */
  handleExternalServiceError(context: string, service: string, error: any): never {
    this.logger.error(`[${context}] External Service Error (${service}):`, error);

    throw new InternalServerErrorException(
      `Error comunicándose con ${service}. Por favor intente más tarde.`
    );
  }

  /**
   * Valida que no sea nulo/undefined
   */
  requireNotNull<T>(value: T | null | undefined, message: string): T {
    if (value == null) {
      throw new NotFoundException(message);
    }
    return value;
  }

  /**
   * Valida que una condición sea verdadera
   */
  requireTrue(condition: boolean, message: string): void {
    if (!condition) {
      throw new BadRequestException(message);
    }
  }
}
