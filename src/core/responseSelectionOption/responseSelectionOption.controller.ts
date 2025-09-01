import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ResponseSelectionOptionDto, ResponseSelectionOptionPaginationDto } from "./dto/responseSelectionOption.dto";
import { CreateResponseSelectionOptionCommand } from "./cqrs/commands/create/createResponseSelectionOption.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { ResponseSelectionOption } from "@prisma/client";
import { UpdateResponseSelectionOptionCommand } from "./cqrs/commands/update/updateResponseSelectionOption.command";
import { DeleteResponseSelectionOptionCommand } from "./cqrs/commands/delete/deleteResponseSelectionOption.command";
import { GetAllResponseSelectionOptionQuery } from "./cqrs/queries/findMany/getAllResponseSelectionOption.query";
import { IGetAllResponseSelectionOption, IGetByIdResponseSelectionOption } from "./dto/responseSelectionOption.type";
import { GetByIdResponseSelectionOptionQuery } from "./cqrs/queries/findUnique/getByIdResponseSelectionOption.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ResponseSelectionOptionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: ResponseSelectionOptionDto, @Req() req: Request): Promise<NestResponse<ResponseSelectionOption>> {
    return this.commandBus.execute(
      new CreateResponseSelectionOptionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: ResponseSelectionOptionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllResponseSelectionOption[]>> {
    const result = await this.queryBus.execute(new GetAllResponseSelectionOptionQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de drespuestas a las opciones registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: ResponseSelectionOptionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateResponseSelectionOptionCommand({
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
      new DeleteResponseSelectionOptionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdResponseSelectionOption>> {
    const result = await this.queryBus.execute(new GetByIdResponseSelectionOptionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Respuesta a las opciones por ID.",
      data: result
    };
  }
}
