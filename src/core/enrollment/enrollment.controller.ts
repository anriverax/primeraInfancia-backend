import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EnrollmentDto, EnrollmentPaginationDto } from "./dto/enrollment.dto";
import { CreateEnrollmentCommand } from "./cqrs/commands/create/createEnrollment.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { Enrollment } from "@prisma/client";
import { UpdateEnrollmentCommand } from "./cqrs/commands/update/updateEnrollment.command";
import { DeleteEnrollmentCommand } from "./cqrs/commands/delete/deleteEnrollment.command";
import { GetAllEnrollmentQuery } from "./cqrs/queries/findMany/getAllEnrollment.query";
import { IGetAllEnrollment, IGetByIdEnrollment } from "./dto/enrollment.type";
import { GetByIdEnrollmentQuery } from "./cqrs/queries/findUnique/getByIdEnrollment.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class EnrollmentController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: EnrollmentDto, @Req() req: Request): Promise<NestResponse<Enrollment>> {
    return this.commandBus.execute(
      new CreateEnrollmentCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: EnrollmentPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllEnrollment[]>> {
    const result = await this.queryBus.execute(new GetAllEnrollmentQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de inscripciones registradas",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: EnrollmentDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateEnrollmentCommand({
        id: parseInt(id),
        ...data,
        updatedBy: parseInt(req["user"].sub)
      })
    );
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteEnrollmentCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdEnrollment>> {
    const result = await this.queryBus.execute(new GetByIdEnrollmentQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Inscripción por ID",
      data: result
    };
  }
}
