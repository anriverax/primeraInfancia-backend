import { Body, Controller, Get, Post, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Municipality } from "@prisma/client";
import { MunicipalityDto } from "./dto/municipality.dto";
import { GetAllMunicipalityQuery } from "./cqrs/queries/getAllMunicipality.query";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { NestResponse } from "@/common/helpers/types";
import { AddMunicipalityCommand } from "./cqrs/command/addMunicipality.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class MunicipalityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("add")
  async add(@Body() data: MunicipalityDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new AddMunicipalityCommand(data));
  }

  @Get()
  async getAll(): Promise<NestResponse<Municipality[]>> {
    return this.queryBus.execute(new GetAllMunicipalityQuery());
  }
}
