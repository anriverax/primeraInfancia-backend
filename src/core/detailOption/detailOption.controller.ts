import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { DetailOptionDto, DetailOptionPaginationDto } from "./dto/detailOption.dto";
import { CreateDetailOptionCommand } from "./cqrs/commands/create/createDetailOption.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { DetailOption } from "@prisma/client";
import { UpdateDetailOptionCommand } from "./cqrs/commands/update/updateDetailOption.command";
import { DeleteDetailOptionCommand } from "./cqrs/commands/delete/deleteDetailOption.command";
import { GetAllDetailOptionQuery } from "./cqrs/queries/findMany/getAllDetailOption.query";
import { IGetAllDetailOption, IGetByIdDetailOption } from "./dto/detailOption.type";
import { GetByIdDetailOptionQuery } from "./cqrs/queries/findUnique/getByIdDetailOption.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class DetailOptionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: DetailOptionDto, @Req() req: Request): Promise<NestResponse<DetailOption>> {
    return this.commandBus.execute(
      new CreateDetailOptionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: DetailOptionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllDetailOption[]>> {
    const result = await this.queryBus.execute(new GetAllDetailOptionQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de detalles de las opciones registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: DetailOptionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateDetailOptionCommand({
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
      new DeleteDetailOptionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdDetailOption>> {
    const result = await this.queryBus.execute(new GetByIdDetailOptionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Detalle de la opción por ID.",
      data: result
    };
  }
}
