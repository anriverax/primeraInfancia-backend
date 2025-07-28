import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters, } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TrainingModuleDto, TrainingModulePaginationDto } from "./dto/trainingModule.dto";
import { CreateTrainingModuleCommand } from "./cqrs/commands/create/createTrainingModule.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { TrainingModule } from "@prisma/client";
import { UpdateTrainingModuleCommand } from "./cqrs/commands/update/updateTrainingModule.command";
import { DeleteTrainingModuleCommand } from "./cqrs/commands/delete/deleteTrainingModule.command";
import { GetAllTrainingModuleQuery } from "./cqrs/queries/findMany/getAllTrainingModule.query";
import { IGetAllTrainingModule, IGetByIdTrainingModule } from "./dto/trainingModule.type";
import { GetByIdTrainingModuleQuery } from "./cqrs/queries/findUnique/getByIdTrainingModule.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TrainingModuleController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: TrainingModuleDto,
    @Req() req: Request
  ): Promise<NestResponse<TrainingModule>> {
    return this.commandBus.execute(
      new CreateTrainingModuleCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: TrainingModulePaginationDto
  ): Promise<NestResponseWithPagination<IGetAllTrainingModule[]>> {
    const result = await this.queryBus.execute(new GetAllTrainingModuleQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de módulo formativos registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: TrainingModuleDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateTrainingModuleCommand({
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
      new DeleteTrainingModuleCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdTrainingModule>> {
    const result = await this.queryBus.execute(new GetByIdTrainingModuleQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Módulo formativo por ID",
      data: result
    };
  }
}
