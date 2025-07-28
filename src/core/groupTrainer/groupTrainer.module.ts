import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllGroupTrainerHandler } from "./cqrs/queries/findMany/getAllGroupTrainer.handler";
import { GroupTrainerProjection } from "./cqrs/projections/groupTrainer.projection";
import { GroupTrainerController } from "./groupTrainer.controller";
import { CreateGroupTrainerHandler } from "./cqrs/commands/create/createGroupTrainer.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdGroupTrainerHandler } from "./cqrs/queries/findUnique/getByIdGroupTrainer.handler";
import { DeleteGroupTrainerHandler } from "./cqrs/commands/delete/deleteGroupTrainer.handler";
import { UpdateGroupTrainerHandler } from "./cqrs/commands/update/updateGroupTrainer.handler";

const CommandHandlers = [
  CreateGroupTrainerHandler,
  UpdateGroupTrainerHandler,
  DeleteGroupTrainerHandler
];
const QueryHandlers = [GetAllGroupTrainerHandler, GetByIdGroupTrainerHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupTrainerController],
  providers: [GroupTrainerProjection, ...CommandHandlers, ...QueryHandlers]
})
export class GroupTrainerModule {}
