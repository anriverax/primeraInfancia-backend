import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { OptionDto, OptionPaginationDto } from "./dto/option.dto";
import { CreateOptionCommand } from "./cqrs/commands/create/createOption.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Option } from "@prisma/client";
import { UpdateOptionCommand } from "./cqrs/commands/update/updateOption.command";
import { DeleteOptionCommand } from "./cqrs/commands/delete/deleteOption.command";
import { GetAllOptionQuery } from "./cqrs/queries/findMany/getAllOption.query";
import { IGetAllOption, IGetByIdOption } from "./dto/option.type";
import { GetByIdOptionQuery } from "./cqrs/queries/findUnique/getByIdOption.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class OptionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: OptionDto, @Req() req: Request): Promise<NestResponse<Option>> {
    return this.commandBus.execute(
      new CreateOptionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: OptionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllOption[]>> {
    const result = await this.queryBus.execute(new GetAllOptionQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de opciones registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: OptionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateOptionCommand({
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
      new DeleteOptionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdOption>> {
    const result = await this.queryBus.execute(new GetByIdOptionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Opción por ID.",
      data: result
    };
  }
}
