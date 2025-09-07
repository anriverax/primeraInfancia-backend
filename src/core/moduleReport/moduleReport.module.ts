import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllModuleReportHandler } from "./cqrs/queries/findMany/getAllModuleReport.handler";
import { ModuleReportProjection } from "./cqrs/projections/moduleReport.projection";
import { ModuleReportController } from "./moduleReport.controller";
import { CreateModuleReportHandler } from "./cqrs/commands/create/createModuleReport.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdModuleReportHandler } from "./cqrs/queries/findUnique/getByIdModuleReport.handler";
import { DeleteModuleReportHandler } from "./cqrs/commands/delete/deleteModuleReport.handler";
import { UpdateModuleReportHandler } from "./cqrs/commands/update/updateModuleReport.handler";

const CommandHandlers = [
  CreateModuleReportHandler,
  UpdateModuleReportHandler,
  DeleteModuleReportHandler
];
const QueryHandlers = [GetAllModuleReportHandler, GetByIdModuleReportHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [ModuleReportController],
  providers: [ModuleReportProjection, ...CommandHandlers, ...QueryHandlers]
})
export class ModuleReportModule {}
