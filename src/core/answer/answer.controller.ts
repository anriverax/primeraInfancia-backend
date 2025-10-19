import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Get, Post, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AnswerDto } from "./dto/answer.dto";
import { PaginationDto } from "../../common/helpers/dto";
import { CreateAnswerCommand } from "./cqrs/commands/create/createAnswer.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Answer } from "@prisma/client";
import { GetAllAnswerQuery } from "./cqrs/queries/findMany/getAllAnswer.query";
import { IGetAllAnswer } from "./dto/answer.type";

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
    @Query() filterPagination: PaginationDto
  ): Promise<NestResponseWithPagination<IGetAllAnswer[]>> {
    const result = await this.queryBus.execute(new GetAllAnswerQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de respuestas registradas.",
      data: result.data,
      meta: result.meta
    };
  }
}
