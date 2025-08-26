import { Zone } from "@prisma/client";

export interface IGetZone extends Pick<Zone, "id" | "name"> {
  /*_count: {
    Group: number;
  };*/
}
