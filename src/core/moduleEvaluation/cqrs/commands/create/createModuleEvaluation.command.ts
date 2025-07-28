import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateModuleEvaluation } from "../../../dto/moduleEvaluation.type";
import { ModuleEvaluation } from "@prisma/client";

export class CreateModuleEvaluationCommand extends Command<NestResponse<ModuleEvaluation>> {
  constructor(public readonly data: ICreateModuleEvaluation) {
    super();
  }
}
