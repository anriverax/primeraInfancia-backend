import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateGroupTrainerCommand } from "./createGroupTrainer.command";
import { GroupTrainerProjection } from "../../projections/groupTrainer.projection";
import { NestResponse } from "@/common/helpers/dto";
import { GroupTrainer } from "@prisma/client";

@CommandHandler(CreateGroupTrainerCommand)
export class CreateGroupTrainerHandler implements ICommandHandler<CreateGroupTrainerCommand> {
  constructor(private readonly groupTrainerProjection: GroupTrainerProjection) {}
  async execute(command: CreateGroupTrainerCommand): Promise<NestResponse<GroupTrainer>> {
    const { data } = command;

    const res = await this.groupTrainerProjection.create(data);

    return {
      statusCode: 201,
      message: "Formador del grupo creado con éxito.",
      data: res
    };
  }
}
