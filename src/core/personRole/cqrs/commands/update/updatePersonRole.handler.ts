import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePersonRoleCommand } from "./updatePersonRole.command";
import { PersonRoleProjection } from "../../projections/personRole.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdatePersonRoleCommand)
export class UpdatePersonRoleHandler implements ICommandHandler<UpdatePersonRoleCommand> {
  constructor(private readonly personRoleProjection: PersonRoleProjection) {}
  async execute(command: UpdatePersonRoleCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.personRoleProjection.update(data);

    return {
      statusCode: 200,
      message: "Cargo del personal actualizado con éxito."
    };
  }
}
