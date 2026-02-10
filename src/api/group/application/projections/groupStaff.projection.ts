import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { UserUncheckedUpdateInput, XOR } from "prisma/generated/internal/prismaNamespace";
import { IGroupStaffRepository } from "../../domain/ports/groupStaff.respository.port";
import { IGroupStaffData } from "../dto/group.type";

@Injectable()
export class GroupStaffProjection {
  constructor(@Inject("IGroupStaffRepository") private groupStaffModel: IGroupStaffRepository) {}

  async create(data: IGroupStaffData): Promise<{ id: number }> {
    const result = await this.groupStaffModel.create<{ id: number }, IGroupStaffData>(data, {
      id: true
    });
    return result;
  }

  async update(
    id: number,
    data: XOR<UserUncheckedUpdateInput, Prisma.UserUpdateWithoutPersonInput>
  ): Promise<void> {
    await this.groupStaffModel.update<
      void,
      XOR<UserUncheckedUpdateInput, Prisma.UserUpdateWithoutPersonInput>
    >(id, data);
  }
}
