import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteGroupTrainerCommand } from "./deleteGroupTrainer.command";
import { GroupTrainerProjection } from "../../projections/groupTrainer.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteGroupTrainerCommand)
export class DeleteGroupTrainerHandler implements ICommandHandler<DeleteGroupTrainerCommand> {
  constructor(private readonly groupTrainerProjection: GroupTrainerProjection) {}
  async execute(command: DeleteGroupTrainerCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.groupTrainerProjection.delete(data);

    return {
      statusCode: 200,
      message: "Formador del grupo eliminado con éxito."
    };
  }
}
