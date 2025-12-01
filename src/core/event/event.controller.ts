import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { EventsHandlerResponse } from "./dto/event.type";
import { GetAllEventsQuery } from "./cqrs/queries/get-all-events.query";

@Controller()
export class EventController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(): Promise<EventsHandlerResponse[]> {
    return await this.queryBus.execute(new GetAllEventsQuery());
  }
}
