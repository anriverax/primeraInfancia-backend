import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EnrollmentMentorDto, EnrollmentMentorPaginationDto } from "./dto/enrollmentMentor.dto";
import { CreateEnrollmentMentorCommand } from "./cqrs/commands/create/createEnrollmentMentor.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { EnrollmentMentor } from "@prisma/client";
import { UpdateEnrollmentMentorCommand } from "./cqrs/commands/update/updateEnrollmentMentor.command";
import { DeleteEnrollmentMentorCommand } from "./cqrs/commands/delete/deleteEnrollmentMentor.command";
import { GetAllEnrollmentMentorQuery } from "./cqrs/queries/findMany/getAllEnrollmentMentor.query";
import { IGetAllEnrollmentMentor, IGetByIdEnrollmentMentor } from "./dto/enrollmentMentor.type";
import { GetByIdEnrollmentMentorQuery } from "./cqrs/queries/findUnique/getByIdEnrollmentMentor.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class EnrollmentMentorController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: EnrollmentMentorDto,
    @Req() req: Request
  ): Promise<NestResponse<EnrollmentMentor>> {
    return this.commandBus.execute(
      new CreateEnrollmentMentorCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: EnrollmentMentorPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllEnrollmentMentor[]>> {
    const result = await this.queryBus.execute(new GetAllEnrollmentMentorQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de pmentor del grupo registradas",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: EnrollmentMentorDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateEnrollmentMentorCommand({
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
      new DeleteEnrollmentMentorCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdEnrollmentMentor>> {
    const result = await this.queryBus.execute(new GetByIdEnrollmentMentorQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Mentor del grupo por ID",
      data: result
    };
  }
}
