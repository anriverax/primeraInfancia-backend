import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { IGetAllEvaluationInstrument } from "./dto/evaluationInstrument.type";
import { GetAllEvaluationInstrumentQuery } from "./crqs/queries/findMany/getAllEvaluationInstrument.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class EvaluationInstrumentController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetAllEvaluationInstrument[]>> {
    const result = await this.queryBus.execute(new GetAllEvaluationInstrumentQuery());

    return {
      statusCode: 200,
      message: "Listado de instrumentos evaluativos",
      data: result
    };
  }
}
