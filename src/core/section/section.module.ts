import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllSectionHandler } from "./cqrs/queries/findMany/getAllSection.handler";
import { SectionProjection } from "./cqrs/projections/section.projection";
import { SectionController } from "./section.controller";
import { CreateSectionHandler } from "./cqrs/commands/create/createSection.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdSectionHandler } from "./cqrs/queries/findUnique/getByIdSection.handler";
import { DeleteSectionHandler } from "./cqrs/commands/delete/deleteSection.handler";
import { UpdateSectionHandler } from "./cqrs/commands/update/updateSection.handler";

const CommandHandlers = [CreateSectionHandler, UpdateSectionHandler, DeleteSectionHandler];
const QueryHandlers = [GetAllSectionHandler, GetByIdSectionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [SectionController],
  providers: [SectionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class SectionModule {}
