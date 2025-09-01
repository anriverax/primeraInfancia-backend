import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ResponseSessionDto, ResponseSessionPaginationDto } from "./dto/responseSession.dto";
import { CreateResponseSessionCommand } from "./cqrs/commands/create/createResponseSession.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { ResponseSession } from "@prisma/client";
import { UpdateResponseSessionCommand } from "./cqrs/commands/update/updateResponseSession.command";
import { DeleteResponseSessionCommand } from "./cqrs/commands/delete/deleteResponseSession.command";
import { GetAllResponseSessionQuery } from "./cqrs/queries/findMany/getAllResponseSession.query";
import { IGetAllResponseSession, IGetByIdResponseSession } from "./dto/responseSession.type";
import { GetByIdResponseSessionQuery } from "./cqrs/queries/findUnique/getByIdResponseSession.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ResponseSessionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: ResponseSessionDto,
    @Req() req: Request
  ): Promise<NestResponse<ResponseSession>> {
    return this.commandBus.execute(
      new CreateResponseSessionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: ResponseSessionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllResponseSession[]>> {
    const result = await this.queryBus.execute(new GetAllResponseSessionQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de aplicación de instrumentos.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: ResponseSessionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateResponseSessionCommand({
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
      new DeleteResponseSessionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdResponseSession>> {
    const result = await this.queryBus.execute(new GetByIdResponseSessionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Aplicación de instrumento por ID.",
      data: result
    };
  }
}
