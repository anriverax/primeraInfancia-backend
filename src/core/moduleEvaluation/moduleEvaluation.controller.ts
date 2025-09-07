import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ModuleEvaluationDto, ModuleEvaluationPaginationDto } from "./dto/moduleEvaluation.dto";
import { CreateModuleEvaluationCommand } from "./cqrs/commands/create/createModuleEvaluation.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { ModuleEvaluation } from "@prisma/client";
import { UpdateModuleEvaluationCommand } from "./cqrs/commands/update/updateModuleEvaluation.command";
import { DeleteModuleEvaluationCommand } from "./cqrs/commands/delete/deleteModuleEvaluation.command";
import { GetAllModuleEvaluationQuery } from "./cqrs/queries/findMany/getAllModuleEvaluation.query";
import { IGetAllModuleEvaluation, IGetByIdModuleEvaluation } from "./dto/moduleEvaluation.type";
import { GetByIdModuleEvaluationQuery } from "./cqrs/queries/findUnique/getByIdModuleEvaluation.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ModuleEvaluationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: ModuleEvaluationDto,
    @Req() req: Request
  ): Promise<NestResponse<ModuleEvaluation>> {
    return this.commandBus.execute(
      new CreateModuleEvaluationCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: ModuleEvaluationPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllModuleEvaluation[]>> {
    const result = await this.queryBus.execute(new GetAllModuleEvaluationQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de evaluaciones del modulo registradas",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: ModuleEvaluationDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateModuleEvaluationCommand({
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
      new DeleteModuleEvaluationCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdModuleEvaluation>> {
    const result = await this.queryBus.execute(new GetByIdModuleEvaluationQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Evaluación del módulo por ID",
      data: result
    };
  }
}
