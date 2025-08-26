import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateGroup, IDeleteGroup, IUpdateGroup } from "../../dto/group.type";
import { Group } from "@prisma/client";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class GroupProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateGroup): Promise<Group> {
    try {
      return await this.prisma.group.create({ data: { ...data, departmentId: 2 } });
    } catch (error) {
      handlePrismaError("GroupProjection", error);
    }
  }

  async update(data: IUpdateGroup): Promise<Group> {
    const { id, ...props } = data;

    try {
      return await this.prisma.group.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("GroupProjection", error);
    }
  }

  async delete(data: IDeleteGroup): Promise<Group> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("group", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("GroupProjection", error);
    }
  }
}
