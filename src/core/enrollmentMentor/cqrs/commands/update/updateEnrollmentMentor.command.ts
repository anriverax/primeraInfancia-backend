import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateEnrollmentMentor } from "../../../dto/enrollmentMentor.type";

export class UpdateEnrollmentMentorCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateEnrollmentMentor) {
    super();
  }
}
