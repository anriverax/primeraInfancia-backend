import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateModuleEvaluation } from "../../../dto/moduleEvaluation.type";

export class UpdateModuleEvaluationCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateModuleEvaluation) {
    super();
  }
}
