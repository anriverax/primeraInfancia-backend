import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { IGetZone, ZoneDto } from "./dto/zone.dto";
import { CreateZoneCommand } from "./cqrs/commands/create/createZone.command";
import { GetAllZoneQuery } from "./cqrs/queries/findMany/getAllZone.query";
import { GetByIdZoneQuery } from "./cqrs/queries/findUnique/getByIdZone.query";
import { AuthRequired } from "@/services/jwt/decorators/authRequired.decorator";
import { DeleteZoneCommand } from "./cqrs/commands/delete/deleteZone.command";
import { UpdateZoneCommand } from "./cqrs/commands/update/updateZone.command";
import { NestResponse } from "@/common/helpers/dto";

@Controller()
@UseFilters(HttpExceptionFilter)
export class ZoneController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: ZoneDto, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new CreateZoneCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetZone[]>> {
    const result = await this.queryBus.execute(new GetAllZoneQuery());

    return {
      statusCode: 200,
      message: "Listado de zonas registradas",
      data: result
    };
  }

  @AuthRequired()
  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetZone>> {
    const result = await this.queryBus.execute(new GetByIdZoneQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Listado de zonas por ID",
      data: result
    };
  }

  @AuthRequired()
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() data: ZoneDto,
    @Req() req: Request
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateZoneCommand({ id: parseInt(id), ...data, updatedBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteZoneCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }
}
