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

export interface IAttendanceInput extends Pick<Attendance, "eventId" | "status" | "modality"> {
  coordenates?: string;
  comment?: string;
  justificationUrl?: string;
  personRoleId: number;
}

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
