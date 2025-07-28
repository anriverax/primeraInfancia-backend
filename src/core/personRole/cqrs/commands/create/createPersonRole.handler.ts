import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePersonRoleCommand } from "./createPersonRole.command";
import { PersonRoleProjection } from "../../projections/personRole.projection";
import { NestResponse } from "@/common/helpers/dto";
import { PersonRole } from "@prisma/client";

@CommandHandler(CreatePersonRoleCommand)
export class CreatePersonRoleHandler implements ICommandHandler<CreatePersonRoleCommand> {
  constructor(private readonly personRoleProjection: PersonRoleProjection) {}
  async execute(command: CreatePersonRoleCommand): Promise<NestResponse<PersonRole>> {
    const { data } = command;

    const res = await this.personRoleProjection.create(data);

    return {
      statusCode: 201,
      message: "Cargo del personal creado con éxito.",
      data: res
    };
  }
}
