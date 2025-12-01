import { Event } from "prisma/generated/client";

export type EventsHandlerResponse = Pick<Event, "id" | "name">;
