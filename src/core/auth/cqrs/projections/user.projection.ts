import { Injectable } from "@nestjs/common";
// Import User type from Prisma Client
import { IAuthEvent, IUpdatePasswdIsVerifiedParams } from "../../dto/auth.type";
import { PrismaService } from "@/services/prisma/prisma.service";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class UserProjection {
  constructor(private prisma: PrismaService) {}

  async register(data: IAuthEvent): Promise<void> {
    const {
      career,
      nip,
      email,
      passwd,
      roleId,
      isVerified,
      publicKey,
      privateKey,
      typePersonId,
      schoolId,
      ...personData
    } = data;

    try {
      await this.prisma.person.create({
        data: {
          ...personData,
          Academic: {
            create: { career, nip }
          },
          User: {
            create: { email, passwd, roleId, isVerified, UserKey: { create: { publicKey, privateKey } } }
          },
          ...(schoolId > 0 && { PrincipalSchool: { create: { schoolId } } }),
          PersonRole: { create: { typePersonId } }
        }
      });
    } catch (error) {
      handlePrismaError("UserProjection", error);
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
      handlePrismaError("UserProjection", error);
    }
  }
}
