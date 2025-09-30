import { Controller, Get, Post } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetSchoolCountsBySectorQuery } from "./queries/get-school-counts-by-sector.query";
import { GetSchoolCountsByZoneQuery } from "./queries/get-school-counts-by-zone.query";
import { GetSchoolCountsByDepartmentQuery } from "./queries/get-school-counts-by-department.query";
import { GetTeacherCountsByGenderQuery } from "./queries/get-teacher-counts-by-gender.query";
import { GetTeacherCountsByCareerQuery } from "./queries/get-teacher-counts-by-career.query";
import { GetTeacherCountsByDepartmentQuery } from "./queries/get-teacher-counts-by-department.query";
import { GetAppendix8Query } from "./queries/get-appendix8.query";
import { GetTeacherCountsByYearsExperienceQuery } from "./queries/get-teacher-counts-by-years-experience.query";
import { GetTeacherCountsByAgeChildrenQuery } from "./queries/get-teacher-counts-by-age-children.query";
import { GetTeacherCountsByEducationalLevelServedQuery } from "./queries/get-teacher-counts-by-educational-level-served.query";
import { GetAppendixByMentorQuery } from "./queries/get-appendix-by-mentor.query";

@Controller("/participant")
export class DashboardController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async getDashboardData(): Promise<{
    schoolsBySector: any;
    schoolsByZone: any;
    schoolsByDepartament: any;
    teacherByGender: any;
    teachersByCareer: any;
    teachersByDepartment: any;
    teachersByYearsExperience: any;
    teachersByAgeChildren: any;
    teacherByEducationalLevelServed: any;
    answerAppendixByMentor: any;
  }> {
    const schoolsBySectorPromise = this.queryBus.execute(new GetSchoolCountsBySectorQuery());
    const schoolsByZonePromise = this.queryBus.execute(new GetSchoolCountsByZoneQuery());
    const schoolsByDepartamentPromise = this.queryBus.execute(new GetSchoolCountsByDepartmentQuery());
    const teachersByGenderPromise = this.queryBus.execute(new GetTeacherCountsByGenderQuery());
    const teachersByCareerPromise = this.queryBus.execute(new GetTeacherCountsByCareerQuery());
    const teachersByDepartmentPromise = this.queryBus.execute(new GetTeacherCountsByDepartmentQuery());
    const teachersByYearsExperiencePromise = this.queryBus.execute(
      new GetTeacherCountsByYearsExperienceQuery()
    );
    const GetTeacherCountsByAgeChildrenPromise = this.queryBus.execute(
      new GetTeacherCountsByAgeChildrenQuery()
    );
    const GetTeacherCountsByEducationalLevelServedPromise = this.queryBus.execute(
      new GetTeacherCountsByEducationalLevelServedQuery()
    );
    const appendixByMentorPromise = this.queryBus.execute(new GetAppendixByMentorQuery());

    const [
      schoolsBySector,
      schoolsByZone,
      schoolsByDepartament,
      teacherByGender,
      teachersByCareer,
      teachersByDepartment,
      teachersByYearsExperience,
      teachersByAgeChildren,
      teacherByEducationalLevelServed,
      appendixByMentor,
    ] = await Promise.all([
      schoolsBySectorPromise,
      schoolsByZonePromise,
      schoolsByDepartamentPromise,
      teachersByGenderPromise,
      teachersByCareerPromise,
      teachersByDepartmentPromise,
      teachersByYearsExperiencePromise,
      GetTeacherCountsByAgeChildrenPromise,
      GetTeacherCountsByEducationalLevelServedPromise,
      appendixByMentorPromise,
    ]);

    return {
      schoolsBySector,
      schoolsByZone,
      schoolsByDepartament,
      teacherByGender,
      teachersByCareer,
      teachersByDepartment,
      teachersByYearsExperience,
      teachersByAgeChildren,
      teacherByEducationalLevelServed,
      appendixByMentor
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  @Post("")
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async getDashboardAppendix8Data(): Promise<{
    answerAppendix8: any;
  }> {
    const answerAppendix8Promise = this.queryBus.execute(new GetAppendix8Query());

    const [answerAppendix8] = await Promise.all([answerAppendix8Promise]);

    return {
      answerAppendix8
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
