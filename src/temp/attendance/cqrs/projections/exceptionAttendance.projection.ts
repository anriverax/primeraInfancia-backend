import { handlePrismaError } from "@/common/helpers/functions";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateAttendaceExceptionData } from "../../dto/attendance.type";
import { AttendanceException } from "prisma/generated/client";

@Injectable()
export class AttendanceExceptionProjection {
  constructor(private prisma: PrismaService) {}

  async register(data: CreateAttendaceExceptionData, userId: number): Promise<AttendanceException> {
    try {
      return await this.prisma.attendanceException.create({
        data: {
          ...data,
          createdBy: userId
        }
      });
    } catch (error) {
      handlePrismaError("AttendanceExceptionProjection", error);
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
