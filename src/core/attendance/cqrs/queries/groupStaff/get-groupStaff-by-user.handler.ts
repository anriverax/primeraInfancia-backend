import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetGroupStaffByUserQuery } from "./get-groupStaff-by-user.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GroupStaffByUser } from "@/core/attendance/dto/attendance.type";

@QueryHandler(GetGroupStaffByUserQuery)
export class GetGroupStaffByUserHandler implements IQueryHandler<GetGroupStaffByUserQuery> {
  constructor(private readonly prisma: PrismaService) {}
  async execute(query: GetGroupStaffByUserQuery): Promise<GroupStaffByUser[] | []> {
    // Implementation goes here
    const groupStaff = await this.prisma.groupStaff.findMany({
      where: {
        Person: {
          User: {
            id: query.userId
          }
        }
      },
      select: {
        id: true,
        groupId: true,
        personId: true,
        parentId: true
      }
    });

    return groupStaff;
  }
}
