import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllOptionHandler } from "./cqrs/queries/findMany/getAllOption.handler";
import { OptionProjection } from "./cqrs/projections/option.projection";
import { OptionController } from "./option.controller";
import { CreateOptionHandler } from "./cqrs/commands/create/createOption.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdOptionHandler } from "./cqrs/queries/findUnique/getByIdOption.handler";
import { DeleteOptionHandler } from "./cqrs/commands/delete/deleteOption.handler";
import { UpdateOptionHandler } from "./cqrs/commands/update/updateOption.handler";

const CommandHandlers = [CreateOptionHandler, UpdateOptionHandler, DeleteOptionHandler];
const QueryHandlers = [GetAllOptionHandler, GetByIdOptionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [OptionController],
  providers: [OptionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class OptionModule {}
