import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AnswerDto, AnswerPaginationDto } from "./dto/answer.dto";
import { CreateAnswerCommand } from "./cqrs/commands/create/createAnswer.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Answer } from "@prisma/client";
import { UpdateAnswerCommand } from "./cqrs/commands/update/updateAnswer.command";
import { DeleteAnswerCommand } from "./cqrs/commands/delete/deleteAnswer.command";
import { GetAllAnswerQuery } from "./cqrs/queries/findMany/getAllAnswer.query";
import { IGetAllAnswer, IGetByIdAnswer } from "./dto/answer.type";
import { GetByIdAnswerQuery } from "./cqrs/queries/findUnique/getByIdAnswer.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AnswerController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: AnswerDto, @Req() req: Request): Promise<NestResponse<Answer>> {
    return this.commandBus.execute(
      new CreateAnswerCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: AnswerPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllAnswer[]>> {
    const result = await this.queryBus.execute(new GetAllAnswerQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de respuestas registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: AnswerDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateAnswerCommand({
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
      new DeleteAnswerCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdAnswer>> {
    const result = await this.queryBus.execute(new GetByIdAnswerQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Respuesta por ID.",
      data: result
    };
  }
}
