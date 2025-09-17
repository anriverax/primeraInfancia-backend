import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetSchoolCountsBySectorQuery } from './queries/get-school-counts-by-sector.query';
import { GetSchoolCountsByZoneQuery } from './queries/get-school-counts-by-zone.query';

@Controller('/participant')
export class DashboardController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async getDashboardData() {
    const schoolsBySectorPromise = this.queryBus.execute(new GetSchoolCountsBySectorQuery());
    const schoolsByZonePromise = this.queryBus.execute(new GetSchoolCountsByZoneQuery());

    const [schoolsBySector, schoolsByZone] = await Promise.all([
      schoolsBySectorPromise,
      schoolsByZonePromise,
    ]);

    return {
      schoolsBySector,
      schoolsByZone,
    };
  }
}