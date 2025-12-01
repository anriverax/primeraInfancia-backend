import { CqrsModule } from "@nestjs/cqrs";
import { GetAllEventsHandler } from "./cqrs/queries/get-all-events.query";
import { EventController } from "./event.controller";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

const EventQueryHandlers = [GetAllEventsHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EventController],
  providers: [...EventQueryHandlers]
})
export class EventModule {}
