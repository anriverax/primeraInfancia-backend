import { Injectable } from "@nestjs/common";
import { School } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateSchool, IDeleteSchool, IUpdateSchool } from "../../dto/school.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class SchoolProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateSchool): Promise<School> {
    try {
      return await this.prisma.school.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("SchoolProjection", error);
    }
  }

  async update(data: IUpdateSchool): Promise<School> {
    const { id, name, sector, districtId, address, email, coordenates, phoneNumber, updatedBy } = data;

    try {
      return await this.prisma.school.update({
        where: { id },
        data: { name, sector, districtId, address, email, coordenates, phoneNumber, updatedBy }
      });
    } catch (error) {
      handlePrismaError("SchoolProjection", error);
    }
  }

  async delete(data: IDeleteSchool): Promise<School> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("school", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("SchoolProjection", error);
    }
  }
}
