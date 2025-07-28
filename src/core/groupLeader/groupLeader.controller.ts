import { Body, Controller, Delete, Get, Param, Post, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { NestResponse } from "@/common/helpers/dto";
import { IPerson } from "../helper/dto/helper.type";
import { GetAllPersonByTypePersonQuery } from "../helper/cqrs/queries/person-findMany/getAllPersonByTypePerson.query";
import { GroupLeaderDto } from "./dto/groupLeader.dto";
import { GroupLeader } from "@prisma/client";
import { CreateGroupLeaderCommand } from "./cqrs/command/create/createGroupLeader.command";
import { DeleteGroupLeaderCommand } from "./cqrs/command/delete/deleteGroupLeader.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupLeaderController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: GroupLeaderDto, @Req() req: Request): Promise<NestResponse<GroupLeader>> {
    return this.commandBus.execute(
      new CreateGroupLeaderCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Get("typePerson/:typePersonId/zoneId/:zoneId")
  async getAllPerson(
    @Param("typePersonId") typePersonId: string,
    @Param("zoneId") zoneId: string
  ): Promise<NestResponse<IPerson[]>> {
    const data = await this.queryBus.execute(
      new GetAllPersonByTypePersonQuery(parseInt(typePersonId), parseInt(zoneId))
    );

    return {
      statusCode: 200,
      message: "Listado de personas por tipo y zona",
      data: data
    };
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteGroupLeaderCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }
}
