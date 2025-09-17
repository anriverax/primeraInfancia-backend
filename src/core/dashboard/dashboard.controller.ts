import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetSchoolCountsBySectorQuery } from './queries/get-school-counts-by-sector.query';
import { GetSchoolCountsByZoneQuery } from './queries/get-school-counts-by-zone.query';
import { GetTeacherCountsByGenderQuery } from './queries/get-teacher-counts-by-gender.query';

@Controller('/participant')
export class DashboardController {
  constructor(private queryBus: QueryBus) { }

  @Get()
  async getDashboardData() {
    const schoolsBySectorPromise = this.queryBus.execute(new GetSchoolCountsBySectorQuery());
    const schoolsByZonePromise = this.queryBus.execute(new GetSchoolCountsByZoneQuery());
    const teachersByGenderPromise = this.queryBus.execute(new GetTeacherCountsByGenderQuery());

    const [schoolsBySector, schoolsByZone, teacherByGender] = await Promise.all([
      schoolsBySectorPromise,
      schoolsByZonePromise,
      teachersByGenderPromise
    ]);

    return {
      schoolsBySector,
      schoolsByZone,
      teacherByGender,
    };
  }
}