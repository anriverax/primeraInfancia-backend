import { Inject, Injectable } from "@nestjs/common";
import { IPersonRepository } from "../../domain/ports/persistence/person.repository.port";
import { PersonUncheckedUpdateInput } from "prisma/generated/models";
import { Prisma } from "prisma/generated/client";
import { XOR } from "prisma/generated/internal/prismaNamespace";
import { IPersonData } from "@/api/group/application/dto/group.type";

@Injectable()
export class PersonProjection {
  constructor(@Inject("IPersonRepository") private personModel: IPersonRepository) {}

  async create(data: IPersonData): Promise<{ id: number }> {
    const personId = await this.personModel.create<{ id: number }, IPersonData>(data, {
      id: true
    });
    return personId;
  }

  async update(
    id: number,
    data: XOR<PersonUncheckedUpdateInput, Prisma.PersonUpdateWithoutUserInput>
  ): Promise<{ id: number }> {
    const personId = await this.personModel.update<
      { id: number },
      XOR<PersonUncheckedUpdateInput, Prisma.PersonUpdateWithoutUserInput>
    >(id, data, { id: true });

    return personId;
  }
}
