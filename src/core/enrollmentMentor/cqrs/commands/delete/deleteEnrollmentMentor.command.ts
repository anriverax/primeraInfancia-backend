import { NestResponse } from "@/common/helpers/dto";
import { IDeleteEnrollmentMentor } from "@/core/enrollmentMentor/dto/enrollmentMentor.type";
import { Command } from "@nestjs/cqrs";

export class DeleteEnrollmentMentorCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteEnrollmentMentor) {
    super();
  }
}
