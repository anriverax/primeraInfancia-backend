import { IGetZone } from "@/core/zone/dto/zone.dto";
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
export interface IGetGroup extends Pick<Group, "id" | "name" | "description" | "memberCount"> {
  Zone: Omit<IGetZone, "_count">;
  Person: {
    id: number;
  };

  _count: {
    GroupMember: number;
  };
}
