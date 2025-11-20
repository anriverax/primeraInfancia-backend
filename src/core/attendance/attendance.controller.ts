import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AttendanceDto } from "./dto/attendance.dto";
import { CreateAttendanceCommand } from "./cqrs/command/create/createAttendance.command";
import { GetPersonRoleByUserQuery } from "./cqrs/queries/PersonRole/getPersonRoleByUser.query";
import { FindLastAttendanceQuery } from "./cqrs/queries/attendance/findLastAttendance.query";
import {
  IAttendanceResult,
  ILastAttendance,
  ITeachersAssignmentWithEvents,
  IAttendanceGrouped,
  IMentorResult
} from "./dto/attendance.type";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { UpdateAttendanceCommand } from "./cqrs/command/update/updateAttendance.command";
import { PaginationDto } from "@/common/helpers/dto";
import { GetAllAttendancePaginationQuery } from "./cqrs/queries/pagination/getAllAttendancePagination.query";
import { GetTeacherAssignmentsByUserIdQuery } from "./cqrs/queries/mentorAssignment/getTeacherAssignmentsByUserId.query";
import { MentorAssignmentService } from "./services/mentorAssignment.service";
import { AttendanceEnum, RoleType } from "@prisma/client";
import { GetMentorsAssignedToUserQuery } from "./cqrs/queries/mentorAssignment/getMentorsAssignedToUser.query";
import { GetEventsByResponsibleUserIdQuery } from "./cqrs/queries/event/getEventsByResponsibleUserId.query";

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
  @Get("me/teachers-and-events")
  async listMyTeachersAndEvents(
    @Req() req: Request,
    @Query("mentorId") mentorId: string,
    @Query("leaderId") leaderId: string
  ): Promise<ITeachersAssignmentWithEvents> {
    let id: number = 0;
    let userRole: RoleType;
    const userId = req["user"].sub;
    const role = req["user"].role;

    const isLeader = role === RoleType.USER_TECNICO_APOYO && leaderId;
    const isMentor = role === RoleType.USER_TECNICO_APOYO && mentorId;

    if (RoleType.USER_TECNICO_APOYO === role) {
      if (isLeader) {
        userRole = RoleType.USER_FORMADOR;
        id = parseInt(leaderId);
      } else if (isMentor) {
        userRole = RoleType.USER_MENTOR;
        id = parseInt(mentorId);
      } else {
        userRole = RoleType.USER_MENTOR;
        id = parseInt(userId);
      }
    } else {
      userRole = role;
      id = parseInt(userId);
    }

    const events = await this.queryBus.execute(new GetEventsByResponsibleUserIdQuery(id));

    const result = await this.queryBus.execute(new GetTeacherAssignmentsByUserIdQuery(id, userRole));
    const data = this.mentorAssignmentService.order(result);

    return { events, teachers: data };
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
  async createAttendance(
    @Body() data: AttendanceDto,
    @Req() req: Request
  ): Promise<NestResponse<IAttendanceResult>> {
    const userId = req["user"].sub;

    const personRole = await this.queryBus.execute(new GetPersonRoleByUserQuery(parseInt(userId)));
    const { teacherId, ...rest } = data;
    const checkOutState = rest.status === AttendanceEnum.AUSENTE ? new Date() : null;

    const attendanceData = await this.commandBus.execute(
      new CreateAttendanceCommand(
        {
          ...rest,
          checkOut: checkOutState,
          personRoleId: personRole!.id
        },
        userId
      )
    );

    for (const teacher of teacherId) {
      await this.commandBus.execute(
        new CreateAttendanceCommand({ ...rest, checkOut: checkOutState, personRoleId: teacher }, userId)
      );
    }

    if (rest.status === AttendanceEnum.AUSENTE) {
      return {
        statusCode: 201,
        message: "Jornada finalizada por ausencia.",
        data: attendanceData
      };
    }
    return {
      statusCode: 201,
      message: "Jornada iniciada.",
      data: attendanceData
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
  async getMyLastAttendance(@Req() req: Request): Promise<ILastAttendance[]> {
    const userId = req["user"].sub;

    const attendanceResult = await this.queryBus.execute(new FindLastAttendanceQuery(parseInt(userId)));

    if (!attendanceResult) return [];

    const res = this.mentorAssignmentService.getTeachersByTypePerson(attendanceResult);

    return res;
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
