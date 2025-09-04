import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllZoneHandler } from "./cqrs/queries/findMany/getAllZone.handler";
import { ZoneController } from "./zone.controller";
import { JwtModule } from "@nestjs/jwt";

const QueryHandlers = [GetAllZoneHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [ZoneController],
  providers: [...QueryHandlers]
})
export class ZoneModule {}
