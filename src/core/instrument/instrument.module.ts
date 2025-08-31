import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllInstrumentHandler } from "./cqrs/queries/findMany/getAllInstrument.handler";
import { InstrumentProjection } from "./cqrs/projections/instrument.projection";
import { InstrumentController } from "./instrument.controller";
import { CreateInstrumentHandler } from "./cqrs/commands/create/createInstrument.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdInstrumentHandler } from "./cqrs/queries/findUnique/getByIdInstrument.handler";
import { DeleteInstrumentHandler } from "./cqrs/commands/delete/deleteInstrument.handler";
import { UpdateInstrumentHandler } from "./cqrs/commands/update/updateInstrument.handler";

const CommandHandlers = [CreateInstrumentHandler, UpdateInstrumentHandler, DeleteInstrumentHandler];
const QueryHandlers = [GetAllInstrumentHandler, GetByIdInstrumentHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [InstrumentController],
  providers: [InstrumentProjection, ...CommandHandlers, ...QueryHandlers]
})
export class InstrumentModule {}
