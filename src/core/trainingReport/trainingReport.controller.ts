import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TrainingReportDto, TrainingReportPaginationDto } from "./dto/trainingReport.dto";
import { CreateTrainingReportCommand } from "./cqrs/commands/create/createTrainingReport.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { TrainingReport } from "@prisma/client";
import { UpdateTrainingReportCommand } from "./cqrs/commands/update/updateTrainingReport.command";
import { DeleteTrainingReportCommand } from "./cqrs/commands/delete/deleteTrainingReport.command";
import { GetAllTrainingReportQuery } from "./cqrs/queries/findMany/getAllTrainingReport.query";
import { IGetAllTrainingReport, IGetByIdTrainingReport } from "./dto/trainingReport.type";
import { GetByIdTrainingReportQuery } from "./cqrs/queries/findUnique/getByIdTrainingReport.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TrainingReportController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: TrainingReportDto,
    @Req() req: Request
  ): Promise<NestResponse<TrainingReport>> {
    return this.commandBus.execute(
      new CreateTrainingReportCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: TrainingReportPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllTrainingReport[]>> {
    const result = await this.queryBus.execute(new GetAllTrainingReportQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de informes de formación registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: TrainingReportDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateTrainingReportCommand({
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
      new DeleteTrainingReportCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdTrainingReport>> {
    const result = await this.queryBus.execute(new GetByIdTrainingReportQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Informe de formación por ID",
      data: result
    };
  }
}
