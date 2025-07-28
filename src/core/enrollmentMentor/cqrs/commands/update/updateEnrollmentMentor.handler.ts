import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEnrollmentMentorCommand } from "./updateEnrollmentMentor.command";
import { EnrollmentMentorProjection } from "../../projections/enrollmentMentor.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateEnrollmentMentorCommand)
export class UpdateEnrollmentMentorHandler implements ICommandHandler<UpdateEnrollmentMentorCommand> {
  constructor(private readonly enrollmentMentorProjection: EnrollmentMentorProjection) {}
  async execute(command: UpdateEnrollmentMentorCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.enrollmentMentorProjection.update(data);

    return {
      statusCode: 200,
      message: "Mentor del grupo actualizado con éxito."
    };
  }
}
