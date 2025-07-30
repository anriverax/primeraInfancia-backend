import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteGroupLeaderCommand } from "./deleteGroupLeader.command";
import { NestResponse } from "@/common/helpers/dto";
import { GroupLeaderProjection } from "../../projections/groupLeader.projection";

@CommandHandler(DeleteGroupLeaderCommand)
export class DeleteGroupLeaderHandler implements ICommandHandler<DeleteGroupLeaderCommand> {
  constructor(private readonly groupProjection: GroupLeaderProjection) {}

  async execute(command: DeleteGroupLeaderCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.groupProjection.delete(data);

    return {
      statusCode: 200,
      message: "Formador eliminado con éxito."
    };
  }
}
