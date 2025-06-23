import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllZoneHandler } from "./cqrs/queries/findMany/getAllZone.handler";
import { ZoneProjection } from "./cqrs/projections/zone.projection";
import { ZoneController } from "./zone.controller";
import { CreateZoneHandler } from "./cqrs/commands/create/createZone.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdZoneHandler } from "./cqrs/queries/findUnique/getByIdZone.handler";
import { DeleteZoneHandler } from "./cqrs/commands/delete/deleteZone.handler";
import { UpdateZoneHandler } from "./cqrs/commands/update/updateZone.handler";

const CommandHandlers = [CreateZoneHandler, UpdateZoneHandler, DeleteZoneHandler];
const QueryHandlers = [GetAllZoneHandler, GetByIdZoneHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [ZoneController],
  providers: [ZoneProjection, ...CommandHandlers, ...QueryHandlers]
})
export class ZoneModule {}
