import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IUpdateUserAvatar } from "../../dto/profile.type";
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
}
