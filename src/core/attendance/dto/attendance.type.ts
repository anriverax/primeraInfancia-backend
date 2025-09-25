import { IPagination } from "@/common/helpers/types";
import { Attendance } from "@prisma/client";

export interface IAttendance extends Pick<Attendance, "id" | "checkIn" | "checkOut" | "status"> {
  Event: {
    name: string;
  };
}

export interface IAttendanceWithPagination {
  data: IAttendance[];
  meta: IPagination;
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

export interface IAttendanceInput extends Pick<Attendance, "eventId"> {
  coordenates?: string;
  personRoleId: number;
}
