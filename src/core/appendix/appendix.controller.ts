import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AppendixDto, AppendixPaginationDto } from "./dto/appendix.dto";
import { CreateAppendixCommand } from "./cqrs/commands/create/createAppendix.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Appendix } from "@prisma/client";
import { UpdateAppendixCommand } from "./cqrs/commands/update/updateAppendix.command";
import { DeleteAppendixCommand } from "./cqrs/commands/delete/deleteAppendix.command";
import { GetAllAppendixQuery } from "./cqrs/queries/findMany/getAllAppendix.query";
import { IGetAllAppendix, IGetByIdAppendix } from "./dto/appendix.type";
import { GetByIdAppendixQuery } from "./cqrs/queries/findUnique/getByIdAppendix.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppendixController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: AppendixDto, @Req() req: Request): Promise<NestResponse<Appendix>> {
    return this.commandBus.execute(
      new CreateAppendixCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: AppendixPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllAppendix[]>> {
    const result = await this.queryBus.execute(new GetAllAppendixQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de instrumentos registrados.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: AppendixDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateAppendixCommand({
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
      new DeleteAppendixCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdAppendix>> {
    const result = await this.queryBus.execute(new GetByIdAppendixQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Instrumento por ID.",
      data: result
    };
  }
}
