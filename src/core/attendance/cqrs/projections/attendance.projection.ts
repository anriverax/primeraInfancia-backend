import { handlePrismaError } from "@/common/helpers/functions";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IAttendanceInput, IAttendanceResult } from "../../dto/attendance.type";

@Injectable()
export class AttendanceProjection {
  constructor(private prisma: PrismaService) {}

  async register(data: IAttendanceInput, userId: number): Promise<IAttendanceResult> {
    try {
      return await this.prisma.attendance.create({
        data: {
          ...data,
          checkIn: new Date(),
          status: "PRESENTE",
          createdBy: userId
        },
        select: {
          id: true,
          coordenates: true
        }
      });
    } catch (error) {
      handlePrismaError("AttendanceProjection", error);
    }
  }

  async update(id: number, userId: number): Promise<IAttendanceResult> {
    try {
      return await this.prisma.attendance.update({
        where: {
          id
        },
        data: {
          checkOut: new Date(),
          updatedBy: userId
        },
        select: {
          id: true,
          coordenates: true
        }
      });
    } catch (error) {
      handlePrismaError("AttendanceProjection", error);
    }
  }
}
