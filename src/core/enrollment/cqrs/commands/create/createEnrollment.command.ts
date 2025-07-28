import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateEnrollment } from "../../../dto/enrollment.type";
import { Enrollment } from "@prisma/client";

export class CreateEnrollmentCommand extends Command<NestResponse<Enrollment>> {
  constructor(public readonly data: ICreateEnrollment) {
    super();
  }
}
