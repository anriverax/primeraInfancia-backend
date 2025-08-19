import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { IPerson } from "../helper/dto/helper.type";
import { GetAllPersonByTypePersonQuery } from "../helper/cqrs/queries/person-findMany/getAllPersonByTypePerson.query";
import { GroupLeader } from "@prisma/client";
import { PaginationDto } from "../../common/helpers/dto";
import { AddParticipantDto, AssignTypePersonDto } from "./dto/assignTypePerson.dto";

import { DeleteAssignTypePersonCommand } from "./cqrs/command/groupLeader/delete/deleteCreateAssignTypePerson.command";
import { GetAllPersonRoleQuery } from "./cqrs/queries/personRole-findMany/getAllPersonRole.query";
import { IPersonRole } from "./dto/assignTypePerson.type";
import { CreateAssignTypePersonCommand } from "./cqrs/command/groupLeader/create/createAssignTypePerson.command";
import { CreateInscriptionCommand } from "./cqrs/command/inscription/create/createInscription.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AssignTypePersonController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(
    @Body() data: AssignTypePersonDto,
    @Req() req: Request
  ): Promise<NestResponse<GroupLeader>> {
    return this.commandBus.execute(
      new CreateAssignTypePersonCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Get("typePerson/:typePersonId/zoneId/:zoneId")
  async getAllPerson(
    @Param("typePersonId") typePersonId: string,
    @Param("zoneId") zoneId: string,
    @Query() filterPagination: PaginationDto
  ): Promise<NestResponseWithPagination<IPerson[]>> {
    const personRoleResult = await this.queryBus.execute(
      new GetAllPersonByTypePersonQuery(parseInt(typePersonId), parseInt(zoneId), filterPagination)
    );

    return {
      statusCode: 200,
      message: "Listado de personas por tipo y zona",
      data: personRoleResult.data,
      meta: personRoleResult.meta
    };
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteAssignTypePersonCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @AuthRequired()
  @Post("add-participant")
  async assignTeacher(
    @Body() data: AddParticipantDto,
    @Req() req: Request
  ): Promise<NestResponse<{ count: number }>> {
    const { typePersonId, zoneId, groupId, memberCount } = data;

    const personRoleResult = await this.queryBus.execute(
      new GetAllPersonRoleQuery(typePersonId, zoneId, memberCount)
    );

    const inscription = personRoleResult.map((item: IPersonRole) => ({
      teacherId: item.id,
      groupId,
      createdBy: parseInt(req["user"].sub)
    }));

    return this.commandBus.execute(new CreateInscriptionCommand(inscription));
  }
}
