import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllEvidenceHandler } from "./cqrs/queries/findMany/getAllEvidence.handler";
import { EvidenceProjection } from "./cqrs/projections/evidence.projection";
import { EvidenceController } from "./evidence.controller";
import { CreateEvidenceHandler } from "./cqrs/commands/create/createEvidence.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdEvidenceHandler } from "./cqrs/queries/findUnique/getByIdEvidence.handler";
import { DeleteEvidenceHandler } from "./cqrs/commands/delete/deleteEvidence.handler";
import { UpdateEvidenceHandler } from "./cqrs/commands/update/updateEvidence.handler";

const CommandHandlers = [CreateEvidenceHandler, UpdateEvidenceHandler, DeleteEvidenceHandler];
const QueryHandlers = [GetAllEvidenceHandler, GetByIdEvidenceHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EvidenceController],
  providers: [EvidenceProjection, ...CommandHandlers, ...QueryHandlers]
})
export class EvidenceModule {}
