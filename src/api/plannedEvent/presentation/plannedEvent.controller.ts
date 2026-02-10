import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllTrainingModulesQuery } from "../application/queries/getAll-trainingModule.query";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Request } from "express";
import { FindManyEventInstanceQuery } from "../application/queries/findMany-eventInstance.query";
import { PlannedEventInput, PlannedEventTeacherInput } from "../application/dto/plannedEvent.dto";
import { CreatePlannedEventCommand } from "../application/command/create-plannedEvent.command";
import { UpdatePlannedEventCommand } from "../application/command/update-plannedEvent.command";
import {
  IPlannedEvent,
  IPlannedEventPagination,
  ITeacherListWithSchool
} from "../application/dto/plannedEvent.type";
import { CreatePlannedEventTeacherCommand } from "../application/command/create-plannedEventTeacher.command";
import { PaginationDto } from "@/common/helpers/dto";
import { GetAllPlannedEventQuery } from "../application/queries/getAll-plannedEvent.query";
import { FindManyTeachersByPersonQuery } from "../application/queries/findMany-teachers-byPerson.query";
import { FindUniquePlannedEventByIdQuery } from "../application/queries/findUnique-plannedEvent-byId.query";
import { NestResponse } from "@/common/helpers/types";

@Controller("/plannedEvent")
export class PlannedEventController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @AuthRequired()
  @Get()
  async getAll(
    @Query() filterPagination: PaginationDto,
    @Req() req: Request
  ): Promise<IPlannedEventPagination> {
    const { id } = req.authenticatedUser!;
    const plannedEvents = await this.queryBus.execute(new GetAllPlannedEventQuery(id, filterPagination));
    return plannedEvents;
  }

  @AuthRequired()
  @Post()
  async create(@Body() plannedEventInput: PlannedEventInput, @Req() req: Request): Promise<number> {
    const { id } = req.authenticatedUser!;

    const plannedEventId = await this.commandBus.execute(
      new CreatePlannedEventCommand(plannedEventInput, id)
    );

    return plannedEventId;
  }

  @AuthRequired()
  @Put(":id")
  async update(
    @Param("id") plannedId: string,
    @Body() plannedEventInput: PlannedEventInput,
    @Req() req: Request
  ): Promise<number> {
    const { id } = req.authenticatedUser!;

    const plannedEventId = await this.commandBus.execute(
      new UpdatePlannedEventCommand(Number(plannedId), plannedEventInput, id)
    );
    return plannedEventId;
  }

  @AuthRequired()
  @Get("me/:id")
  async getById(@Param("id") id: string): Promise<IPlannedEvent | null> {
    const plannedEvent = await this.queryBus.execute(
      new FindUniquePlannedEventByIdQuery(Number(id), false)
    );
    return plannedEvent;
  }

  @AuthRequired()
  @Get("details/:id")
  async getDetailsById(@Param("id") id: string): Promise<NestResponse<IPlannedEvent | null>> {
    const plannedEvent = await this.queryBus.execute(
      new FindUniquePlannedEventByIdQuery(Number(id), true)
    );
    return {
      statusCode: 200,
      message: "Información del evento planificado cargada con éxito.",
      data: plannedEvent
    };
  }
  @AuthRequired()
  @Get("teachers/user")
  async getTeachersByUser(@Req() req: Request): Promise<ITeacherListWithSchool[] | []> {
    const { id } = req.authenticatedUser!;
    const teachers = await this.queryBus.execute(new FindManyTeachersByPersonQuery(id));
    return teachers;
  }

  @AuthRequired()
  @Post("teachers")
  async assignTeacherToPlannedEvent(
    @Body() plannedEventTeacherInput: PlannedEventTeacherInput,
    @Req() req: Request
  ): Promise<NestResponse<void>> {
    const { id } = req.authenticatedUser!;

    await this.commandBus.execute(new CreatePlannedEventTeacherCommand(plannedEventTeacherInput, id));

    return {
      statusCode: 201,
      message: "Docente asignado al evento correctamente."
    };
  }

  @AuthRequired()
  @Get("/training-modules")
  async getAllTrainingModules() {
    const trainingModules = await this.queryBus.execute(new GetAllTrainingModulesQuery());
    return trainingModules;
  }

  @AuthRequired()
  @Get("/event-instances/user")
  async getEventInstancesByUser(@Req() req: Request) {
    const { id } = req.authenticatedUser!;
    const eventInstances = await this.queryBus.execute(new FindManyEventInstanceQuery(id));

    return eventInstances;
  }
}
