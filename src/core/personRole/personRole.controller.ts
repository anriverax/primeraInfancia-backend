import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PersonRoleDto, PersonRolePaginationDto } from "./dto/personRole.dto";
import { CreatePersonRoleCommand } from "./cqrs/commands/create/createPersonRole.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { PersonRole } from "@prisma/client";
import { UpdatePersonRoleCommand } from "./cqrs/commands/update/updatePersonRole.command";
import { DeletePersonRoleCommand } from "./cqrs/commands/delete/deletePersonRole.command";
import { GetAllPersonRoleQuery } from "./cqrs/queries/findMany/getAllPersonRole.query";
import { IGetAllPersonRole, IGetByIdPersonRole } from "./dto/personRole.type";
import { GetByIdPersonRoleQuery } from "./cqrs/queries/findUnique/getByIdPersonRole.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class PersonRoleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: PersonRoleDto, @Req() req: Request): Promise<NestResponse<PersonRole>> {
    return this.commandBus.execute(
      new CreatePersonRoleCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: PersonRolePaginationDto
  ): Promise<NestResponseWithPagination<IGetAllPersonRole[]>> {
    const result = await this.queryBus.execute(new GetAllPersonRoleQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de cargos del personal registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: PersonRoleDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdatePersonRoleCommand({
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
      new DeletePersonRoleCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdPersonRole>> {
    const result = await this.queryBus.execute(new GetByIdPersonRoleQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Cargo del personal por ID",
      data: result
    };
  }
}
