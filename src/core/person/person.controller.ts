import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { PersonDto, PersonPaginationDto } from "./dto/person.dto";
import { CreatePersonCommand } from "./cqrs/commands/create/createPerson.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Person } from "@prisma/client";
import { UpdatePersonCommand } from "./cqrs/commands/update/updatePerson.command";
import { DeletePersonCommand } from "./cqrs/commands/delete/deletePerson.command";
import { GetAllPersonQuery } from "./cqrs/queries/findMany/getAllPerson.query";
import { IGetAllPerson, IGetByIdPerson } from "./dto/person.type";
import { GetByIdPersonQuery } from "./cqrs/queries/findUnique/getByIdPerson.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class PersonController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: PersonDto, @Req() req: Request): Promise<NestResponse<Person>> {
    return this.commandBus.execute(
      new CreatePersonCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: PersonPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllPerson[]>> {
    const result = await this.queryBus.execute(new GetAllPersonQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de personas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: PersonDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdatePersonCommand({
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
      new DeletePersonCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdPerson>> {
    const result = await this.queryBus.execute(new GetByIdPersonQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Persona por ID.",
      data: result
    };
  }
}
