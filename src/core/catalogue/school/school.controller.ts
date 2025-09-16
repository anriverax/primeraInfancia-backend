import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { PaginationDto } from "@/common/helpers/dto";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Body, Controller, Get, Param, Post, Query, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { IGetAllSchool, IGetByIdSchool } from "./dto/school.type";
import { GetAllSchoolPaginationQuery } from "./cqrs/queries/pagination/getAllSchoolPagination.query";
import { SchoolDto } from "./dto/school.dto";
import { AddShoolCommand } from "./cqrs/commands/addSchool.command";
import { GetByIdSchoolQuery } from "./cqrs/queries/findUnique/getByIdSchool.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SchoolController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Post("add")
  async add(@Body() data: SchoolDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new AddShoolCommand(data));
  }

  @AuthRequired()
  @Get()
  async getAll(
    @Query() filterPagination: PaginationDto
  ): Promise<NestResponseWithPagination<IGetAllSchool[]>> {
    const result = await this.queryBus.execute(new GetAllSchoolPaginationQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de centros escolares registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdSchool>> {
    const result = await this.queryBus.execute(new GetByIdSchoolQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Listado de centro escolar por ID",
      data: result
    };
  }
}
