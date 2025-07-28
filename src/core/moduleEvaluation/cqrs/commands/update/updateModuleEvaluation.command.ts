import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateModuleEvaluation } from "../../../dto/moduleEvaluation.type";

export class UpdateModuleEvaluationCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateModuleEvaluation) {
    super();
  }
}
