import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MultipleAnswerDto, MultipleAnswerPaginationDto } from "./dto/multipleAnswer.dto";
import { CreateMultipleAnswerCommand } from "./cqrs/commands/create/createMultipleAnswer.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { MultipleAnswer } from "@prisma/client";
import { UpdateMultipleAnswerCommand } from "./cqrs/commands/update/updateMultipleAnswer.command";
import { DeleteMultipleAnswerCommand } from "./cqrs/commands/delete/deleteMultipleAnswer.command";
import { GetAllMultipleAnswerQuery } from "./cqrs/queries/findMany/getAllMultipleAnswer.query";
import { IGetAllMultipleAnswer, IGetByIdMultipleAnswer } from "./dto/multipleAnswer.type";
import { GetByIdMultipleAnswerQuery } from "./cqrs/queries/findUnique/getByIdMultipleAnswer.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class MultipleAnswerController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: MultipleAnswerDto,
    @Req() req: Request
  ): Promise<NestResponse<MultipleAnswer>> {
    return this.commandBus.execute(
      new CreateMultipleAnswerCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: MultipleAnswerPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllMultipleAnswer[]>> {
    const result = await this.queryBus.execute(new GetAllMultipleAnswerQuery(filterPagination));

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
    @Body() data: MultipleAnswerDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateMultipleAnswerCommand({
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
      new DeleteMultipleAnswerCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdMultipleAnswer>> {
    const result = await this.queryBus.execute(new GetByIdMultipleAnswerQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Respuesta a las opciones por ID.",
      data: result
    };
  }
}
