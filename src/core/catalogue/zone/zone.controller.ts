import { Controller, Get, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { IGetZoneWithDept } from "./dto/zone.dto";
import { GetAllZoneQuery } from "./cqrs/queries/findMany/getAllZone.query";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { NestResponse } from "@/common/helpers/types";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ZoneController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetZoneWithDept[]>> {
    const result = await this.queryBus.execute(new GetAllZoneQuery());

    return {
      statusCode: 200,
      message: "Listado de zonas registradas",
      data: result
    };
  }
}
