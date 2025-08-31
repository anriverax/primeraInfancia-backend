import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TrackingTypeDto, TrackingTypePaginationDto } from "./dto/trackingType.dto";
import { CreateTrackingTypeCommand } from "./cqrs/commands/create/createTrackingType.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { TrackingType } from "@prisma/client";
import { UpdateTrackingTypeCommand } from "./cqrs/commands/update/updateTrackingType.command";
import { DeleteTrackingTypeCommand } from "./cqrs/commands/delete/deleteTrackingType.command";
import { GetAllTrackingTypeQuery } from "./cqrs/queries/findMany/getAllTrackingType.query";
import { IGetAllTrackingType, IGetByIdTrackingType } from "./dto/trackingType.type";
import { GetByIdTrackingTypeQuery } from "./cqrs/queries/findUnique/getByIdTrackingType.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TrackingTypeController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: TrackingTypeDto, @Req() req: Request): Promise<NestResponse<TrackingType>> {
    return this.commandBus.execute(
      new CreateTrackingTypeCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: TrackingTypePaginationDto
  ): Promise<NestResponseWithPagination<IGetAllTrackingType[]>> {
    const result = await this.queryBus.execute(new GetAllTrackingTypeQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de tipos de seguimiento registrados.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: TrackingTypeDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateTrackingTypeCommand({
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
      new DeleteTrackingTypeCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdTrackingType>> {
    const result = await this.queryBus.execute(new GetByIdTrackingTypeQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Tipo de seguimiento por ID.",
      data: result
    };
  }
}
