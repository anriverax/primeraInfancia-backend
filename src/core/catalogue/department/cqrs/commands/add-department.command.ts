import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DepartmentProjection } from "../projections/department.projection";
import { DepartmentCreateInput } from "../../dto/department.type";

/**
 * Command representing the intention to create a new Department entity.
 * Encapsulates validated input data required for creation.
 */
export class AddDepartmentCommand {
  /**
   * @param data Department creation input (name, geonameId, zoneId).
   */
  constructor(public readonly data: DepartmentCreateInput) {}
}

/**
 * Command handler responsible for executing {@link AddDepartmentCommand}.
 * Delegates persistence to the projection (data access) layer.
 *
 * Consider renaming `DepartmentProjection` to `DepartmentRepository` for clarity (not changed here).
 */
@CommandHandler(AddDepartmentCommand)
export class AddDepartmentHandler implements ICommandHandler<AddDepartmentCommand> {
  constructor(private departmentProjection: DepartmentProjection) {}

  /**
   * Persists a new Department and returns its identifier.
   * @param command Wrapped creation data.
   * @returns Object containing newly generated `id`.
   */
  async execute({ data }: AddDepartmentCommand): Promise<{ id: number }> {
    return this.departmentProjection.add({ ...data });
  }
}
