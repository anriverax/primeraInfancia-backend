import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/services/prisma/prisma.service";
import { GroupLeader } from "@prisma/client";
import { handlePrismaError } from "@/common/helpers/functions";
import { ICreateGroupLeader, IDeleteGroupLeader } from "../../dto/groupLeader.type";

@Injectable()
export class GroupLeaderProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateGroupLeader): Promise<GroupLeader> {
    try {
      return await this.prisma.groupLeader.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("GroupLeaderProjection", error);
    }
  }
  async delete(data: IDeleteGroupLeader): Promise<GroupLeader> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("groupLeader", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("GroupLeaderProjection", error);
    }
  }
}
