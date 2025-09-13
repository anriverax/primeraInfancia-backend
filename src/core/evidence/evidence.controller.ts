import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EvidenceDto, EvidencePaginationDto } from "./dto/evidence.dto";
import { CreateEvidenceCommand } from "./cqrs/commands/create/createEvidence.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { Evidence } from "@prisma/client";
import { UpdateEvidenceCommand } from "./cqrs/commands/update/updateEvidence.command";
import { DeleteEvidenceCommand } from "./cqrs/commands/delete/deleteEvidence.command";
import { GetAllEvidenceQuery } from "./cqrs/queries/findMany/getAllEvidence.query";
import { IGetAllEvidence, IGetByIdEvidence } from "./dto/evidence.type";
import { GetByIdEvidenceQuery } from "./cqrs/queries/findUnique/getByIdEvidence.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class EvidenceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: EvidenceDto, @Req() req: Request): Promise<NestResponse<Evidence>> {
    return this.commandBus.execute(
      new CreateEvidenceCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: EvidencePaginationDto
  ): Promise<NestResponseWithPagination<IGetAllEvidence[]>> {
    const result = await this.queryBus.execute(new GetAllEvidenceQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de evidencias registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: EvidenceDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateEvidenceCommand({
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
      new DeleteEvidenceCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdEvidence>> {
    const result = await this.queryBus.execute(new GetByIdEvidenceQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Evidencia por ID.",
      data: result
    };
  }
}
