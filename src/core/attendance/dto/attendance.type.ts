import {
  Inscription,
  Person,
  PrincipalSchool,
  School,
  Event,
  AttendanceEnum
} from "prisma/generated/client";

export interface IAttendanceGrouped {
  personRoleId: number;
  fullName: string;
  totalEvents: number;
}

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
  Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "deletedBy"> & {
    PrincipalSchool: IMentorPrincipalSchool[];
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

export interface IMentors {
  Mentor: {
    id: number;
    deletedBy: number | null;
    firstName: string;
    lastName1: string;
    lastName2: string | null;
  };
}

export interface IMentorResult {
  id: number;
  fullName: string;
}

export interface GetAllSupportResponse {
  Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;
}

export interface GetAllSupportResult {
  id: number;
  fullName: string;
}

export interface GetAllEventResponse {
  id: number;
  Event: Pick<Event, "name">;
}

export interface GetAllEventResult {
  id: number;
  name: string;
}

export interface GetAllInscriptionResponse {
  Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "deletedAt"> & {
    PrincipalSchool: {
      deletedAt?: Date | null;
      School: Pick<School, "code" | "name" | "coordenates"> & {
        District: { name: string; Municipality: { name: string } };
      };
    }[];
  };
}

export interface GetAllInscriptionResult extends GetAllSupportResult {
  School: Pick<School, "code" | "name">;
}

export interface CreateAttendanceSessionData {
  eventInstanceId: number;
  modality: string;
  supportId: number;
  coordenates?: string;
}

export interface CreateEventAttendanceData {
  attendanceSessionId: number;
  teacherId: number;
  status: AttendanceEnum;
  comments?: string;
  justificationFileUrl?: string;
}

export interface FindLastEventResponse {
  id: number;
  checkIn: Date;
  Person: {
    id: number;
    firstName: string;
    lastName1: string;
    lastName2: string | null;
  };
  status: "PRESENTE" | "AUSENTE";
}

export interface FindLastAttendanceResult {
  id: number;
  coordenates: string | null;
  checkIn: Date;
  modality: string;
  eventInstance: {
    id: number;
    name: string;
    responsible: string;
  };
  support: GetAllSupportResult;
  teacherSession: {
    id: number;
    checkIn: Date;
    status: "PRESENTE" | "AUSENTE";
    teacher: {
      id: number;
      fullName: string;
    };
  }[];
}
