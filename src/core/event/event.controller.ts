import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Controller, Get, Req } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { EventInstancesHandlerResponse } from "./dto/event.type";
import { GetAllEventsQuery } from "./cqrs/queries/get-all-events.query";
import { FindFirstTrainingModulesQuery } from "../catalogue/trainingModule/crqs/queries/findFirst-trainingModule-startDate.query";

@Controller()
export class EventController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get()
  async getAll(@Req() req: Request): Promise<EventInstancesHandlerResponse[]> {
    const userId = req["user"].sub;
    const trainingModule = await this.queryBus.execute(new FindFirstTrainingModulesQuery());
    console.log({ trainingModule });
    return await this.queryBus.execute(new GetAllEventsQuery(userId));
  }
}
