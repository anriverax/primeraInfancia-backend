import { IPagination } from "@/common/helpers/dto";
import { IGetZone } from "@/core/catalogue/zone/dto/zone.dto";
import { Group } from "@prisma/client";

export type ICreateGroup = Pick<Group, "name" | "description" | "memberCount" | "zoneId" | "createdBy">;
export type IUpdateGroup = Pick<
  Group,
  "id" | "name" | "description" | "memberCount" | "zoneId" | "updatedBy"
>;
export type IDeleteGroup = Pick<Group, "id" | "deletedBy">;
export interface IGetAllGroup extends Pick<Group, "id" | "name" | "description" | "memberCount"> {
  Zone: Omit<IGetZone, "_count">;

  _count: {
    Inscription: number;
  };
}

export interface IGroupsWithPagination {
  data: IGetAllGroup[];
  meta: IPagination;
}
export interface IGetByIdGroup extends IGetAllGroup {
  GroupLeader: {
    Person: {
      id: number;
      firstName: string;
      lastName1: string;
      lastName2: string;
      fullName?: string;
    };
  };
}
