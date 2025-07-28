import { Injectable } from "@nestjs/common";
import { GroupTrainer } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateGroupTrainer,
  IDeleteGroupTrainer,
  IUpdateGroupTrainer
} from "../../dto/groupTrainer.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class GroupTrainerProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateGroupTrainer): Promise<GroupTrainer> {
    try {
      return await this.prisma.groupTrainer.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("GroupTrainerProjection", error);
    }
  }

  async update(data: IUpdateGroupTrainer): Promise<GroupTrainer> {
    const { id, ...props } = data;

    try {
      return await this.prisma.groupTrainer.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("GroupTrainerProjection", error);
    }
  }

  async delete(data: IDeleteGroupTrainer): Promise<GroupTrainer> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("groupTrainer", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("GroupTrainerProjection", error);
    }
  }
}
