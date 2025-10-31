import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  BadRequestException
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SurveyDataDto, SurveyDataPaginationDto } from "./dto/surveyData.dto";
import { CreateSurveyDataCommand } from "./cqrs/commands/create/createSurveyData.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { SurveyData } from "@prisma/client";
import { UpdateSurveyDataCommand } from "./cqrs/commands/update/updateSurveyData.command";
import { DeleteSurveyDataCommand } from "./cqrs/commands/delete/deleteSurveyData.command";
import { GetAllSurveyDataQuery } from "./cqrs/queries/findMany/getAllSurveyData.query";
import { GetByInscriptionSurveyDataQuery } from "./cqrs/queries/findMany/getByInscriptionSurveyData.query";
import { IGetAllSurveyData, IGetByIdSurveyData } from "./dto/surveyData.type";
import { GetByIdSurveyDataQuery } from "./cqrs/queries/findUnique/getByIdSurveyData.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SurveyDataController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: SurveyDataDto, @Req() req: Request): Promise<NestResponse<SurveyData>> {
    return this.commandBus.execute(
      new CreateSurveyDataCommand({
        ...data,
        survey: JSON.parse(JSON.stringify(data.survey)),
        createdBy: parseInt(req["user"].sub)
      })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: SurveyDataPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllSurveyData[]>> {
    const result = await this.queryBus.execute(new GetAllSurveyDataQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de respuestas al anexo.",
      data: result.data,
      meta: result.meta
    };
  }

  @Get("by-inscription")
  async getByInscription(
    @Query("inscriptionId") inscriptionIdRaw: string,
    @Query("appendixId") appendixIdRaw?: string
  ): Promise<NestResponse<IGetAllSurveyData[]>> {
    const inscriptionId = Number(inscriptionIdRaw);
    if (Number.isNaN(inscriptionId) || inscriptionId <= 0) {
      throw new BadRequestException("inscriptionId es requerido y debe ser un número mayor que 0.");
    }

    let appendixId: number | undefined = undefined;
    if (appendixIdRaw !== undefined) {
      appendixId = Number(appendixIdRaw);
      if (Number.isNaN(appendixId) || appendixId <= 0) {
        throw new BadRequestException("appendixId debe ser un número mayor que 0 si se proporciona.");
      }
    }

    const data = await this.queryBus.execute(
      new GetByInscriptionSurveyDataQuery(inscriptionId, appendixId)
    );

    return {
      statusCode: 200,
      message: "SurveyData filtrado por inscriptionId",
      data
    } as NestResponse<IGetAllSurveyData[]>;
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: SurveyDataDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateSurveyDataCommand({
        id: parseInt(id),
        ...data,
        survey: JSON.parse(JSON.stringify(data.survey)),
        updatedBy: parseInt(req["user"].sub)
      })
    );
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteSurveyDataCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdSurveyData>> {
    const result = await this.queryBus.execute(new GetByIdSurveyDataQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Respuesta al anexo por ID.",
      data: result
    };
  }
}
