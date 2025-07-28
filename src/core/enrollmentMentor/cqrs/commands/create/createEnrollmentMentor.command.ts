import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateEnrollmentMentor } from "../../../dto/enrollmentMentor.type";
import { EnrollmentMentor } from "@prisma/client";

export class CreateEnrollmentMentorCommand extends Command<NestResponse<EnrollmentMentor>> {
  constructor(public readonly data: ICreateEnrollmentMentor) {
    super();
  }
}
