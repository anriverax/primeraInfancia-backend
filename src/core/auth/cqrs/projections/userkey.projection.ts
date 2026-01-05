import { Injectable } from "@nestjs/common";
// Import User type from Prisma Client
import { PrismaService } from "@/services/prisma/prisma.service";
import { handlePrismaError } from "@/common/helpers/functions";
import { UserKey } from "prisma/generated/client";

export type IUserKeyCreate = Pick<UserKey, "userId" | "publicKey" | "privateKey">;

@Injectable()
export class UserKeyProjection {
  constructor(private prisma: PrismaService) {}

  async updateMany(userId: number): Promise<void> {
    try {
      await this.prisma.userKey.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      });
    } catch (error) {
      handlePrismaError("UserKeyProjection", error);
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
      handlePrismaError("UserKeyProjection", error);
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
      handlePrismaError("UserKeyProjection", error);
    }
  }
}
