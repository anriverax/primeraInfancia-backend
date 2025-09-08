import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Get, Param, Post, Put, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AttendanceDto } from "./dto/attendance.dto";
import { CreateAttendanceCommand } from "./cqrs/command/create/createAttendance.command";
import { GetPersonRoleByUserQuery } from "./cqrs/queries/PersonRole/getPersonRoleByUser.query";
import { FindLastAttendanceQuery } from "./cqrs/queries/attendance/findLastAttendance.query";
import { IAttendanceResult, IAttendanceWithFormatteDate } from "./dto/attendance.type";
import { NestResponse } from "@/common/helpers/types";
import { formatDate } from "@/common/helpers/functions";
import { UpdateAttendanceCommand } from "./cqrs/command/update/updateAttendance.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class AttendanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @AuthRequired()
  @Post("create")
  async register(
    @Body() data: AttendanceDto,
    @Req() req: Request
  ): Promise<NestResponse<IAttendanceResult>> {
    const userId = req["user"].sub;

    const personRole = await this.queryBus.execute(new GetPersonRoleByUserQuery(parseInt(userId)));

    const attendanceData = await this.commandBus.execute(
      new CreateAttendanceCommand({ ...data, personRoleId: personRole!.id }, userId)
    );

    return {
      statusCode: 201,
      message: "Inicio de jornada activado.",
      data: attendanceData
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<IAttendanceResult>> {
    const userId = req["user"].sub;

    const attendanceUpdated = await this.commandBus.execute(
      new UpdateAttendanceCommand(parseInt(id), userId)
    );

    return {
      statusCode: 200,
      message: "Finalización de jornada.",
      data: attendanceUpdated
    };
  }

  @AuthRequired()
  @Get("byUser")
  async getAttendanceByUser(
    @Req() req: Request
  ): Promise<NestResponse<IAttendanceWithFormatteDate | null>> {
    const userId = req["user"].sub;

    const attendanceResult = await this.queryBus.execute(new FindLastAttendanceQuery(parseInt(userId)));

    if (!attendanceResult) {
      return {
        statusCode: 200,
        message: "Listado de grupos por ID",
        data: null
      };
    }

    const { checkIn, checkOut, ...rest } = attendanceResult;

    const newCheckIn = formatDate(checkIn);
    const newCheckOut = checkOut ? formatDate(checkOut) : "";

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: {
        ...rest,
        checkIn: newCheckIn,
        checkOut: newCheckOut
      }
    };
  }
}
