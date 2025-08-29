import { IPagination } from "@/common/helpers/types";
import {
  Department,
  District,
  Group,
  GroupMentor,
  Inscription,
  Municipality,
  Person,
  School
} from "@prisma/client";

export interface ICreateGroupWithTrainer
  extends Pick<Group, "name" | "departmentId" | "memberCount" | "createdBy"> {
  GroupLeader: {
    create: {
      trainerId: number;
    };
  };
}

export interface ITrainer extends Pick<Group, "name" | "departmentId"> {
  GroupLeader: {
    create: {
      trainerId: number;
    };
  };
}

export type ICreateGroup = Pick<Group, "name" | "departmentId" | "memberCount" | "createdBy">;
export interface IGroup extends Pick<Group, "id"> {
  Department: Pick<Department, "id" | "name">;
  _count?: {
    Inscription: number;
  };
}

export type ICreateGroupMentor = Pick<GroupMentor, "mentorId" | "groupId" | "createdBy">;
export interface IMentor {
  id: number;
  Person: {
    WorkAssignment: {
      Municipality: Pick<Municipality, "id" | "name">;
    }[];
  };
}

export interface INewMentor {
  mentorId: number;
  workAssignment: Pick<Municipality, "id" | "name">;
}

export interface IGroupedMentorsByMunicipality {
  [municipio: string]: INewMentor[];
}

export interface IMentorsByMunicipality {
  teachers: { id: number }[];
  limit: number;
  groupId: number;
  assignedSchools: Set<string>;
  mentorId: number;
  workAssignment: Pick<Municipality, "id" | "name">;
}

export interface ITeacher extends Pick<School, "id" | "name" | "coordenates"> {
  District: Pick<District, "id" | "name"> & {
    Municipality: Pick<Municipality, "id" | "name"> & {
      Department: Pick<Department, "id" | "name">;
    };
  };
  PrincipalSchool: {
    Person: Pick<Person, "id">;
  }[];
}

export interface INewTeacher extends Pick<ITeacher, "id" | "name" | "District"> {
  teachers: Pick<Person, "id">[];
}

export interface IGroupedTeachersByMunicipality {
  [municipio: string]: INewTeacher[];
}

export interface InscriptionTeacher extends Pick<Inscription, "teacherId" | "groupId" | "createdBy"> {
  MentorAssignment: {
    create: { mentorId: number };
  };
}
export interface IGroupsWithPagination {
  data: IGroup[] & { memberCount: number }[];
  meta: IPagination;
}

//---------------------------------------------------------------
export type IDeleteGroup = Pick<Group, "id" | "deletedBy">;

interface InscriptionPerson
  extends Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "phoneNumber"> {
  fullName?: string;
  User: {
    email: string;
    avatar: string | null;
  };
  District: {
    Municipality: {
      name: string;
      Department: {
        name: string;
      };
    };
  };
}

interface GroupInscription {
  id: number;
  deletedAt?: Date | null;
  PersonRole: {
    id: number;
    Person: InscriptionPerson;
  };
}

interface GroupInscriptionWithFullName extends Omit<GroupInscription, "PersonRole" | "deletedAt"> {
  status: "Activo" | "Inactivo";
  PersonRole: {
    id: number;
    Person: Omit<InscriptionPerson, "firstName" | "lastName1" | "lastName2">; // Only names, no User or District details
  };
}
export interface IGetByIdGroup extends IGroup {
  GroupLeader: {
    id: number;
    PersonRole: {
      id: number;
      Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;
    };
  }[];
  Inscription: GroupInscription[];
}
export type IUpdateGroup = Pick<Group, "id" | "name" | "memberCount" | "updatedBy">;

export interface IGetByIdGroupWithFullName extends Omit<IGetByIdGroup, "GroupLeader" | "Inscription"> {
  GroupLeader: {
    id: number;
    Person: Pick<InscriptionPerson, "id" | "fullName">;
  }[];
  Inscription: GroupInscriptionWithFullName[];
}
//---
