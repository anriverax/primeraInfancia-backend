import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { DepartmentDto } from "./dto/department.dto";
import { DepartmentList } from "./dto/department.type";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AddDepartmentCommand } from "./cqrs/commands/add-department.command";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { GetAllDepartmentsQuery } from "./cqrs/queries/get-all-department.query";

/**
 * REST controller exposing endpoints to manage Department catalogue entities.
 *
 * Uses CQRS pattern via NestJS {@link CommandBus} and {@link QueryBus} to dispatch
 * write (command) and read (query) operations respectively, keeping responsibilities separated.
 *
 * Authentication is required (see {@link AuthRequired}) for mutating operations.
 *
 * Swagger tags: `departments`.
 */

@ApiTags("departments")
@ApiBearerAuth()
@Controller()
export class DepartmentController {
  /**
   * Creates a new instance of the controller injecting CQRS buses.
   * @param commandBus Dispatches write side commands (e.g. create Department).
   * @param queryBus Dispatches read side queries (e.g. list Departments).
   */
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Creates a new Department.
   *
   * Protected by authentication.
   * @param dto Incoming validated payload containing Department properties.
   * @returns Object containing the newly created Department identifier.
   * @throws BadRequestException When validation or persistence fails downstream.
   * @example
   * // Sample request body
   * // {
   * //   "name": "Marketing",
   * //   "geonameId": 12345,
   * //   "zoneId": 7
   * // }
   */
  @AuthRequired()
  @Post()
  @ApiCreatedResponse({ description: "Departamento creado" })
  async add(@Body() dto: DepartmentDto): Promise<{ id: number }> {
    const { id } = await this.commandBus.execute(new AddDepartmentCommand(dto));
    return { id };
  }

  /**
   * Retrieves all Departments with a minimal projection of fields.
   * @returns Array of Departments each containing `id` and `name`.
   * @example
   * // Response
   * // [ { "id": 1, "name": "Marketing" }, { "id": 2, "name": "Finance" } ]
   */
  @AuthRequired()
  @Get()
  @ApiOkResponse({ description: "Listado de departamentos" })
  async findAll(): Promise<DepartmentList[]> {
    return this.queryBus.execute(new GetAllDepartmentsQuery());
  }
}
