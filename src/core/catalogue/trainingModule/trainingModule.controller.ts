import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { IGetAllTrainingModule } from "./dto/trainingModule.type";
import { GetAllTrainingModuleQuery } from "./crqs/queries/findMany/getAllTrainingModule.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class TrainingModuleController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetAllTrainingModule[]>> {
    const result = await this.queryBus.execute(new GetAllTrainingModuleQuery());

    return {
      statusCode: 200,
      message: "Listado de módulo formativos",
      data: result
    };
  }
}
