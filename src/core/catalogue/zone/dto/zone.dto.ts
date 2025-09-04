import { Zone } from "@prisma/client";

export interface IGetZone extends Pick<Zone, "id" | "name"> {
  Department: {
    name: string;
    _count: { Group: number };
  }[];
}

export interface IGetZoneWithDept extends Omit<IGetZone, "Department"> {
  departmets: string;
  total: number;
}
