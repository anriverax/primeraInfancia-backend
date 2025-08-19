import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteGroupCommand } from "./deleteGroup.command";
import { GroupProjection } from "../../projections/group.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteGroupCommand)
export class DeleteGroupHandler implements ICommandHandler<DeleteGroupCommand> {
  constructor(private readonly groupProjection: GroupProjection) {}

  async execute(command: DeleteGroupCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.groupProjection.delete(data);

    return {
      statusCode: 200,
      message: "Grupo eliminado con éxito."
    };
  }
}
