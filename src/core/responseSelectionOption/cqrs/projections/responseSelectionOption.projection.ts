import { Injectable } from "@nestjs/common";
import { ResponseSelectionOption } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateResponseSelectionOption,
  IDeleteResponseSelectionOption,
  IUpdateResponseSelectionOption
} from "../../dto/responseSelectionOption.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class ResponseSelectionOptionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateResponseSelectionOption): Promise<ResponseSelectionOption> {
    try {
      return await this.prisma.responseSelectionOption.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("ResponseSelectionOptionProjection", error);
    }
  }

  async update(data: IUpdateResponseSelectionOption): Promise<ResponseSelectionOption> {
    const { id, ...props } = data;

    try {
      return await this.prisma.responseSelectionOption.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("ResponseSelectionOptionProjection", error);
    }
  }

  async delete(data: IDeleteResponseSelectionOption): Promise<ResponseSelectionOption> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("responseSelectionOption", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("ResponseSelectionOptionProjection", error);
    }
  }
}
