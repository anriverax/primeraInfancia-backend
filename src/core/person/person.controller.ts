import { Controller, Get, Param, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { IGetPerson } from "./dto/person.type";
//import { PersonDto } from "./dto/person.dto";
// import { CreatePersonCommand } from "./cqrs/commands/create/createPerson.command";
import { GetAllPersonQuery } from "./cqrs/queries/findMany/getAllPerson.query";
import { GetByIdPersonQuery } from "./cqrs/queries/findUnique/getByIdPerson.query";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
// import { DeletePersonCommand } from "./cqrs/commands/delete/deletePerson.command";
// import { UpdatePersonCommand } from "./cqrs/commands/update/updatePerson.command";
import { NestResponse } from "@/common/helpers/dto";
//import { Person } from "@prisma/client";

@Controller()
@UseFilters(HttpExceptionFilter)
export class PersonController {
  constructor(
    private readonly queryBus: QueryBus
    //private readonly commandBus: CommandBus
  ) {}

  // @AuthRequired()
  // @Post("create")
  // async create(@Body() data: PersonDto, @Req() req: Request): Promise<NestResponse<Person>> {
  //   return this.commandBus.execute(
  //     new CreatePersonCommand({ ...data, createdBy: parseInt(req["user"].sub) })
  //   );
  // }

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetPerson[]>> {
    const result = await this.queryBus.execute(new GetAllPersonQuery());

    return {
      statusCode: 200,
      message: "Listado de personas registradas",
      data: result
    };
  }

  @AuthRequired()
  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetPerson>> {
    const result = await this.queryBus.execute(new GetByIdPersonQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Listado de persona por ID",
      data: result
    };
  }

  // @AuthRequired()
  // @Put("update/:id")
  // async update(
  //   @Param("id") id: string,
  //   @Body() data: PersonDto,
  //   @Req() req: Request
  // ): Promise<NestResponse<void>> {
  //   return this.commandBus.execute(
  //     new UpdatePersonCommand({ id: parseInt(id), ...data, updatedBy: parseInt(req["user"].sub) })
  //   );
  // }

  // @AuthRequired()
  // @Delete("delete/:id")
  // async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
  //   return this.commandBus.execute(
  //     new DeletePersonCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
  //   );
  // }
}
