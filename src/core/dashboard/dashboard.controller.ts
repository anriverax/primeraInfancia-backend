import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetSchoolCountsBySectorQuery } from "./queries/get-school-counts-by-sector.query";
import { GetSchoolCountsByZoneQuery } from "./queries/get-school-counts-by-zone.query";
import { GetSchoolCountsByDepartmentQuery } from "./queries/get-school-counts-by-department.query";
import { GetTeacherCountsByGenderQuery } from "./queries/get-teacher-counts-by-gender.query";
import { GetTeacherCountsByCareerQuery } from "./queries/get-teacher-counts-by-career.query";
import { GetTeacherCountsByDepartmentQuery } from "./queries/get-teacher-counts-by-department.query";

@Controller("/participant")
export class DashboardController {
  constructor(private queryBus: QueryBus) { }

  @Get()
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async getDashboardData(): Promise<{
    schoolsBySector: any;
    schoolsByZone: any;
    schoolsByDepartament: any;
    teacherByGender: any;
    teachersByCareer: any;
    teachersByDepartment: any;
  }> {
    const schoolsBySectorPromise = this.queryBus.execute(new GetSchoolCountsBySectorQuery());
    const schoolsByZonePromise = this.queryBus.execute(new GetSchoolCountsByZoneQuery());
    const schoolsByDepartamentPromise = this.queryBus.execute(new GetSchoolCountsByDepartmentQuery());
    const teachersByGenderPromise = this.queryBus.execute(new GetTeacherCountsByGenderQuery());
    const teachersByCareerPromise = this.queryBus.execute(new GetTeacherCountsByCareerQuery());
    const teachersByDepartmentPromise = this.queryBus.execute(new GetTeacherCountsByDepartmentQuery());

    const [
      schoolsBySector,
      schoolsByZone,
      schoolsByDepartament,
      teacherByGender,
      teachersByCareer,
      teachersByDepartment
    ] = await Promise.all([
      schoolsBySectorPromise,
      schoolsByZonePromise,
      schoolsByDepartamentPromise,
      teachersByGenderPromise,
      teachersByCareerPromise,
      teachersByDepartmentPromise
    ]);

    return {
      schoolsBySector,
      schoolsByZone,
      schoolsByDepartament,
      teacherByGender,
      teachersByCareer,
      teachersByDepartment
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
