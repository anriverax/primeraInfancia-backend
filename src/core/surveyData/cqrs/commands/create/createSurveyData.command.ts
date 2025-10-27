import { Command } from "@nestjs/cqrs";
import { ICreateSurveyData } from "../../../dto/surveyData.type";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SurveyDataProjection } from "../../projections/surveyData.projection";
import { NestResponse } from "@/common/helpers/types";
import { SurveyData } from "@prisma/client";

export class CreateSurveyDataCommand extends Command<NestResponse<SurveyData>> {
  constructor(public readonly data: ICreateSurveyData) {
    super();
  }
}

@CommandHandler(CreateSurveyDataCommand)
export class CreateSurveyDataHandler implements ICommandHandler<CreateSurveyDataCommand> {
  constructor(private readonly surveyDataProjection: SurveyDataProjection) {}
  async execute(command: CreateSurveyDataCommand): Promise<NestResponse<SurveyData>> {
    const { data } = command;

    const res = await this.surveyDataProjection.create(data);

    return {
      statusCode: 201,
      message: "Respuesta al anexo creada con éxito.",
      data: res
    };
  }
}
