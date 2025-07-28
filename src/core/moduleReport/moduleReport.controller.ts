import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ModuleReportDto, ModuleReportPaginationDto } from "./dto/moduleReport.dto";
import { CreateModuleReportCommand } from "./cqrs/commands/create/createModuleReport.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { ModuleReport } from "@prisma/client";
import { UpdateModuleReportCommand } from "./cqrs/commands/update/updateModuleReport.command";
import { DeleteModuleReportCommand } from "./cqrs/commands/delete/deleteModuleReport.command";
import { GetAllModuleReportQuery } from "./cqrs/queries/findMany/getAllModuleReport.query";
import { IGetAllModuleReport, IGetByIdModuleReport } from "./dto/moduleReport.type";
import { GetByIdModuleReportQuery } from "./cqrs/queries/findUnique/getByIdModuleReport.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ModuleReportController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: ModuleReportDto, @Req() req: Request): Promise<NestResponse<ModuleReport>> {
    return this.commandBus.execute(
      new CreateModuleReportCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: ModuleReportPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllModuleReport[]>> {
    const result = await this.queryBus.execute(new GetAllModuleReportQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de informes del módulo registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: ModuleReportDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateModuleReportCommand({
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
      new DeleteModuleReportCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdModuleReport>> {
    const result = await this.queryBus.execute(new GetByIdModuleReportQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Informe del módulo por ID",
      data: result
    };
  }
}
