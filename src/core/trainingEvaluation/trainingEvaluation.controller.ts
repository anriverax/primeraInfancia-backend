import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TrainingEvaluationDto, TrainingEvaluationPaginationDto } from "./dto/trainingEvaluation.dto";
import { CreateTrainingEvaluationCommand } from "./cqrs/commands/create/createTrainingEvaluation.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { TrainingEvaluation } from "@prisma/client";
import { UpdateTrainingEvaluationCommand } from "./cqrs/commands/update/updateTrainingEvaluation.command";
import { DeleteTrainingEvaluationCommand } from "./cqrs/commands/delete/deleteTrainingEvaluation.command";
import { GetAllTrainingEvaluationQuery } from "./cqrs/queries/findMany/getAllTrainingEvaluation.query";
import { IGetAllTrainingEvaluation, IGetByIdTrainingEvaluation } from "./dto/trainingEvaluation.type";
import { GetByIdTrainingEvaluationQuery } from "./cqrs/queries/findUnique/getByIdTrainingEvaluation.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TrainingEvaluationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: TrainingEvaluationDto,
    @Req() req: Request
  ): Promise<NestResponse<TrainingEvaluation>> {
    return this.commandBus.execute(
      new CreateTrainingEvaluationCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: TrainingEvaluationPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllTrainingEvaluation[]>> {
    const result = await this.queryBus.execute(new GetAllTrainingEvaluationQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de formaciones docentes registradas",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: TrainingEvaluationDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateTrainingEvaluationCommand({
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
      new DeleteTrainingEvaluationCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdTrainingEvaluation>> {
    const result = await this.queryBus.execute(new GetByIdTrainingEvaluationQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Evaluación de la formación por ID",
      data: result
    };
  }
}
