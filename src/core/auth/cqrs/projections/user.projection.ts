import { Injectable } from "@nestjs/common";
import { IAuth, IUser } from "../../dto/auth.type";
import { PrismaService } from "@/services/prisma/prisma.service";
import { User, UserKey } from "prisma/generated/client";
import { ErrorHandlingService } from "@/services/errorHandling/error-handling.service";

export type IAuthEvent = IAuth & Pick<User, "isVerified"> & Pick<UserKey, "publicKey" | "privateKey">;

export interface IUpdatePasswdIsVerifiedParams extends Pick<IUser, "id" | "email"> {
  data: Pick<IUser, "passwd" | "isVerified" | "email">;
}

@Injectable()
export class UserProjection {
  constructor(
    private prisma: PrismaService,
    private errorHandler: ErrorHandlingService
  ) {}

  async register(data: IAuthEvent): Promise<void> {
    const {
      email,
      passwd,
      roleId,
      isVerified,
      publicKey,
      privateKey,

      schoolId,
      ...personData
    } = data;

    try {
      await this.prisma.person.create({
        data: {
          ...personData,
          User: {
            create: { email, passwd, roleId, isVerified, UserKey: { create: { publicKey, privateKey } } }
          },
          ...(schoolId && { PrincipalSchool: { create: { schoolId } } })
        }
      });
    } catch (error) {
      this.errorHandler.handlePrismaError("UserProjection.register", error);
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
      this.errorHandler.handlePrismaError("UserProjection.updatePasswdIsVerified", error);
    }
  }
}
