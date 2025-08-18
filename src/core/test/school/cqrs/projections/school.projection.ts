import { PrismaService } from "@/services/prisma/prisma.service";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { School } from "@prisma/client";
import { ISchool } from "../../dto/school.type";

@Injectable()
export class SchoolProjection {
  private readonly logger = new Logger("SchoolProjection");
  constructor(private prisma: PrismaService) {}

  async add(data: ISchool): Promise<School> {
    try {
      return await this.prisma.school.create({ data });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }
  }
}
