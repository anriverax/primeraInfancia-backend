import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/services/prisma/prisma.service";
import { GroupLeader } from "@prisma/client";
import { handlePrismaError } from "@/common/helpers/functions";
import { ICreateAssignTypePerson, IDeleteAssignTypePerson } from "../../dto/assignTypePerson.type";

@Injectable()
export class AssignTypePersonProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateAssignTypePerson): Promise<GroupLeader> {
    try {
      return await this.prisma.groupLeader.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("GroupLeaderProjection", error);
    }
  }
  async delete(data: IDeleteAssignTypePerson): Promise<GroupLeader> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("groupLeader", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("GroupLeaderProjection", error);
    }
  }
}
