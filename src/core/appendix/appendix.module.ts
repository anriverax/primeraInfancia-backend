import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllAppendixHandler } from "./cqrs/queries/findMany/getAllAppendix.handler";
import { AppendixProjection } from "./cqrs/projections/appendix.projection";
import { AppendixController } from "./appendix.controller";
import { CreateAppendixHandler } from "./cqrs/commands/create/createAppendix.handler";
import { JwtModule } from "@nestjs/jwt";
import {
  GetByIdAppendixHandler,
  GetByIdDetailAppendixHandler
} from "./cqrs/queries/findUnique/getByIdAppendix.handler";
import { DeleteAppendixHandler } from "./cqrs/commands/delete/deleteAppendix.handler";
import { UpdateAppendixHandler } from "./cqrs/commands/update/updateAppendix.handler";
import { GetPersonAppendicesHandler } from "./cqrs/queries/findMany/getAllAppendixAnswer.handler";
import { GetByInscriptionHandler } from "@/core/appendix/cqrs/queries/findByInscription/getByInscription.query";
import { GetAnswerDataByInscriptionHandler } from "@/core/appendix/cqrs/queries/findByInscription/getAnswerDataByInscription.query";

const CommandHandlers = [
  CreateAppendixHandler,
  UpdateAppendixHandler,
  DeleteAppendixHandler,
  GetPersonAppendicesHandler,
  GetByInscriptionHandler,
  GetAnswerDataByInscriptionHandler
];
const QueryHandlers = [GetAllAppendixHandler, GetByIdAppendixHandler, GetByIdDetailAppendixHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AppendixController],
  providers: [AppendixProjection, ...CommandHandlers, ...QueryHandlers]
})
export class AppendixModule {}
