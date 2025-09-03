import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { InstrumentDto, InstrumentPaginationDto } from "./dto/instrument.dto";
import { CreateInstrumentCommand } from "./cqrs/commands/create/createInstrument.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { Instrument } from "@prisma/client";
import { UpdateInstrumentCommand } from "./cqrs/commands/update/updateInstrument.command";
import { DeleteInstrumentCommand } from "./cqrs/commands/delete/deleteInstrument.command";
import { GetAllInstrumentQuery } from "./cqrs/queries/findMany/getAllInstrument.query";
import { IGetAllInstrument, IGetByIdInstrument } from "./dto/instrument.type";
import {
  GetByIdInstrumentQuery,
  GetByDetailInstrumentQuery
} from "./cqrs/queries/findUnique/getByIdInstrument.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class InstrumentController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  //@AuthRequired()
  @Post("create")
  async create(@Body() data: InstrumentDto, @Req() req: Request): Promise<NestResponse<Instrument>> {
    req["user"] = "1";
    return this.commandBus.execute(
      new CreateInstrumentCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: InstrumentPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllInstrument[]>> {
    const result = await this.queryBus.execute(new GetAllInstrumentQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de instrumentos registrados.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: InstrumentDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateInstrumentCommand({
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
      new DeleteInstrumentCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdInstrument>> {
    const result = await this.queryBus.execute(new GetByIdInstrumentQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Instrumento por ID.",
      data: result
    };
  }

  @Get("detail/:id")
  async getDetailById(@Param("id") id: string): Promise<NestResponse<IGetByIdInstrument>> {
    console.log(id);

    const result = await this.queryBus.execute(new GetByDetailInstrumentQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Detalle del instrumento por ID.",
      data: result
    };
  }
}
