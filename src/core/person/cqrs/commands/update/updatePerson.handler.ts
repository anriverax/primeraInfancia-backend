import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePersonCommand } from "./updatePerson.command";
import { PersonProjection } from "../../projections/person.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdatePersonCommand)
export class UpdatePersonHandler implements ICommandHandler<UpdatePersonCommand> {
  constructor(private readonly personProjection: PersonProjection) {}
  async execute(command: UpdatePersonCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.personProjection.update(data);

    return {
      statusCode: 200,
      message: "Persona actualizada con éxito."
    };
  }
}
