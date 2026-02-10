import { Inject, Injectable } from "@nestjs/common";
import { IPlannedEventRepository } from "../../domain/ports/plannedEvent.repository.port";
import { IPlannedEventData } from "../dto/plannedEvent.type";

interface IPlannedEventCreateData extends IPlannedEventData {
  createdBy: number;
}

interface IPlannedEventUpdateData extends IPlannedEventData {
  updatedBy: number;
}
@Injectable()
export class PlannedEventProjection {
  constructor(@Inject("IPlannedEventRepository") private plannedEventModel: IPlannedEventRepository) {}

  async create(data: IPlannedEventData, userId: number): Promise<number> {
    return await this.plannedEventModel.create<number, IPlannedEventCreateData>(
      {
        ...data,
        createdBy: userId
      },
      {
        id: true
      }
    );
  }

  async update(id: number, data: IPlannedEventData, userId: number): Promise<number> {
    return await this.plannedEventModel.update<number, IPlannedEventUpdateData>(
      id,
      {
        ...data,
        updatedBy: userId
      },
      {
        id: true
      }
    );
  }
}
