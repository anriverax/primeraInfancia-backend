import { PrismaService } from "@/services/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ICreateGroupMentor } from "../../dto/group.type";
import { GroupMentor } from "@prisma/client";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class GroupMentorProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateGroupMentor): Promise<GroupMentor> {
    try {
      return await this.prisma.groupMentor.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("GroupMentorProjection", error);
    }
  }
}
