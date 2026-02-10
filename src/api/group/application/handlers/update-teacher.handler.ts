import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UpdateTeacherEvent } from "../event/update-teacher.event";
import { TeacherProjection } from "../projections/teacher.projection";

@EventsHandler(UpdateTeacherEvent)
export class UpdateTeacherEventHandler implements IEventHandler<UpdateTeacherEvent> {
  constructor(private readonly teacherProjection: TeacherProjection) {}

  async handle(event: UpdateTeacherEvent) {
    await this.teacherProjection.update(event.id, event.data);
  }
}
