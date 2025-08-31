import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllTrackingHandler } from "./cqrs/queries/findMany/getAllTracking.handler";
import { TrackingProjection } from "./cqrs/projections/tracking.projection";
import { TrackingController } from "./tracking.controller";
import { CreateTrackingHandler } from "./cqrs/commands/create/createTracking.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdTrackingHandler } from "./cqrs/queries/findUnique/getByIdTracking.handler";
import { DeleteTrackingHandler } from "./cqrs/commands/delete/deleteTracking.handler";
import { UpdateTrackingHandler } from "./cqrs/commands/update/updateTracking.handler";

const CommandHandlers = [CreateTrackingHandler, UpdateTrackingHandler, DeleteTrackingHandler];
const QueryHandlers = [GetAllTrackingHandler, GetByIdTrackingHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [TrackingController],
  providers: [TrackingProjection, ...CommandHandlers, ...QueryHandlers]
})
export class TrackingModule {}
