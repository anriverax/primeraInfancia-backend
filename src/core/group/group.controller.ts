import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/services/jwt/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GroupDto } from "./dto/group.dto";
import { CreateGroupCommand } from "./cqrs/command/create/createGroup.command";
import { NestResponse } from "@/common/helpers/dto";
import { Group } from "@prisma/client";
import { UpdateGroupCommand } from "./cqrs/command/update/updateGroup.command";
import { DeleteGroupCommand } from "./cqrs/command/delete/deleteGroup.command";
import { GetAllGroupQuery } from "./cqrs/queries/findMany/getAllGroup.query";
import { IGetAllGroup, IGetByIdGroup } from "./dto/group.type";
import { GetByIdGroupQuery } from "./cqrs/queries/findUnique/getByIdGroup.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: GroupDto, @Req() req: Request): Promise<NestResponse<Group>> {
    return this.commandBus.execute(
      new CreateGroupCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Get()
  async getAll(): Promise<NestResponse<IGetAllGroup[]>> {
    const result = await this.queryBus.execute(new GetAllGroupQuery());

    return {
      statusCode: 200,
      message: "Listado de grupos registrados",
      data: result
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: GroupDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateGroupCommand({
        id: parseInt(id),
        ...data,
        updatedBy: parseInt(req["user"].sub)
      })
    );
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteGroupCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdGroup>> {
    const result = await this.queryBus.execute(new GetByIdGroupQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: result
    };
  }
}
