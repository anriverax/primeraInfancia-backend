import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSurveyDataCommand } from "./updateSurveyData.command";
import { SurveyDataProjection } from "../../projections/surveyData.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateSurveyDataCommand)
export class UpdateSurveyDataHandler implements ICommandHandler<UpdateSurveyDataCommand> {
  constructor(private readonly surveyDataProjection: SurveyDataProjection) {}
  async execute(command: UpdateSurveyDataCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.surveyDataProjection.update(data);

    return {
      statusCode: 200,
      message: "Respuesta al anexo actualizada con éxito."
    };
  }
}
