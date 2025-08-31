import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TrackingDto, TrackingPaginationDto } from "./dto/tracking.dto";
import { CreateTrackingCommand } from "./cqrs/commands/create/createTracking.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { Tracking } from "@prisma/client";
import { UpdateTrackingCommand } from "./cqrs/commands/update/updateTracking.command";
import { DeleteTrackingCommand } from "./cqrs/commands/delete/deleteTracking.command";
import { GetAllTrackingQuery } from "./cqrs/queries/findMany/getAllTracking.query";
import { IGetAllTracking, IGetByIdTracking } from "./dto/tracking.type";
import { GetByIdTrackingQuery } from "./cqrs/queries/findUnique/getByIdTracking.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TrackingController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: TrackingDto, @Req() req: Request): Promise<NestResponse<Tracking>> {
    return this.commandBus.execute(
      new CreateTrackingCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: TrackingPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllTracking[]>> {
    const result = await this.queryBus.execute(new GetAllTrackingQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de seguimientos registrados.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: TrackingDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateTrackingCommand({
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
      new DeleteTrackingCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdTracking>> {
    const result = await this.queryBus.execute(new GetByIdTrackingQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Seguimiento por ID.",
      data: result
    };
  }
}
