import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SectionDto, SectionPaginationDto } from "./dto/section.dto";
import { CreateSectionCommand } from "./cqrs/commands/create/createSection.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { Section } from "@prisma/client";
import { UpdateSectionCommand } from "./cqrs/commands/update/updateSection.command";
import { DeleteSectionCommand } from "./cqrs/commands/delete/deleteSection.command";
import { GetAllSectionQuery } from "./cqrs/queries/findMany/getAllSection.query";
import { IGetAllSection, IGetByIdSection } from "./dto/section.type";
import { GetByIdSectionQuery } from "./cqrs/queries/findUnique/getByIdSection.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SectionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  //@AuthRequired()
  @Post("create")
  async create(@Body() data: SectionDto, @Req() req: Request): Promise<NestResponse<Section>> {
    req["user"] = "1";
    return this.commandBus.execute(
      new CreateSectionCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: SectionPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllSection[]>> {
    const result = await this.queryBus.execute(new GetAllSectionQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de secciones registradas.",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: SectionDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateSectionCommand({
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
      new DeleteSectionCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdSection>> {
    const result = await this.queryBus.execute(new GetByIdSectionQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Sección por ID.",
      data: result
    };
  }
}
