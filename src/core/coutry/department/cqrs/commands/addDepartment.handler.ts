import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddDepartmentCommand } from "./addDepartment.command";
import { DepartmentProjection } from "../projections/department.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(AddDepartmentCommand)
export class AddDepartmentHandler implements ICommandHandler<AddDepartmentCommand> {
  constructor(private projection: DepartmentProjection) {}

  async execute(command: AddDepartmentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.add({ ...data });

    return {
      statusCode: 200,
      message: "El departamento ha sido agregado exitosamente."
    };
  }
}
