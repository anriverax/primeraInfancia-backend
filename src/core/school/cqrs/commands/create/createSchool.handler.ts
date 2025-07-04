import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSchoolCommand } from "./createSchool.command";
import { SchoolProjection } from "../../projections/school.projection";
import { NestResponse } from "@/common/helpers/dto";
import { School } from "@prisma/client";

@CommandHandler(CreateSchoolCommand)
export class CreateSchoolHandler implements ICommandHandler<CreateSchoolCommand> {
  constructor(private readonly projection: SchoolProjection) {}
  async execute(command: CreateSchoolCommand): Promise<NestResponse<School>> {
    const { data } = command;

    const res = await this.projection.create(data);

    return {
      statusCode: 201,
      message: "Centro escolar creado con éxito.",
      data: res
    };
  }
}
