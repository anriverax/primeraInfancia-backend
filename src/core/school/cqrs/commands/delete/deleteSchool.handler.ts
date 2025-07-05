import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteSchoolCommand } from "./deleteSchool.command";
import { SchoolProjection } from "../../projections/school.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteSchoolCommand)
export class DeleteSchoolHandler implements ICommandHandler<DeleteSchoolCommand> {
  constructor(private readonly projection: SchoolProjection) {}
  async execute(command: DeleteSchoolCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.delete(data);

    return {
      statusCode: 200,
      message: "Centro escolar eliminado con éxito."
    };
  }
}
