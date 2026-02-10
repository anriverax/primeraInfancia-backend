import { Inject, Injectable } from "@nestjs/common";
import { IPlannedEventTeacherData } from "../dto/plannedEvent.type";
import { IPlannedEventTeacherRepository } from "../../domain/ports/plannedEventTeacher.repository.port";

@Injectable()
export class PlannedEventTeacherProjection {
  constructor(
    @Inject("IPlannedEventTeacherRepository")
    private plannedEventTeacherModel: IPlannedEventTeacherRepository
  ) {}

  async create(data: IPlannedEventTeacherData, userId: number): Promise<void> {
    await Promise.all(
      data.teacherIds.map((teacherId: number) =>
        this.plannedEventTeacherModel.create<
          void,
          { plannedEventId: number; teacherId: number; createdBy: number }
        >({
          plannedEventId: data.plannedEventId,
          teacherId,
          createdBy: userId
        })
      )
    );
  }
}
