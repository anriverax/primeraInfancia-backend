import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllSchoolQuery } from "../queries/getAll-school.query";
import { Inject } from "@nestjs/common";
import { ISchoolList, ISchoolListResponse } from "../dto/school.type";
import { ISchoolRepository } from "@/api/catalogue/school/domain/school.repository.port";

interface ITeacher {
  deletedAt: Date | null;
}
@QueryHandler(GetAllSchoolQuery)
export class GetAllSchoolHandler implements IQueryHandler<GetAllSchoolQuery> {
  constructor(@Inject("ISchoolRepository") private readonly schoolRepository: ISchoolRepository) {}
  async execute(): Promise<ISchoolList[]> {
    const schoolList = await this.schoolRepository.findMany<ISchoolListResponse>({
      select: {
        id: true,
        code: true,
        name: true,
        zone: true,
        coordenates: true,
        Cohort: {
          select: {
            id: true,
            name: true
          }
        },
        District: {
          select: {
            name: true,
            Municipality: {
              select: {
                name: true,
                Department: {
                  select: { name: true, Zone: { select: { name: true } } }
                }
              }
            }
          }
        },
        Teacher: {
          select: {
            deletedAt: true
          }
        }
      }
    });

    const formatSchoolList = schoolList.map((school: ISchoolListResponse) => {
      const filteredPrincipals = school.Teacher.filter((t: ITeacher) => t.deletedAt === null);
      /*
      if (filteredPrincipals.length > 0) {
        const filteredTeachers = filteredPrincipals.map((t: ITeacher) => t.Person.deletedAt === null);

        teachersCount = filteredTeachers.length;
      }
*/
      return {
        id: school.id,
        code: school.code,
        name: school.name,
        zone: school.zone,
        coordenates: school.coordenates,
        Cohort: {
          id: school.Cohort.id,
          name: school.Cohort.name
        },
        districtName: school.District.name,
        municipalityName: school.District.Municipality.name,
        departmentName: school.District.Municipality.Department.name,
        region: school.District.Municipality.Department.Zone.name,
        teachersCount: filteredPrincipals.length
      };
    });

    return formatSchoolList;
  }
}
