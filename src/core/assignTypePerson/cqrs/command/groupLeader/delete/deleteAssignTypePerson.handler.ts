import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAssignTypePersonCommand } from "./deleteCreateAssignTypePerson.command";
import { NestResponse } from "@/common/helpers/types";
import { AssignTypePersonProjection } from "../../../projections/assignTypePerson.projection";

@CommandHandler(DeleteAssignTypePersonCommand)
export class DeleteAssignTypePersonHandler implements ICommandHandler<DeleteAssignTypePersonCommand> {
  constructor(private readonly groupProjection: AssignTypePersonProjection) {}

  async execute(command: DeleteAssignTypePersonCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.groupProjection.delete(data);

    return {
      statusCode: 200,
      message: "Formador eliminado con éxito."
    };
  }
}
