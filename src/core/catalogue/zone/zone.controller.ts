import { Controller, Get, Param, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { IGetZone } from "./dto/zone.dto";
import { GetAllZoneQuery } from "./cqrs/queries/findMany/getAllZone.query";
import { GetByIdZoneQuery } from "./cqrs/queries/findUnique/getByIdZone.query";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { NestResponse } from "@/common/helpers/types";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ZoneController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetZone[]>> {
    const result = await this.queryBus.execute(new GetAllZoneQuery());

    return {
      statusCode: 200,
      message: "Listado de zonas registradas",
      data: result
    };
  }

  @AuthRequired()
  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetZone>> {
    const result = await this.queryBus.execute(new GetByIdZoneQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Listado de zonas por ID",
      data: result
    };
  }
}
