import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateGroupLeaderCommand } from "./createGroupLeader.command";
import { NestResponse } from "@/common/helpers/dto";
import { GroupLeader } from "@prisma/client";
import { GroupLeaderProjection } from "../../projections/groupLeader.projection";

@CommandHandler(CreateGroupLeaderCommand)
export class CreateGroupLeaderHandler implements ICommandHandler<CreateGroupLeaderCommand> {
  constructor(private readonly groupProjection: GroupLeaderProjection) {}

  async execute(command: CreateGroupLeaderCommand): Promise<NestResponse<GroupLeader>> {
    const { data } = command;

    const res = await this.groupProjection.create(data);

    return {
      statusCode: 201,
      message: "Formador agregado con éxito.",
      data: res
    };
  }
}
