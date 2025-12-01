import { IPagination } from "@/common/helpers/types";
import {
  Inscription,
  Person,
  PersonRole,
  PrincipalSchool,
  School,
  Attendance,
  Event
} from "prisma/generated/client";

export interface IAttendanceList
  extends Pick<Attendance, "id" | "status" | "checkIn" | "checkOut" | "modality"> {
  EventInstance: {
    id: number;
  };
  PersonRole: {
    id: number;
    Person: Pick<Person, "firstName" | "lastName1" | "lastName2">;
  };
}

export interface IAttendanceGrouped {
  personRoleId: number;
  fullName: string;
  totalEvents: number;
}

export interface IAttendanceGroupedWithPagination {
  data: IAttendanceGrouped[];
  meta: IPagination;
}

export interface IFindLastAttendace extends Pick<Attendance, "checkIn" | "coordenates" | "modality"> {
  EventInstance: Pick<Event, "id">;
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
  | "eventInstanceId"
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

export interface IMentors {
  Mentor: Pick<PersonRole, "id" | "deletedBy"> & {
    Person: {
      deletedBy: number | null;
      firstName: string;
      lastName1: string;
      lastName2: string | null;
    };
  };
}

export interface IMentorResult {
  id: number;
  fullName: string;
}
