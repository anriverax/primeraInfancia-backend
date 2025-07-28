import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteEnrollmentCommand } from "./deleteEnrollment.command";
import { EnrollmentProjection } from "../../projections/enrollment.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteEnrollmentCommand)
export class DeleteEnrollmentHandler implements ICommandHandler<DeleteEnrollmentCommand> {
  constructor(private readonly enrollmentProjection: EnrollmentProjection) {}
  async execute(command: DeleteEnrollmentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.enrollmentProjection.delete(data);

    return {
      statusCode: 200,
      message: "Inscripción eliminada con éxito."
    };
  }
}
