import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/dto";
import { IVerifyEmail } from "@/core/auth/dto/auth.type";

// The command only receives the request and calls the corresponding handler.
export class VerifyEmailCommand extends Command<NestResponse<boolean>> {
  constructor(public readonly data: IVerifyEmail) {
    super();
  }
}
