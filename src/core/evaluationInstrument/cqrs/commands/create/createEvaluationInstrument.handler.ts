import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEvaluationInstrumentCommand } from "./createEvaluationInstrument.command";
import { EvaluationInstrumentProjection } from "../../projections/evaluationInstrument.projection";
import { NestResponse } from "@/common/helpers/dto";
import { EvaluationInstrument } from "@prisma/client";

@CommandHandler(CreateEvaluationInstrumentCommand)
export class CreateEvaluationInstrumentHandler
  implements ICommandHandler<CreateEvaluationInstrumentCommand>
{
  constructor(private readonly evaluationInstrumentProjection: EvaluationInstrumentProjection) {}
  async execute(
    command: CreateEvaluationInstrumentCommand
  ): Promise<NestResponse<EvaluationInstrument>> {
    const { data } = command;

    const res = await this.evaluationInstrumentProjection.create(data);

    return {
      statusCode: 201,
      message: "Instrumento de evaluación creado con éxito.",
      data: res
    };
  }
}
