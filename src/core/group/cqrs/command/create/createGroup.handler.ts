import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateGroupCommand } from "./createGroup.command";
import { GroupProjection } from "../../projections/group.projection";
import { NestResponse } from "@/common/helpers/dto";
import { Group } from "@prisma/client";

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
  constructor(private readonly groupProjection: GroupProjection) {}

  async execute(command: CreateGroupCommand): Promise<NestResponse<Group>> {
    const { data } = command;

    const res = await this.groupProjection.create(data);

    return {
      statusCode: 201,
      message: "Grupo creado con éxito.",
      data: res
    };
  }
}
