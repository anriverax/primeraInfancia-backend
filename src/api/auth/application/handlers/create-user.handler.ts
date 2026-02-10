import { ConflictException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands/create-user.command";
import { FindUniqueUserByIdQuery } from "../queries/findUnique-user-byId.query";
import { PersonProjection } from "../projections/person.projection";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,

    private readonly personProjection: PersonProjection
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { data } = command;

    const isExist = await this.queryBus.execute(new FindUniqueUserByIdQuery({ email: data.email }));

    if (isExist?.email === data.email || isExist?.Person?.dui === data.dui)
      throw new ConflictException("Este usuario ya se encuentra registrado en el sistema.");
    /* eslint-disable @typescript-eslint/no-explicit-any */
    await this.personProjection.create(data as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}
