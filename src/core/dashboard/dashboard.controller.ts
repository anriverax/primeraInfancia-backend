import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetAllSchoolByZoneQuery } from "./cqrs/queries/school/queries/getAllSchoolByZone.query";
import { dashboardPerson } from "./dto/dashboard.type";
import { GetAllSchoolByDepartmentQuery } from "./cqrs/queries/school/queries/getAllSchoolByDepartment.query";
import { GetAllSchoolQuery } from "./cqrs/queries/school/queries/getAllSchool.query";
import { GetAllPersonByTypePersonQuery } from "./cqrs/queries/person/queries/getAllPersonByTypePerson.query";
import { DashboardService } from "./services/dashboard.service";
import { GetAllBirthdateQuery } from "./cqrs/queries/person/queries/getAllBirthdate.query";
import { GetAllTeacherByCareerQuery } from "./cqrs/queries/person/queries/getAllTeacherByCareer.query";
import { GetAllTeacherBySexQuery } from "./cqrs/queries/person/queries/getAllTeacherBySex.query";
import { GetAllTeacherByNipQuery } from "./cqrs/queries/person/queries/getAllTeacherByNip.query";

@Controller()
export class DashboardController {
  constructor(
    private queryBus: QueryBus,
    private dashboardService: DashboardService
  ) {}

  @Get("/participant")
  async getDashboardData(): Promise<dashboardPerson> {
    const schoolsByZone = await this.queryBus.execute(new GetAllSchoolByZoneQuery());
    const schoolsByDepartment = await this.queryBus.execute(new GetAllSchoolByDepartmentQuery());
    const allSchool = await this.queryBus.execute(new GetAllSchoolQuery());
    const allPerson = await this.queryBus.execute(new GetAllPersonByTypePersonQuery());
    const getAllAges = await this.queryBus.execute(new GetAllBirthdateQuery());
    const teachersByCareer = await this.queryBus.execute(new GetAllTeacherByCareerQuery());
    const teachersBySex = await this.queryBus.execute(new GetAllTeacherBySexQuery());
    const teachersByNip = await this.queryBus.execute(new GetAllTeacherByNipQuery());

    const ages = this.dashboardService.calculateAge(getAllAges);

    return {
      zone: schoolsByZone,
      department: schoolsByDepartment,
      career: teachersByCareer,
      sex: teachersBySex,
      nip: teachersByNip,
      ages,
      total: {
        school: allSchool,
        teacher: allPerson
      }
    };
  }
}
