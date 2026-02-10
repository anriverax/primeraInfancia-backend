import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UpdatePersonEvent } from "../event/update-person.event";
import { PersonProjection } from "@/api/auth/application/projections/person.projection";

@EventsHandler(UpdatePersonEvent)
export class UpdatePersonEventHandler implements IEventHandler<UpdatePersonEvent> {
  constructor(private readonly personProjection: PersonProjection) {}

  async handle(event: UpdatePersonEvent) {
    await this.personProjection.update(event.id, event.data);
  }
}
