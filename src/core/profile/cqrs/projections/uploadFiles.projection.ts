import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IUpdatePersonDui, IUpdateUserAvatar } from "../../dto/profile.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class UploadFileProjection {
  constructor(private prisma: PrismaService) {}

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
      handlePrismaError("UploadFileProjection", error);
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
      handlePrismaError("UploadFileProjection", error);
    }
  }
}
