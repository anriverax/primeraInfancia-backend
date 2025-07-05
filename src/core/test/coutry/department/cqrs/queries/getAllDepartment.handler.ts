import { QueryHandler } from "@nestjs/cqrs";
import { GetAllDepartmentQuery } from "./getAllDepartment.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IDepartmentWithInclude } from "../../dto/department.type";

@QueryHandler(GetAllDepartmentQuery)
export class GetAllDepartmentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IDepartmentWithInclude[]> {
    const departments = await this.prisma.department.findMany({
      include: {
        Municipality: {
          include: {
            District: true
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    return departments;
  }
}
