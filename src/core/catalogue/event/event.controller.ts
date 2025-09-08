import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { Controller, Get, Req, UseFilters } from "@nestjs/common";
import { GetAllEventQuery } from "./cqrs/queries/findMany/getAllEvent.query";
import { IGetAllEvent } from "./dto/event.dto";
import { QueryBus } from "@nestjs/cqrs";

@Controller()
@UseFilters(HttpExceptionFilter)
export class EventController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(@Req() req: Request): Promise<IGetAllEvent[]> {
    const { sub } = req["user"] as { sub: number };

    const events = await this.queryBus.execute(new GetAllEventQuery(sub));

    return events;
  }
}
