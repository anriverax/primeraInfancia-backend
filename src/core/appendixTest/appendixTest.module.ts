import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllAppendixTestHandler } from "./cqrs/queries/findMany/getAllAppendixTest.handler";
import { AppendixTestProjection } from "./cqrs/projections/appendixTest.projection";
import { AppendixTestController } from "./appendixTest.controller";
import { CreateAppendixTestHandler } from "./cqrs/commands/create/createAppendixTest.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdAppendixTestHandler } from "./cqrs/queries/findUnique/getByIdAppendixTest.handler";
import { DeleteAppendixTestHandler } from "./cqrs/commands/delete/deleteAppendixTest.handler";
import { UpdateAppendixTestHandler } from "./cqrs/commands/update/updateAppendixTest.handler";

const CommandHandlers = [
  CreateAppendixTestHandler,
  UpdateAppendixTestHandler,
  DeleteAppendixTestHandler
];
const QueryHandlers = [GetAllAppendixTestHandler, GetByIdAppendixTestHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AppendixTestController],
  providers: [AppendixTestProjection, ...CommandHandlers, ...QueryHandlers]
})
export class AppendixTestModule {}
