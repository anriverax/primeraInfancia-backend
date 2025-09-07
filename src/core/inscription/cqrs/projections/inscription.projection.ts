import { Injectable } from "@nestjs/common";
import { Inscription } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateInscription, IDeleteInscription, IUpdateInscription } from "../../dto/inscription.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class InscriptionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateInscription): Promise<Inscription> {
    try {
      return await this.prisma.inscription.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("InscriptionProjection", error);
    }
  }

  async update(data: IUpdateInscription): Promise<Inscription> {
    const { id, ...props } = data;

    try {
      return await this.prisma.inscription.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("InscriptionProjection", error);
    }
  }

  async delete(data: IDeleteInscription): Promise<Inscription> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("inscription", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("InscriptionProjection", error);
    }
  }
}
