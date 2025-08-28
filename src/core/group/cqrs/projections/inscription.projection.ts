import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { InscriptionTeacher } from "../../dto/group.type";
import { handlePrismaError } from "@/common/helpers/functions";
import { Inscription } from "@prisma/client";

@Injectable()
export class InscriptionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: InscriptionTeacher): Promise<Inscription> {
    try {
      return await this.prisma.inscription.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("InscriptionProjection", error);
    }
  }
}
