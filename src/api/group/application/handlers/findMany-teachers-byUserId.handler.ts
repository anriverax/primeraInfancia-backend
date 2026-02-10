import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindManyTeachersByUserIdQuery } from "../queries/findMany-teachers-byUserId.query";
import { Inject } from "@nestjs/common";
import { IGroupStaffRepository } from "../../domain/ports/groupStaff.respository.port";
/* eslint-disable @typescript-eslint/no-explicit-any */
@QueryHandler(FindManyTeachersByUserIdQuery)
export class FindManyTeachersByUserIdHandler implements IQueryHandler<FindManyTeachersByUserIdQuery> {
  constructor(
    @Inject("IGroupStaffRepository") private readonly groupStaffRepository: IGroupStaffRepository
  ) {}
  async execute(query: FindManyTeachersByUserIdQuery): Promise<any[]> {
    console.log("Executing FindManyTeachersByUserIdHandler with userId:", query.userId);
    const teacherList = await this.groupStaffRepository.findMany<any>({
      where: {
        Person: {
          User: {
            id: query.userId
          }
        }
      },
      select: {
        id: true,
        Teacher: {
          select: {
            id: true,
            Person: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
                User: {
                  select: {
                    email: true
                  }
                }
              }
            },
            School: {
              select: {
                name: true,
                District: {
                  select: {
                    name: true,
                    Municipality: {
                      select: {
                        name: true,
                        Department: {
                          select: {
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
        }
      }
    });

    const formattedTeacherList = teacherList.flatMap((groupStaff: any) => {
      return groupStaff.Teacher.map((teacher: any) => ({
        id: teacher.id,
        Person: {
          id: teacher.Person.id,
          fullName: teacher.Person.fullName,
          phoneNumber: teacher.Person.phoneNumber,
          email: teacher.Person.User.email,
          school: teacher.School.name,
          district: teacher.School.District.name,
          municipality: teacher.School.District.Municipality.name,
          department: teacher.School.District.Municipality.Department.name
        }
      }));
    });

    return formattedTeacherList;
  }
}
