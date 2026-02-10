import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ISchoolList } from "../application/dto/school.type";
import { GetAllSchoolQuery } from "../application/queries/getAll-school.query";

@Controller("/dashboard")
export class DashboardController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get("schools")
  async getAllSchools(): Promise<ISchoolList[]> {
    const plannedEventId = await this.queryBus.execute(new GetAllSchoolQuery());

    return plannedEventId;
  }
}
