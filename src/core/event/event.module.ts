import { CqrsModule } from "@nestjs/cqrs";
import { GetAllEventsHandler } from "./cqrs/queries/get-all-events.query";
import { EventController } from "./event.controller";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { TrainingModule } from "../catalogue/trainingModule/trainingModule.module";

const EventQueryHandlers = [GetAllEventsHandler];

@Module({
  imports: [CqrsModule, JwtModule, TrainingModule],
  controllers: [EventController],
  providers: [...EventQueryHandlers]
})
export class EventModule {}
