import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateGroupCommand } from "./updateGroup.command";
import { GroupProjection } from "../../projections/group.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateGroupCommand)
export class UpdateGroupHandler implements ICommandHandler<UpdateGroupCommand> {
  constructor(private readonly projection: GroupProjection) {}

  async execute(command: UpdateGroupCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.update(data);

    return {
      statusCode: 200,
      message: "Grupo actualizado con éxito."
    };
  }
}
