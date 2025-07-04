import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { IGetSchool, SchoolDto } from "./dto/school.dto";
import { CreateSchoolCommand } from "./cqrs/commands/create/createSchool.command";
import { GetAllSchoolQuery } from "./cqrs/queries/findMany/getAllSchool.query";
import { GetByIdSchoolQuery } from "./cqrs/queries/findUnique/getByIdSchool.query";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { DeleteSchoolCommand } from "./cqrs/commands/delete/deleteSchool.command";
import { UpdateSchoolCommand } from "./cqrs/commands/update/updateSchool.command";
import { NestResponse } from "@/common/helpers/dto";
import { School } from "@prisma/client";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SchoolController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: SchoolDto, @Req() req: Request): Promise<NestResponse<School>> {
    return this.commandBus.execute(
      new CreateSchoolCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetSchool[]>> {
    const result = await this.queryBus.execute(new GetAllSchoolQuery());

    return {
      statusCode: 200,
      message: "Listado de centros escolares registrados",
      data: result
    };
  }

  @AuthRequired()
  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetSchool>> {
    const result = await this.queryBus.execute(new GetByIdSchoolQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Listado de centros escolares por ID",
      data: result
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Body() data: SchoolDto,
    @Req() req: Request
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateSchoolCommand({ id: parseInt(id), ...data, updatedBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteSchoolCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }
}
