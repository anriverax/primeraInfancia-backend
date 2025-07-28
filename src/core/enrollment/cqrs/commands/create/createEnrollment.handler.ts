import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEnrollmentCommand } from "./createEnrollment.command";
import { EnrollmentProjection } from "../../projections/enrollment.projection";
import { NestResponse } from "@/common/helpers/dto";
import { Enrollment } from "@prisma/client";

@CommandHandler(CreateEnrollmentCommand)
export class CreateEnrollmentHandler implements ICommandHandler<CreateEnrollmentCommand> {
  constructor(private readonly enrollmentProjection: EnrollmentProjection) {}
  async execute(command: CreateEnrollmentCommand): Promise<NestResponse<Enrollment>> {
    const { data } = command;

    const res = await this.enrollmentProjection.create(data);

    return {
      statusCode: 201,
      message: "Inscripción creada con éxito.",
      data: res
    };
  }
}
