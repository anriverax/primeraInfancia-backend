import { IPagination } from "@/common/helpers/dto";
import { IGetZone } from "@/core/catalogue/zone/dto/zone.dto";
import { Group } from "@prisma/client";

export type ICreateGroup = Pick<
  Group,
  "name" | "description" | "memberCount" | "zoneId" | "personId" | "createdBy"
>;
export type IUpdateGroup = Pick<
  Group,
  "id" | "name" | "description" | "memberCount" | "zoneId" | "personId" | "updatedBy"
>;
export type IDeleteGroup = Pick<Group, "id" | "deletedBy">;
export interface IGetAllGroup extends Pick<Group, "id" | "name" | "description" | "memberCount"> {
  Zone: Omit<IGetZone, "_count">;
  Person: {
    id: number;
  };

  _count: {
    GroupMember: number;
  };
}

export interface IGroupsWithPagination {
  data: IGetAllGroup[];
  meta: IPagination;
}
export interface IGetByIdGroup extends Omit<IGetAllGroup, "Person"> {
  Person: {
    id: number;
    fullName: string;
  };
}
