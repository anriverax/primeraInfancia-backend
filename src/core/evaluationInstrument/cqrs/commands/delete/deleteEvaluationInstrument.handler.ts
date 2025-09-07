import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteEvaluationInstrumentCommand } from "./deleteEvaluationInstrument.command";
import { EvaluationInstrumentProjection } from "../../projections/evaluationInstrument.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteEvaluationInstrumentCommand)
export class DeleteEvaluationInstrumentHandler
  implements ICommandHandler<DeleteEvaluationInstrumentCommand>
{
  constructor(private readonly evaluationInstrumentProjection: EvaluationInstrumentProjection) {}
  async execute(command: DeleteEvaluationInstrumentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.evaluationInstrumentProjection.delete(data);

    return {
      statusCode: 200,
      message: "Instrumento de evaluación eliminado con éxito."
    };
  }
}
