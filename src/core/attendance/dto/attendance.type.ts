import { Attendance } from "@prisma/client";

export interface IAttendance extends Pick<Attendance, "eventId"> {
  coordenates?: string;
  personRoleId: number;
}

export interface IFindLastAttendace
  extends Pick<Attendance, "id" | "checkIn" | "coordenates" | "checkOut"> {
  Event: {
    name: string;
  };
}

export interface IAttendanceWithFormatteDate extends Omit<IFindLastAttendace, "checkIn" | "checkOut"> {
  checkIn: string;
  checkOut: string;
}

export type IAttendanceResult = Pick<Attendance, "id" | "coordenates">;
