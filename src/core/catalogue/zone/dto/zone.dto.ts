import { Zone } from "@prisma/client";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IGetZone extends Pick<Zone, "id" | "name"> {
  /*_count: {
    Group: number;
  };*/
}
