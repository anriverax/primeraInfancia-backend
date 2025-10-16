import { IPagination } from "@/common/helpers/types";
import {
  Inscription,
  Person,
  PersonRole,
  PrincipalSchool,
  School,
  Attendance,
  Event
} from "@prisma/client";

export interface IAttendance
  extends Pick<Attendance, "id" | "status" | "comment" | "justificationUrl" | "modality"> {
  checkIn: string;
  checkOut: string | null;
  Person: {
    fullName: string;
  };
  Event: {
    name: string;
  };
}

export interface IAttendanceGrouped {
  personRoleId: number;
  fullName: string;
  totalEvents: number;
  events: Array<{
    id: number;
    eventName: string;
    checkIn: string;
    checkOut: string | null;
    status: string;
    modality: string;
  }>;
}

export interface IAttendanceWithPagination {
  data: IAttendance[];
  meta: IPagination;
}

export interface IAttendanceGroupedWithPagination {
  data: IAttendanceGrouped[];
  meta: IPagination;
}

export interface IFindLastAttendace extends Pick<Attendance, "checkIn" | "coordenates" | "modality"> {
  Event: Pick<Event, "id" | "name">;
  PersonRole: Pick<PersonRole, "typePersonId"> & {
    Person: Pick<Person, "firstName" | "lastName1" | "lastName2">;
  };
}

export interface ILastAttendanceDetails extends Pick<IFindLastAttendace, "coordenates"> {
  fullName: string;
}

export interface ILastAttendance extends Pick<IFindLastAttendace, "modality"> {
  id: number;
  event: string;
  checkIn: string;
  details: ILastAttendanceDetails[];
}

export type IAttendanceResult = Pick<Attendance, "id" | "coordenates">;

export type IAttendanceInput = Pick<
  Attendance,
  | "eventId"
  | "status"
  | "modality"
  | "comment"
  | "justificationUrl"
  | "coordenates"
  | "personRoleId"
  | "checkOut"
>;

export type IGetAllEvent = Pick<Event, "id" | "name">;

export interface IMentorPrincipalSchool extends Pick<PrincipalSchool, "deletedBy"> {
  School: Pick<School, "code" | "name" | "coordenates"> & {
    District: {
      name: string;
      Municipality: {
        name: string;
      };
    };
  };
}

export interface InscriptionByUser extends Pick<Inscription, "deletedBy"> {
  PersonRole: Pick<PersonRole, "id" | "deletedBy"> & {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "deletedBy"> & {
      PrincipalSchool: IMentorPrincipalSchool[];
    };
  };
}
export interface ITeachersAssignmentMentor {
  Inscription: InscriptionByUser;
}

export interface ITeachersAssignmentMentorResult {
  id: number;
  fullName: string;
  School: Pick<School, "code" | "name" | "coordenates"> & { location: string };
}

export interface ITeachersAssignmentWithEvents {
  events: IGetAllEvent[];
  teachers: ITeachersAssignmentMentorResult[];
}
