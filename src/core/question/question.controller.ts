import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { QuestionDto, QuestionPaginationDto } from "./dto/question.dto";
import { CreateQuestionCommand } from "./cqrs/commands/create/createQuestion.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Question } from "@prisma/client";
import { UpdateQuestionCommand } from "./cqrs/commands/update/updateQuestion.command";
import { DeleteQuestionCommand } from "./cqrs/commands/delete/deleteQuestion.command";
import { GetAllQuestionQuery } from "./cqrs/queries/findMany/getAllQuestion.query";
import { IGetAllQuestion, IGetByIdQuestion } from "./dto/question.type";
import { GetByIdQuestionQuery } from "./cqrs/queries/findUnique/getByIdQuestion.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class QuestionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: QuestionDto, @Req() req: Request): Promise<NestResponse<Question>> {
    return this.commandBus.execute(
      new CreateQuestionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: QuestionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllQuestion[]>> {
    const result = await this.queryBus.execute(new GetAllQuestionQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de preguntas registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: QuestionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateQuestionCommand({
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
      new DeleteQuestionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdQuestion>> {
    const result = await this.queryBus.execute(new GetByIdQuestionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Pregunta por ID.",
      data: result
    };
  }
}
