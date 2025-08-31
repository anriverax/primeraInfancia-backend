import { Injectable } from "@nestjs/common";
import { Instrument } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateInstrument, IDeleteInstrument, IUpdateInstrument } from "../../dto/instrument.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class InstrumentProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateInstrument): Promise<Instrument> {
    try {
      return await this.prisma.instrument.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("InstrumentProjection", error);
    }
  }

  async update(data: IUpdateInstrument): Promise<Instrument> {
    const { id, ...props } = data;

    try {
      return await this.prisma.instrument.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("InstrumentProjection", error);
    }
  }

  async delete(data: IDeleteInstrument): Promise<Instrument> {
    const { id, deletedBy  } = data;

    try {
      return await this.prisma.softDelete("instrument", { id }, { deletedBy  });
    } catch (error) {
      handlePrismaError("InstrumentProjection", error);
    }
  }
}