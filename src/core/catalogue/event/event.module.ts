import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GetAllEventHandler } from "./cqrs/queries/findMany/getAllEvent.handler";
import { EventController } from "./event.controller";

const EventQueryHandlers = [GetAllEventHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EventController],
  providers: [...EventQueryHandlers]
})
export class EventModule {}
