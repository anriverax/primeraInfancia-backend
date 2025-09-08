import { Event } from "@prisma/client";

export type IGetAllEvent = Pick<Event, "id" | "name">;
