import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddDepartmentCommand } from "./addDepartment.command";
import { DepartmentProjection } from "../projections/department.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(AddDepartmentCommand)
export class AddDepartmentHandler implements ICommandHandler<AddDepartmentCommand> {
  constructor(private departmentProjection: DepartmentProjection) {}

  async execute(command: AddDepartmentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.departmentProjection.add({ ...data });

    return {
      statusCode: 201,
      message: "El departamento ha sido agregado exitosamente."
    };
  }
}
