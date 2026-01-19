import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AttendanceDto } from "./dto/attendance.dto";
import { FindLastAttendanceQuery } from "./cqrs/queries/attendance/find-lastAttendance.query";
import {
  FindLastAttendanceResult,
  GetAllEventResult,
  GetAllInscriptionResult,
  GetAllSupportResult,
  IAttendanceGrouped,
  IMentorResult
} from "./dto/attendance.type";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { UpdateAttendanceCommand } from "./cqrs/command/update/updateAttendance.command";
import { PaginationDto } from "@/common/helpers/dto";
import { GetAllAttendancePaginationQuery } from "./cqrs/queries/pagination/getAllAttendancePagination.query";
import { MentorAssignmentService } from "./services/mentorAssignment.service";
import { GetMentorsAssignedToUserQuery } from "./cqrs/queries/mentorAssignment/getMentorsAssignedToUser.query";
import { GetAllEventsByUserQuery } from "./cqrs/queries/events/get-all-events-by-user.handler";
import { FindGroupIdByUserIdQuery } from "./cqrs/queries/support/find-groupId-by-userId.query";
import { GetAllSupportByGroupIdQuery } from "./cqrs/queries/support/get-all-support-by-groupId.query";
import { GetResposibleQuery } from "./cqrs/queries/support/get-responsible.query";
import { GetAllInscriptionByUserQuery } from "./cqrs/queries/inscriptions/get-all-inscription-by-user.query";
import { CreateAttendanceSessionCommand } from "./cqrs/command/attendanceSession/create-attendanceSession.command";
import { CreateEventAttendanceCommand } from "./cqrs/command/eventAttendance/create-eventAttendance.command";
import { FindPersonByUserQuery } from "./cqrs/queries/person/find-person-byUser.query";
import { GetGroupStaffByUserQuery } from "./cqrs/queries/groupStaff/get-groupStaff-by-user.query";
import { GetAllSessionsBySupportQuery } from "./cqrs/queries/attendanceSession/get-all-sessions-by-support.query";

/**
 * Attendance controller
 *
 * Prefix: /attendances
 *
 * Responsibilities:
 * - Start/end attendance workday records.
 * - List attendances (paginated) and fetch the latest attendance for the current user.
 * - Fetch teachers assigned to the authenticated mentor and events where the mentor is responsible.
 */
@Controller()
export class AttendanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly mentorAssignmentService: MentorAssignmentService
  ) {}

  @AuthRequired()
  @Get()
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async getAll(@Req() req: Request): Promise<any[]> {
    console.log("userId", req["user"]);
    const groupStaffList = await this.queryBus.execute(new GetGroupStaffByUserQuery(152));

    if (groupStaffList.length === 0) {
      return [];
    }

    const attendanceSessionsList = await this.queryBus.execute(
      new GetAllSessionsBySupportQuery(req["user"].sub, req["user"].role)
    );

    return attendanceSessionsList;
  }

  /**
   * Get teachers assigned to the authenticated mentor and the events where the mentor is responsible.
   *
   * Method: GET
   * Route: /attendances/me/teachers-and-events
   * Auth: Required
   *
   * @param req Request with `user.sub` (user ID) and `user.role`.
   * @returns Teachers assigned to the mentor and mentor's events.
   */

  @AuthRequired()
  @Get("me/support")
  async listSupport(
    @Req() req: Request,
    @Query("isResponsible") isResponsible: string
  ): Promise<GetAllSupportResult[] | []> {
    const userId = req["user"].sub;

    if (isResponsible !== "true") {
      const result = await this.queryBus.execute(new FindGroupIdByUserIdQuery(userId, true));
      if (!result) return [];

      return await this.queryBus.execute(new GetAllSupportByGroupIdQuery(result.groupId, userId));
    }

    return await this.queryBus.execute(new GetResposibleQuery(userId));
  }

  @AuthRequired()
  @Get("me/events")
  async listEvents(@Query("responsible") responsible: string): Promise<GetAllEventResult[]> {
    return await this.queryBus.execute(new GetAllEventsByUserQuery(parseInt(responsible)));
  }

  @AuthRequired()
  @Get("me/teachers")
  async listTeachers(
    @Query("responsible") responsible: string
  ): Promise<GetAllInscriptionResult[] | []> {
    const result = await this.queryBus.execute(
      new FindGroupIdByUserIdQuery(parseInt(responsible), false)
    );

    if (!result) return [];

    return await this.queryBus.execute(new GetAllInscriptionByUserQuery(result.id, result.groupId));
  }

  /**
   * Create a new attendance record (start workday or mark absence).
   *
   * Rules:
   * - If status is AUSENTE (absent), the record is created with checkOut set (workday ended).
   * - If an array `teacherId` is provided, an attendance record is also created for each teacher.
   *
   * Method: POST
   * Route: /attendances
   * Auth: Required
   *
   * @param data Attendance payload (AttendanceDto)
   * @param req Request with `user.sub` (user ID)
   * @returns Created attendance record result
   */
  @AuthRequired()
  @Post()
  async create(@Body() data: AttendanceDto, @Req() req: Request): Promise<NestResponse<void>> {
    const userId = req["user"].sub;

    const { eventInstanceId, modality, coordenates, teacherId, supportId, justificationUrl, ...rest } =
      data;

    console.log(supportId);

    const person = await this.queryBus.execute(new FindPersonByUserQuery(parseInt(userId)));
    /* eslint-disable  @typescript-eslint/no-non-null-asserted-optional-chain */
    const attendanceSession = await this.commandBus.execute(
      new CreateAttendanceSessionCommand(
        {
          eventInstanceId,
          modality,
          supportId: person?.id!,
          coordenates: coordenates || "0,0"
        },
        userId
      )
    );
    /* eslint-enable  @typescript-eslint/no-non-null-asserted-optional-chain */
    for (const teacher of teacherId) {
      await this.commandBus.execute(
        new CreateEventAttendanceCommand(
          {
            ...rest,
            justificationFileUrl: justificationUrl,
            attendanceSessionId: attendanceSession.id,
            teacherId: teacher
          },
          userId
        )
      );
    }

    return {
      statusCode: 201,
      message: "Jornada iniciada."
    };
  }

  /**
   * End the workday for an attendance record (set checkOut).
   *
   * Method: PUT
   * Route: /attendances/:id
   * Auth: Required
   *
   * @param id Attendance record ID to end.
   * @param req Request with `user.sub` (user ID)
   * @returns Number of records updated
   */
  @AuthRequired()
  @Put(":id")
  async endAttendance(
    @Param("id") id: string,
    @Req() req: Request
  ): Promise<NestResponse<{ count: number }>> {
    const userId = req["user"].sub;

    const attendanceUpdated = await this.commandBus.execute(
      new UpdateAttendanceCommand(parseInt(id), userId)
    );

    return {
      statusCode: 200,
      message: "Jornada finalizada.",
      data: attendanceUpdated
    };
  }

  /**
   * Get attendances grouped by person with pagination support.
   *
   * Method: GET
   * Route: /attendances
   * Auth: Required
   *
   * @param req Request with `user.sub` and `user.role`
   * @param filterPagination Pagination and filter parameters (PaginationDto)
   * @returns Paginated list of attendances grouped by person
   */
  @AuthRequired()
  @Get()
  async listAttendances(
    @Req() req: Request,
    @Query() filterPagination: PaginationDto
  ): Promise<NestResponseWithPagination<IAttendanceGrouped[]>> {
    const userId = req["user"].sub;

    const result = await this.queryBus.execute(
      new GetAllAttendancePaginationQuery(parseInt(userId), req["user"].role, filterPagination)
    );

    return {
      statusCode: 200,
      message: "Asistencias agrupadas por persona.",
      data: result.data,
      meta: result.meta
    };
  }

  /**
   * Get the latest attendance for the authenticated user (if exists).
   *
   * Method: GET
   * Route: /attendances/last
   * Auth: Required
   *
   * @param req Request with `user.sub` (user ID)
   * @returns Latest attendance record or empty array
   */
  @AuthRequired()
  @Get("last")
  async lastAttendance(@Req() req: Request): Promise<FindLastAttendanceResult | null> {
    const userId = req["user"].sub;
    const person = await this.queryBus.execute(new FindPersonByUserQuery(parseInt(userId)));

    if (!person) return null;
    console.log("person", person);
    return await this.queryBus.execute(new FindLastAttendanceQuery(person.id));
  }

  /**
   * Get mentors assigned to the authenticated (tech support) user.
   *
   * Method: GET
   * Route: /attendances/me/mentors
   * Auth: Required
   *
   * @param req Request with `user.sub` (user ID)
   * @returns Simplified list of mentors assigned to the user
   */
  @AuthRequired()
  @Get("me/mentors")
  async listMyMentors(@Req() req: Request): Promise<NestResponse<IMentorResult[]>> {
    const userId = req["user"].sub;
    const result = await this.queryBus.execute(new GetMentorsAssignedToUserQuery(parseInt(userId)));

    const data = this.mentorAssignmentService.getMentorsByTechSupport(result);

    return {
      statusCode: 200,
      message: "Mentores asignados al usuario.",
      data
    };
  }
}
