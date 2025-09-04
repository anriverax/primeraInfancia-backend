import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, Param, Query, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { IGroup, IGetByIdGroupWithFullName } from "./dto/group.type";
import { GetByIdGroupQuery } from "./cqrs/queries/group/findUnique/getByIdGroup.query";
import { PaginationDto } from "../../common/helpers/dto";
import { GetAllGroupPaginationQuery } from "./cqrs/queries/group/pagination/getAllGroupPagination.query";
@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(@Query() filterPagination: PaginationDto): Promise<NestResponseWithPagination<IGroup[]>> {
    const result = await this.queryBus.execute(new GetAllGroupPaginationQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de grupos registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
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
            WorkAssignment: inscription.PersonRole.Person.District
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
