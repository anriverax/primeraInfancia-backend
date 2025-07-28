import { NestResponse } from "@/common/helpers/dto";
import { IDeleteEnrollment } from "@/core/enrollment/dto/enrollment.type";
import { Command } from "@nestjs/cqrs";

export class DeleteEnrollmentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteEnrollment) {
    super();
  }
}
