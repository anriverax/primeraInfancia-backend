import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllTrackingTypeHandler } from "./cqrs/queries/findMany/getAllTrackingType.handler";
import { TrackingTypeProjection } from "./cqrs/projections/trackingType.projection";
import { TrackingTypeController } from "./trackingType.controller";
import { CreateTrackingTypeHandler } from "./cqrs/commands/create/createTrackingType.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdTrackingTypeHandler } from "./cqrs/queries/findUnique/getByIdTrackingType.handler";
import { DeleteTrackingTypeHandler } from "./cqrs/commands/delete/deleteTrackingType.handler";
import { UpdateTrackingTypeHandler } from "./cqrs/commands/update/updateTrackingType.handler";

const CommandHandlers = [
  CreateTrackingTypeHandler,
  UpdateTrackingTypeHandler,
  DeleteTrackingTypeHandler
];
const QueryHandlers = [GetAllTrackingTypeHandler, GetByIdTrackingTypeHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [TrackingTypeController],
  providers: [TrackingTypeProjection, ...CommandHandlers, ...QueryHandlers]
})
export class TrackingTypeModule {}
