import { Body, Controller, Get, Post, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { DepartmentDto } from "./dto/department.dto";
import { IGetAllDepartment } from "./dto/department.type";

import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { NestResponse } from "@/common/helpers/dto";
import { AddDepartmentCommand } from "./cqrs/commands/addDepartment.command";
import { GetAllDepartmentQuery } from "./cqrs/queries/getAllDepartment.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class DepartmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("add")
  async add(@Body() data: DepartmentDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new AddDepartmentCommand(data));
  }

  @Get()
  async getAll(): Promise<NestResponse<IGetAllDepartment[]>> {
    const data = await this.queryBus.execute(new GetAllDepartmentQuery());

    const departmentData = data.map(({ id, name }) => ({ id, name }));

    return {
      statusCode: 200,
      message: "success",
      data: departmentData
    };
  }
}
