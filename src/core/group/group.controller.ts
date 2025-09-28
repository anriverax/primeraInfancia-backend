import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, Param, Query, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { IGroup, IGetByIdGroupWithFullName, IGetByIdGroupGradeDetail } from "./dto/group.type";
import { GetByIdGroupQuery, GetByIdGroupGradeDetailQuery } from "./cqrs/queries/group/findUnique/getByIdGroup.query";
import { PaginationDto } from "../../common/helpers/dto";
import { GetAllGroupPaginationQuery } from "./cqrs/queries/group/pagination/getAllGroupPagination.query";
import { GroupService } from "./services/group.service";
@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly groupService: GroupService
  ) { }

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

    const { GroupLeader, Inscription, GroupMentors, ...rest } = result;

    const newOrder = this.groupService.order(GroupLeader, Inscription, GroupMentors);

    const { leaders, inscriptionPerson, mentors } = newOrder;
    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: { ...rest, leaders, inscriptionPerson, mentors }
    };
  }

  @Get("grade-detail/:id")
  async getDetailById(@Param("id") id: string): Promise<NestResponse<IGetByIdGroupGradeDetail>> {
    const result = await this.queryBus.execute(new GetByIdGroupGradeDetailQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Detalle del grupo por ID incluendo todas sus calificaciones.",
      data: result
    };
  }
}
