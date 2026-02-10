import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteSurveyDataCommand } from "./deleteSurveyData.command";
import { SurveyDataProjection } from "../../projections/surveyData.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteSurveyDataCommand)
export class DeleteSurveyDataHandler implements ICommandHandler<DeleteSurveyDataCommand> {
  constructor(private readonly surveyDataProjection: SurveyDataProjection) {}
  async execute(command: DeleteSurveyDataCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.surveyDataProjection.delete(data);

    return {
      statusCode: 200,
      message: "Respuesta al anexo eliminada con éxito."
    };
  }
}
