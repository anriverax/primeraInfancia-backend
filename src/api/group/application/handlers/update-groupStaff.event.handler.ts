import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UpdateGroupStaffEvent } from "../event/update-groupStaff.event";
import { GroupStaffProjection } from "../projections/groupStaff.projection";

@EventsHandler(UpdateGroupStaffEvent)
export class UpdateGroupStaffEventHandler implements IEventHandler<UpdateGroupStaffEvent> {
  constructor(private readonly groupProjection: GroupStaffProjection) {}

  async handle(event: UpdateGroupStaffEvent) {
    await this.groupProjection.update(event.id, event.data);
  }
}
