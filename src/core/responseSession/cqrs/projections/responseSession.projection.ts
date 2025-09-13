import { Injectable } from "@nestjs/common";
import { ResponseSession } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateResponseSession,
  IDeleteResponseSession,
  IUpdateResponseSession
} from "../../dto/responseSession.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class ResponseSessionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateResponseSession): Promise<ResponseSession> {
    try {
      return await this.prisma.responseSession.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("ResponseSessionProjection", error);
    }
  }

  async update(data: IUpdateResponseSession): Promise<ResponseSession> {
    const { id, ...props } = data;

    try {
      return await this.prisma.responseSession.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("ResponseSessionProjection", error);
    }
  }

  async delete(data: IDeleteResponseSession): Promise<ResponseSession> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("responseSession", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("ResponseSessionProjection", error);
    }
  }
}
