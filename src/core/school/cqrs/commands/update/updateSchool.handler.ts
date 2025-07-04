import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSchoolCommand } from "./updateSchool.command";
import { SchoolProjection } from "../../projections/zone.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateSchoolCommand)
export class UpdateSchoolHandler implements ICommandHandler<UpdateSchoolCommand> {
  constructor(private readonly projection: SchoolProjection) {}
  async execute(command: UpdateSchoolCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.update(data);

    return {
      statusCode: 200,
      message: "Centro escolar actualizado con éxito."
    };
  }
}
