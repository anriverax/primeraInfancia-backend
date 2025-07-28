import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEnrollmentCommand } from "./updateEnrollment.command";
import { EnrollmentProjection } from "../../projections/enrollment.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateEnrollmentCommand)
export class UpdateEnrollmentHandler implements ICommandHandler<UpdateEnrollmentCommand> {
  constructor(private readonly enrollmentProjection: EnrollmentProjection) {}
  async execute(command: UpdateEnrollmentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.enrollmentProjection.update(data);

    return {
      statusCode: 200,
      message: "Inscripción actualizada con éxito."
    };
  }
}
