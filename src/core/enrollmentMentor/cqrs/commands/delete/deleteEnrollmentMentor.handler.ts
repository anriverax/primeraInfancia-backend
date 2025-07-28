import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteEnrollmentMentorCommand } from "./deleteEnrollmentMentor.command";
import { EnrollmentMentorProjection } from "../../projections/enrollmentMentor.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteEnrollmentMentorCommand)
export class DeleteEnrollmentMentorHandler implements ICommandHandler<DeleteEnrollmentMentorCommand> {
  constructor(private readonly enrollmentMentorProjection: EnrollmentMentorProjection) {}
  async execute(command: DeleteEnrollmentMentorCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.enrollmentMentorProjection.delete(data);

    return {
      statusCode: 200,
      message: "Mentor del grupo eliminado con éxito."
    };
  }
}
