import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { TeacherUncheckedUpdateInput, XOR } from "prisma/generated/internal/prismaNamespace";
import { ITeacherRepository } from "../../domain/ports/teacher.respository.port";
import { ITeacherData } from "../dto/group.type";

@Injectable()
export class TeacherProjection {
  constructor(@Inject("ITeacherRepository") private teacherModel: ITeacherRepository) {}

  async create(data: ITeacherData): Promise<{ id: number }> {
    const teacherId = await this.teacherModel.create<{ id: number }, ITeacherData>(data, {
      id: true
    });
    return teacherId;
  }

  async update(
    id: number,
    data: XOR<TeacherUncheckedUpdateInput, Prisma.TeacherUpdateWithoutPersonInput>
  ): Promise<void> {
    await this.teacherModel.update<
      void,
      XOR<TeacherUncheckedUpdateInput, Prisma.TeacherUpdateWithoutPersonInput>
    >(id, data);
  }
}
