import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MunicipalityController } from "./municipality.controller";
import { GetAllMunicipalityHandler } from "./cqrs/queries/getAllMunicipality.handler";
import { AddMunicipalityHandler } from "./cqrs/command/addMunicipality.handler";
import { MunicipalityProjection } from "./cqrs/projections/municipality.projection";

const MunicipalityCommandHandlers = [AddMunicipalityHandler];
const MunicipalityQueryHandlers = [GetAllMunicipalityHandler];

@Module({
  imports: [CqrsModule],
  controllers: [MunicipalityController],
  providers: [MunicipalityProjection, ...MunicipalityCommandHandlers, ...MunicipalityQueryHandlers]
})
export class MunicipalityModule {}
