import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EvaluationInstrumentDto, EvaluationInstrumentPaginationDto } from "./dto/evaluationInstrument.dto";
import { CreateEvaluationInstrumentCommand } from "./cqrs/commands/create/createEvaluationInstrument.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { EvaluationInstrument } from "@prisma/client";
import { UpdateEvaluationInstrumentCommand } from "./cqrs/commands/update/updateEvaluationInstrument.command";
import { DeleteEvaluationInstrumentCommand } from "./cqrs/commands/delete/deleteEvaluationInstrument.command";
import { GetAllEvaluationInstrumentQuery } from "./cqrs/queries/findMany/getAllEvaluationInstrument.query";
import { IGetAllEvaluationInstrument, IGetByIdEvaluationInstrument } from "./dto/evaluationInstrument.type";
import { GetByIdEvaluationInstrumentQuery } from "./cqrs/queries/findUnique/getByIdEvaluationInstrument.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class EvaluationInstrumentController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: EvaluationInstrumentDto, @Req() req: Request): Promise<NestResponse<EvaluationInstrument>> {
    return this.commandBus.execute(
      new CreateEvaluationInstrumentCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: EvaluationInstrumentPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllEvaluationInstrument[]>> {
    const result = await this.queryBus.execute(new GetAllEvaluationInstrumentQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de instrumentos de evaluación registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: EvaluationInstrumentDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateEvaluationInstrumentCommand({
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
      new DeleteEvaluationInstrumentCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdEvaluationInstrument>> {
    const result = await this.queryBus.execute(new GetByIdEvaluationInstrumentQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Instrumento de evaluación por ID",
      data: result
    };
  }
}
