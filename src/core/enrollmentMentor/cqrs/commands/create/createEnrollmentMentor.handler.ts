import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEnrollmentMentorCommand } from "./createEnrollmentMentor.command";
import { EnrollmentMentorProjection } from "../../projections/enrollmentMentor.projection";
import { NestResponse } from "@/common/helpers/dto";
import { EnrollmentMentor } from "@prisma/client";

@CommandHandler(CreateEnrollmentMentorCommand)
export class CreateEnrollmentMentorHandler implements ICommandHandler<CreateEnrollmentMentorCommand> {
  constructor(private readonly enrollmentMentorProjection: EnrollmentMentorProjection) {}
  async execute(command: CreateEnrollmentMentorCommand): Promise<NestResponse<EnrollmentMentor>> {
    const { data } = command;

    const res = await this.enrollmentMentorProjection.create(data);

    return {
      statusCode: 201,
      message: "Mentor del grupo creado con éxito.",
      data: res
    };
  }
}
