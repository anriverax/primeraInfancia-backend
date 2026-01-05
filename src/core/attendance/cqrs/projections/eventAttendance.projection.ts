import { handlePrismaError } from "@/common/helpers/functions";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateEventAttendanceData } from "../../dto/attendance.type";
import { AttendanceEnum, EventAttendance } from "prisma/generated/client";

@Injectable()
export class EventAttendanceProjection {
  constructor(private prisma: PrismaService) {}

  async register(data: CreateEventAttendanceData, userId: number): Promise<EventAttendance> {
    try {
      return await this.prisma.eventAttendance.create({
        data: {
          ...data,
          checkIn: new Date(),
          checkOut: data.status === AttendanceEnum.AUSENTE ? new Date() : null,
          createdBy: userId
        }
      });
    } catch (error) {
      handlePrismaError("EventAttendanceProjection", error);
    }
  }

  async update(id: number, userId: number): Promise<{ count: number }> {
    console.log(userId);
    try {
      await this.prisma.attendanceSession.update({
        where: { id },
        data: {
          checkOut: new Date()
        }
      });

      return { count: 1 };
    } catch (error) {
      handlePrismaError("AttendanceProjection", error);
    }
  }
}
