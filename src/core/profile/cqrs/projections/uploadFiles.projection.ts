import { BadRequestException, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IUpdateAcademicCv, IUpdatePersonDui, IUpdateUserAvatar } from "../../dto/profile.type";

@Injectable({})
export class UploadFileProjection {
  private readonly logger = new Logger("UploadFileProjection");
  constructor(private prisma: PrismaService) {}

  async uploadCv(data: IUpdateAcademicCv): Promise<void> {
    const { cvName, academicId } = data;

    try {
      await this.prisma.academic.update({
        where: { id: academicId },
        data: {
          cvImage: cvName
        }
      });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }

  async uploadAvatar(data: IUpdateUserAvatar): Promise<void> {
    const { avatar, userId } = data;

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          avatar
        }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ForbiddenException("El usuario ya se encuentra registrada en el sistema.");
      }

      // Registrar o manejar adecuadamente otros errores de Prisma.
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }

  async uploadDui(data: IUpdatePersonDui): Promise<void> {
    const { duiName, personId } = data;

    try {
      await this.prisma.person.update({
        where: { id: personId },
        data: {
          duiImage: duiName
        }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ForbiddenException("El usuario ya se encuentra registrada en el sistema.");
      }

      // Registrar o manejar adecuadamente otros errores de Prisma.
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException(
        "Se ha producido un error al procesar su solicitud. Por favor, inténtelo nuevamente más tarde."
      );
    }
  }
}
