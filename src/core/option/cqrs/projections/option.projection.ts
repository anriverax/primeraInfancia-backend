import { Injectable } from "@nestjs/common";
import { Option } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateOption, IDeleteOption, IUpdateOption } from "../../dto/option.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class OptionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateOption): Promise<Option> {
    try {
      return await this.prisma.option.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("OptionProjection", error);
    }
  }

  async update(data: IUpdateOption): Promise<Option> {
    const { id, ...props } = data;

    try {
      return await this.prisma.option.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("OptionProjection", error);
    }
  }

  async delete(data: IDeleteOption): Promise<Option> {
    const { id, deletedBy  } = data;

    try {
      return await this.prisma.softDelete("option", { id }, { deletedBy  });
    } catch (error) {
      handlePrismaError("OptionProjection", error);
    }
  }
}