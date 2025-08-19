import { CommandHandler } from "@nestjs/cqrs";
import { SchoolProjection } from "../projections/school.projection";
import { AddShoolCommand } from "./AddSchool.command";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(AddShoolCommand)
export class AddSchoolHandler {
  constructor(private readonly schoolProjection: SchoolProjection) {}

  async execute(command: AddShoolCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.schoolProjection.add(data);

    return {
      statusCode: 201,
      message: "La escuela ha sido agregado exitosamente."
    };
  }
}
