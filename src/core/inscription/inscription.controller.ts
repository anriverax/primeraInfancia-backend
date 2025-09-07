import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { InscriptionDto, InscriptionPaginationDto } from "./dto/inscription.dto";
import { CreateInscriptionCommand } from "./cqrs/commands/create/createInscription.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Inscription } from "@prisma/client";
import { UpdateInscriptionCommand } from "./cqrs/commands/update/updateInscription.command";
import { DeleteInscriptionCommand } from "./cqrs/commands/delete/deleteInscription.command";
import { GetAllInscriptionQuery } from "./cqrs/queries/findMany/getAllInscription.query";
import { IGetAllInscription, IGetByIdInscription } from "./dto/inscription.type";
import { GetByIdInscriptionQuery } from "./cqrs/queries/findUnique/getByIdInscription.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class InscriptionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: InscriptionDto, @Req() req: Request): Promise<NestResponse<Inscription>> {
    return this.commandBus.execute(
      new CreateInscriptionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: InscriptionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllInscription[]>> {
    const result = await this.queryBus.execute(new GetAllInscriptionQuery(filterPagination));

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
    @Body() data: InscriptionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateInscriptionCommand({
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
      new DeleteInscriptionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdInscription>> {
    const result = await this.queryBus.execute(new GetByIdInscriptionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Inscripción por ID",
      data: result
    };
  }
}
