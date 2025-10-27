import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, Param, Query, Req, UseFilters } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { IGroup, IGetByIdGroupOrderAssignedRole, IGroupByUserCustom } from "./dto/group.type";
import { GetByIdGroupQuery } from "./cqrs/queries/findUnique/getByIdGroup.query";
import { PaginationDto } from "../../common/helpers/dto";
import { GroupService } from "./services/group.service";
import { GetGroupByUserQuery } from "./cqrs/queries/getGroupByUser/getGroupByUser.query";
import { GetAllGroupPaginationQuery } from "./cqrs/queries/getAllGroupPagination.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly groupService: GroupService
  ) {}

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
  @Get("detail/:id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdGroupOrderAssignedRole>> {
    const result = await this.queryBus.execute(new GetByIdGroupQuery(parseInt(id)));

    const { GroupTechSupport, ...rest } = result;

    const newOrder = this.groupService.order(GroupTechSupport);
    console.log(newOrder);
    const { techSupport, trainer, teachers, mentors } = newOrder;

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: { ...rest, trainer, techSupport, mentors, teachers }
    };
  }

  @AuthRequired()
  @Get("byTypePerson")
  async getByTypePerson(@Req() req: Request): Promise<NestResponse<IGroupByUserCustom[]>> {
    const userId = req["user"].sub;
    const result = await this.queryBus.execute(new GetGroupByUserQuery(parseInt(userId)));
    const groupDetailData = this.groupService.removeProperties(result);

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: groupDetailData
    };
  }
}
