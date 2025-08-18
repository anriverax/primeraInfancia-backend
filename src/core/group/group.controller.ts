import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GroupDto, GroupPaginationDto } from "./dto/group.dto";
import { CreateGroupCommand } from "./cqrs/command/create/createGroup.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { Group } from "@prisma/client";
import { UpdateGroupCommand } from "./cqrs/command/update/updateGroup.command";
import { DeleteGroupCommand } from "./cqrs/command/delete/deleteGroup.command";
import { GetAllGroupQuery } from "./cqrs/queries/findMany/getAllGroup.query";
import { IGetAllGroup, IGetByIdGroupWithFullName } from "./dto/group.type";
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

  @Get()
  async getAll(
    @Query() filterPagination: GroupPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllGroup[]>> {
    const result = await this.queryBus.execute(new GetAllGroupQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de grupos registrados",
      data: result.data,
      meta: result.meta
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
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdGroupWithFullName>> {
    const result = await this.queryBus.execute(new GetByIdGroupQuery(parseInt(id)));

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let leaders: any[] = [];
    let inscriptionPerson: any[] = [];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (result?.GroupLeader && Array.isArray(result.GroupLeader)) {
      leaders = result.GroupLeader.map((leader) => ({
        id: leader.id,
        PersonRole: {
          id: leader.PersonRole.id,
          Person: {
            id: leader.PersonRole.Person.id,
            fullName:
              `${leader.PersonRole.Person.firstName ?? ""} ${leader.PersonRole.Person.lastName1 ?? ""} ${leader.PersonRole.Person.lastName2 ?? ""}`.trim()
          }
        }
      }));
    }

    if (result?.Inscription && Array.isArray(result.Inscription)) {
      inscriptionPerson = result.Inscription.map((inscription) => ({
        id: inscription.id,
        status: inscription.deletedAt ? "Inactivo" : "Activo",
        PersonRole: {
          id: inscription.PersonRole.id,
          Person: {
            id: inscription.PersonRole.Person.id,
            fullName:
              `${inscription.PersonRole.Person.firstName ?? ""} ${inscription.PersonRole.Person.lastName1 ?? ""} ${inscription.PersonRole.Person.lastName2 ?? ""}`.trim(),
            phoneNumber: inscription.PersonRole.Person.phoneNumber,
            User: inscription.PersonRole.Person.User,
            District: inscription.PersonRole.Person.District
          }
        }
      }));
    }

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: { ...result, GroupLeader: leaders, Inscription: inscriptionPerson }
    };
  }
}
