import { handlePrismaError } from "@/common/helpers/functions";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AttendanceSessionProjection {
  constructor(private prisma: PrismaService) {}

  async register(data, userId: number): Promise<any> {
    try {
      return await this.prisma.attendanceSession.create({
        data: {
          ...data,
          checkIn: new Date(),
          createdBy: userId
        },
        select: {
          id: true,
          modality: true,
          EventInstance: {
            select: {
              id: true
            }
          }
        }
      });
    } catch (error) {
      handlePrismaError("AttendanceProjection", error);
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
