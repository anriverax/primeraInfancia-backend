import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/services/prisma/prisma.service";
import { handlePrismaError } from "@/common/helpers/functions";
import { IInscription } from "../../dto/assignTypePerson.type";

@Injectable()
export class InscriptionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: IInscription[]): Promise<{ count: number }> {
    try {
      return await this.prisma.inscription.createMany({ data });
    } catch (error) {
      handlePrismaError("InscriptionProjection", error);
    }
  }
}
