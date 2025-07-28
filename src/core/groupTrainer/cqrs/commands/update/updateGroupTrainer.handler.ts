import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateGroupTrainerCommand } from "./updateGroupTrainer.command";
import { GroupTrainerProjection } from "../../projections/groupTrainer.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateGroupTrainerCommand)
export class UpdateGroupTrainerHandler implements ICommandHandler<UpdateGroupTrainerCommand> {
  constructor(private readonly groupTrainerProjection: GroupTrainerProjection) {}
  async execute(command: UpdateGroupTrainerCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.groupTrainerProjection.update(data);

    return {
      statusCode: 200,
      message: "Formador del grupo actualizado con éxito."
    };
  }
}
