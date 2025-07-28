import { Injectable } from "@nestjs/common";
import { PersonRole } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreatePersonRole, IDeletePersonRole, IUpdatePersonRole } from "../../dto/personRole.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class PersonRoleProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreatePersonRole): Promise<PersonRole> {
    try {
      return await this.prisma.personRole.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("PersonRoleProjection", error);
    }
  }

  async update(data: IUpdatePersonRole): Promise<PersonRole> {
    const { id, ...props } = data;

    try {
      return await this.prisma.personRole.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("PersonRoleProjection", error);
    }
  }

  async delete(data: IDeletePersonRole): Promise<PersonRole> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("personRole", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("PersonRoleProjection", error);
    }
  }
}
