import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetSchoolCountsBySectorQuery } from "./queries/get-school-counts-by-sector.query";
import { GetSchoolCountsByZoneQuery } from "./queries/get-school-counts-by-zone.query";
import { GetTeacherCountsByGenderQuery } from "./queries/get-teacher-counts-by-gender.query";
import { GetTeacherCountsByCareerQuery } from "./queries/get-teacher-counts-by-career.query";
import { GetTeacherCountsByDepartmentQuery } from "./queries/get-teacher-counts-by-department.query";
import { GetSchoolCountsByDepartmentQuery } from "./queries/get-school-counts-by-department.query";

@Controller("/participant")
export class DashboardController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async getDashboardData() {
    const schoolsBySectorPromise = this.queryBus.execute(new GetSchoolCountsBySectorQuery());
    const schoolsByZonePromise = this.queryBus.execute(new GetSchoolCountsByZoneQuery());
    const teachersByGenderPromise = this.queryBus.execute(new GetTeacherCountsByGenderQuery());
    const teachersByCareerPromise = this.queryBus.execute(new GetTeacherCountsByCareerQuery());
    const teachersByDepartmentPromise = this.queryBus.execute(new GetTeacherCountsByDepartmentQuery());
    const schoolsByDepartamentPromise = this.queryBus.execute(new GetSchoolCountsByDepartmentQuery());

    const [
      schoolsBySector,
      schoolsByZone,
      teacherByGender,
      teachersByCareer,
      teachersByDepartment,
      schoolsByDepartament
    ] = await Promise.all([
      schoolsBySectorPromise,
      schoolsByZonePromise,
      teachersByGenderPromise,
      teachersByCareerPromise,
      teachersByDepartmentPromise,
      schoolsByDepartamentPromise
    ]);

    return {
      schoolsBySector,
      schoolsByZone,
      teacherByGender,
      teachersByCareer,
      teachersByDepartment,
      schoolsByDepartament
    };
  }
}
