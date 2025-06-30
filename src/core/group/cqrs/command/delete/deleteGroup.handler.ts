import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteGroupCommand } from "./deleteGroup.command";
import { GroupProjection } from "../../projections/group.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteGroupCommand)
export class DeleteGroupHandler implements ICommandHandler<DeleteGroupCommand> {
  constructor(private readonly projection: GroupProjection) {}

  async execute(command: DeleteGroupCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.delete(data);

    return {
      statusCode: 200,
      message: "Grupo eliminado con éxito."
    };
  }
}
