import { BadRequestException, ForbiddenException, Injectable, Logger } from "@nestjs/common";
// Import User type from Prisma Client
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IAuthEvent, IUpdatePasswdIsVerifiedParams } from "../../dto/auth.type";
import { PrismaService } from "@/services/prisma/prisma.service";

@Injectable({})
export class UserProjection {
  private readonly logger = new Logger("UserProjection");
  constructor(private prisma: PrismaService) {}

  async register(data: IAuthEvent): Promise<void> {
    const { career, nip, email, passwd, roleId, isVerified, publicKey, privateKey, ...personData } =
      data;

    try {
      await this.prisma.person.create({
        data: {
          ...personData,
          Academic: {
            create: { career, nip }
          },
          User: {
            create: { email, passwd, roleId, isVerified, UserKey: { create: { publicKey, privateKey } } }
          }
        }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ForbiddenException("El usuario ya se encuentra registrada en el sistema.");
      }

      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }

  async updatePasswdIsVerified(data: IUpdatePasswdIsVerifiedParams): Promise<void> {
    const { id, email, data: updateData } = data;

    try {
      await this.prisma.user.update({
        where: { id, email },
        data: updateData
      });
    } catch (error) {
      this.logger.error(`❌ Error al actualizar la contraseña del usuario ${id}: `, error);
      throw new BadRequestException(
        "Se ha producido un error al actualizar los datos. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }
}
