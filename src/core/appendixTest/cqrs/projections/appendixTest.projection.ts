import { Injectable } from "@nestjs/common";
import { AppendixTest } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateAppendixTest,
  IDeleteAppendixTest,
  IUpdateAppendixTest
} from "../../dto/appendixTest.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class AppendixTestProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateAppendixTest): Promise<AppendixTest> {
    try {
      return await this.prisma.appendixTest.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("AppendixTestProjection", error);
    }
  }

  async update(data: IUpdateAppendixTest): Promise<AppendixTest> {
    const { id, ...props } = data;

    try {
      return await this.prisma.appendixTest.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("AppendixTestProjection", error);
    }
  }

  async delete(data: IDeleteAppendixTest): Promise<AppendixTest> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("appendixTest", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("AppendixTestProjection", error);
    }
  }
}
