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
  private readonly logger = new Logger("ErrorHandling");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  handlePrismaError(context: string, error: any): never {
    this.logger.error(`[${context}] Prisma error:`, error);

    if (error.code === "P2002") {
      throw new ConflictException("Este registro ya existe");
    }
    if (error.code === "P2025") {
      throw new NotFoundException("Registro no encontrado");
    }

    throw new InternalServerErrorException("Error en la base de datos");
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  handleBusinessLogicError(error: Error): never {
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }

    this.logger.error("Unexpected business error:", error);
    throw new InternalServerErrorException(error.message);
  }
}
