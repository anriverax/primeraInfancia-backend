import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeletePersonRoleCommand } from "./deletePersonRole.command";
import { PersonRoleProjection } from "../../projections/personRole.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeletePersonRoleCommand)
export class DeletePersonRoleHandler implements ICommandHandler<DeletePersonRoleCommand> {
  constructor(private readonly personRoleProjection: PersonRoleProjection) {}
  async execute(command: DeletePersonRoleCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.personRoleProjection.delete(data);

    return {
      statusCode: 200,
      message: "Cargo del personal eliminado con éxito."
    };
  }
}
