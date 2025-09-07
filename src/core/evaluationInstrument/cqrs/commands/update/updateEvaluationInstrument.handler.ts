import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEvaluationInstrumentCommand } from "./updateEvaluationInstrument.command";
import { EvaluationInstrumentProjection } from "../../projections/evaluationInstrument.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateEvaluationInstrumentCommand)
export class UpdateEvaluationInstrumentHandler
  implements ICommandHandler<UpdateEvaluationInstrumentCommand>
{
  constructor(private readonly evaluationInstrumentProjection: EvaluationInstrumentProjection) {}
  async execute(command: UpdateEvaluationInstrumentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.evaluationInstrumentProjection.update(data);

    return {
      statusCode: 200,
      message: "Instrumento de evaluación actualizado con éxito."
    };
  }
}
