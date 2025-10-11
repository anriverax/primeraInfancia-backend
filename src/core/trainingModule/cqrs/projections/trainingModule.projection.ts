import { Injectable } from "@nestjs/common";
import { TrainingModule } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateTrainingModule,
  IDeleteTrainingModule,
  IUpdateTrainingModule
} from "../../dto/trainingModule.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class TrainingModuleProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateTrainingModule): Promise<TrainingModule> {
    try {
      return await this.prisma.trainingModule.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("TrainingModuleProjection", error);
    }
  }

  async update(data: IUpdateTrainingModule): Promise<TrainingModule> {
    const { id, ...props } = data;

    try {
      return await this.prisma.trainingModule.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("TrainingModuleProjection", error);
    }
  }

  async delete(data: IDeleteTrainingModule): Promise<TrainingModule> {
    const { id } = data;

    try {
      return await this.prisma.softDelete("trainingModule", { id });
    } catch (error) {
      handlePrismaError("TrainingModuleProjection", error);
    }
  }
}
