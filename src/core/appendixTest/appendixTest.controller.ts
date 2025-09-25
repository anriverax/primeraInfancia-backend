import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AppendixTestDto, AppendixTestPaginationDto } from "./dto/appendixTest.dto";
import { CreateAppendixTestCommand } from "./cqrs/commands/create/createAppendixTest.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { AppendixTest } from "@prisma/client";
import { UpdateAppendixTestCommand } from "./cqrs/commands/update/updateAppendixTest.command";
import { DeleteAppendixTestCommand } from "./cqrs/commands/delete/deleteAppendixTest.command";
import { GetAllAppendixTestQuery } from "./cqrs/queries/findMany/getAllAppendixTest.query";
import { GetByIdAppendixTestQuery } from "./cqrs/queries/findUnique/getByIdAppendixTest.query";
import { IGetAllAppendixTest, IGetByIdAppendixTest } from "./dto/appendixTest.type";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppendixTestController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: AppendixTestDto, @Req() req: Request): Promise<NestResponse<AppendixTest>> {
    return this.commandBus.execute(
      new CreateAppendixTestCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: AppendixTestPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllAppendixTest[]>> {
    const result = await this.queryBus.execute(new GetAllAppendixTestQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de anexos registrados.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: AppendixTestDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateAppendixTestCommand({
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
      new DeleteAppendixTestCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdAppendixTest>> {
    const result = await this.queryBus.execute(new GetByIdAppendixTestQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Anexo por ID.",
      data: result
    };
  }
}
