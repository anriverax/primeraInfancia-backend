import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { UserUncheckedUpdateInput, XOR } from "prisma/generated/internal/prismaNamespace";
import { IUserRepository } from "../../domain/ports/persistence/user.repository.port";
import { IUserData } from "@/api/group/application/dto/group.type";

@Injectable()
export class UserProjection {
  constructor(@Inject("IUserRepository") private userRepository: IUserRepository) {}

  async create(data: IUserData): Promise<void> {
    await this.userRepository.create<void, IUserData>(data);
  }

  async update(
    id: number,
    data: XOR<UserUncheckedUpdateInput, Prisma.UserUpdateWithoutPersonInput>
  ): Promise<void> {
    await this.userRepository.update<
      void,
      XOR<UserUncheckedUpdateInput, Prisma.UserUpdateWithoutPersonInput>
    >(id, data);
  }
}
