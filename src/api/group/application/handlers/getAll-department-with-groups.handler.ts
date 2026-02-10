import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllDepartmentWithGroupsQuery } from "../queries/getAll-department-with-groups.query";
import { IGroupListResponse } from "../dto/group.type";
import { IDepartmentRepository } from "@/api/catalogue/department/domain/department.repository.port";
import { Inject } from "@nestjs/common";

@QueryHandler(GetAllDepartmentWithGroupsQuery)
export class GetAllDepartmentWithGroupsHandler implements IQueryHandler<GetAllDepartmentWithGroupsQuery> {
  constructor(
    @Inject("IDepartmentRepository") private readonly departmentRepository: IDepartmentRepository
  ) {}
  async execute(): Promise<IGroupListResponse[]> {
    const departmentGroupList = await this.departmentRepository.findMany<IGroupListResponse>({
      select: {
        id: true,
        name: true,
        Group: {
          select: {
            id: true,
            name: true,
            memberCount: true
          }
        }
      }
    });

    return departmentGroupList;
  }
}
