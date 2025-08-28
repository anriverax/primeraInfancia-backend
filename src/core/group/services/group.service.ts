import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateGroupCommand } from "../cqrs/command/group/create/createGroup.command";
import { GetAllTrainerQuery } from "../cqrs/queries/personRole/trainer/getAllTrainer.query";
import { GetAllGroupQuery } from "../cqrs/queries/group/findMany/getAllGroup.query";
import { IGroup } from "../dto/group.type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GroupService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}
  async create(userId: number): Promise<IGroup[]> {
    const groupsWithTrainer = await this.queryBus.execute(new GetAllTrainerQuery());

    // create groups with leader
    for (const group of groupsWithTrainer) {
      await this.commandBus.execute(
        new CreateGroupCommand({ ...group, memberCount: 0, createdBy: userId })
      );
    }

    const groups = await this.queryBus.execute(new GetAllGroupQuery());

    return groups;
  }
}
