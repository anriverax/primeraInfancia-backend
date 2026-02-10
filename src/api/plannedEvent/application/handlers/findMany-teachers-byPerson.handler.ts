import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindManyTeachersByPersonQuery } from "../queries/findMany-teachers-byPerson.query";
import { ITeacher, ITeacherListWithSchool } from "../dto/plannedEvent.type";
import { PlannedEventDomainService } from "../../domain/services/plannedEventDomain.services";
import { IGroupStaffRepository } from "@/api/group/domain/ports/groupStaff.respository.port";

interface IGroupStaffResponse {
  id: number;
  Teacher: ITeacher[];
}

@QueryHandler(FindManyTeachersByPersonQuery)
export class FindManyTeachersByPersonHandler implements IQueryHandler<FindManyTeachersByPersonQuery> {
  constructor(
    @Inject("IGroupStaffRepository")
    private readonly groupStaffRepository: IGroupStaffRepository,
    private readonly plannedEventDomainService: PlannedEventDomainService
  ) {}

  async execute(query: FindManyTeachersByPersonQuery): Promise<ITeacherListWithSchool[] | []> {
    const { userId } = query;

    const teachers = await this.groupStaffRepository.findFirst<IGroupStaffResponse>({
      where: {
        Person: {
          deletedAt: null,
          User: { id: userId, deletedAt: null }
        }
      },
      select: {
        id: true,
        Teacher: {
          select: {
            id: true,
            deletedAt: true,
            Person: {
              select: {
                firstName: true,
                lastName1: true,
                lastName2: true,
                PrincipalSchool: {
                  select: {
                    deletedAt: true,
                    School: {
                      select: {
                        code: true,
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teachers) {
      return [];
    }

    const formattedTeachers = this.plannedEventDomainService.formattedTeachers(teachers.Teacher);

    return formattedTeachers;
  }
}
