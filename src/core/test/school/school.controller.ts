import { NestResponse } from "@/common/helpers/types";
import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AddShoolCommand } from "./cqrs/commands/AddSchool.command";
import { SchoolDto } from "./dto/school.dto";

@Controller()
@UseFilters(HttpExceptionFilter)
export class SchoolController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("add")
  async add(@Body() data: SchoolDto): Promise<NestResponse<void>> {
    return this.commandBus.execute(new AddShoolCommand(data));
  }
}
