import { BadRequestException, Injectable, Logger } from "@nestjs/common";
// Import User type from Prisma Client
import { IUserKeyCreate } from "../../dto/auth.type";
import { PrismaService } from "@/services/prisma/prisma.service";

@Injectable({})
export class UserKeyProjection {
  private readonly logger = new Logger("UserKeyProjection");
  constructor(private prisma: PrismaService) {}

  async updateMany(userId: number): Promise<void> {
    try {
      await this.prisma.userKey.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }

  async create(data: IUserKeyCreate): Promise<void> {
    try {
      await this.prisma.userKey.create({
        data: {
          ...data,
          isActive: true
        }
      });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }

  async update(keyId: number): Promise<void> {
    try {
      await this.prisma.userKey.update({
        where: { id: keyId },
        data: {
          isActive: false,
          revokedAt: new Date()
        }
      });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }
}
