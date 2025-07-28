import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateEnrollment } from "../../../dto/enrollment.type";

export class UpdateEnrollmentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateEnrollment) {
    super();
  }
}
