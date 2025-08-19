import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAssignTypePersonCommand } from "./createAssignTypePerson.command";
import { NestResponse } from "@/common/helpers/types";
import { GroupLeader } from "@prisma/client";
import { AssignTypePersonProjection } from "../../../projections/assignTypePerson.projection";

@CommandHandler(CreateAssignTypePersonCommand)
export class CreateAssignTypePersonHandler implements ICommandHandler<CreateAssignTypePersonCommand> {
  constructor(private readonly assignTypePersonProjection: AssignTypePersonProjection) {}

  async execute(command: CreateAssignTypePersonCommand): Promise<NestResponse<GroupLeader>> {
    const { data } = command;

    const res = await this.assignTypePersonProjection.create(data);

    return {
      statusCode: 201,
      message: "Formador agregado con éxito.",
      data: res
    };
  }
}
