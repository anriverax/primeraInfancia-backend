import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GroupTrainerDto, GroupTrainerPaginationDto } from "./dto/groupTrainer.dto";
import { CreateGroupTrainerCommand } from "./cqrs/commands/create/createGroupTrainer.command";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/dto";
import { GroupTrainer } from "@prisma/client";
import { UpdateGroupTrainerCommand } from "./cqrs/commands/update/updateGroupTrainer.command";
import { DeleteGroupTrainerCommand } from "./cqrs/commands/delete/deleteGroupTrainer.command";
import { GetAllGroupTrainerQuery } from "./cqrs/queries/findMany/getAllGroupTrainer.query";
import { IGetAllGroupTrainer, IGetByIdGroupTrainer } from "./dto/groupTrainer.type";
import { GetByIdGroupTrainerQuery } from "./cqrs/queries/findUnique/getByIdGroupTrainer.query";

@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupTrainerController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Body() data: GroupTrainerDto, @Req() req: Request): Promise<NestResponse<GroupTrainer>> {
    return this.commandBus.execute(
      new CreateGroupTrainerCommand({ ...data, createdBy: parseInt(req["user"].sub) })
    );
  }

  @Get()
  async getAll(
    @Query() filterPagination: GroupTrainerPaginationDto
  ): Promise<NestResponseWithPagination<IGetAllGroupTrainer[]>> {
    const result = await this.queryBus.execute(new GetAllGroupTrainerQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de formadores de grupo registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: GroupTrainerDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateGroupTrainerCommand({
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
      new DeleteGroupTrainerCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdGroupTrainer>> {
    const result = await this.queryBus.execute(new GetByIdGroupTrainerQuery(parseInt(id)));

    return {
      statusCode: 200,
      message: "Formador del grupo por ID",
      data: result
    };
  }
}
