import { IPagination } from "@/common/helpers/types";
import { DepartmentList } from "@/core/catalogue/department/dto/department.type";
import { Group, Inscription, Person } from "prisma/generated/client";

export type GroupList = Pick<Group, "id" | "name" | "memberCount">;
export interface DepartmentGroupCount extends DepartmentList {
  _count: {
    Group: number;
  };
}

export interface DepartmentGroupCountResponse {
  departments: DepartmentGroupCount[];
  totalGroups: number;
  totalInscriptions: number;
}
export interface IGroup extends Pick<Group, "id" | "memberCount"> {
  department: string;
  _count?: {
    Inscription: number;
  };
}

export interface IGroupsWithPagination {
  data: IGroup[];
  meta: IPagination;
}

interface InscriptionPerson
  extends Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "phoneNumber"> {
  User: {
    email: string;
    avatar: string | null;
  };
  PrincipalSchool: {
    School: {
      name: string;
    };
  }[];
}

export interface GroupInscription extends Pick<Inscription, "id" | "deletedAt"> {
  Person: InscriptionPerson;
}

export interface IGetByIdGroup extends IGroup {
  GroupTechSupport: IGroupTechSupport[];
}

export type IGetByIdGroupOrderAssignedRole = IGroup & IOrderAssignedRole;

export interface IGroupTechSupport {
  id: number;
  TechSupport: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;

  AssignedRole: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;

  MentorAssignment: {
    Mentor: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;
    Inscription: GroupInscription;
  }[];
}

export interface IAssignedRole {
  id: number;
  fullName: string;
}

export interface IInscription extends Pick<Inscription, "id" | "deletedAt"> {
  PersonRole: {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "phoneNumber"> & {
      User: {
        email: string;
        avatar: string | null;
      };
      PrincipalSchool: {
        School: {
          name: string;
        };
      }[];
    };
  };
}

export interface IInscriptionPerson extends Pick<Inscription, "id"> {
  status: "Activo" | "Inactivo";
  teacher: Pick<Person, "id" | "phoneNumber"> & {
    fullName: string;
    User: {
      email: string;
      avatar: string | null;
    };
    school: string;
  };
}

export interface IOrderAssignedRole {
  techSupport: IAssignedRole;
  trainer: IAssignedRole;
  teachers: IInscriptionPerson[];
  mentors: IAssignedRole[];
}

export interface IGroupByUser {
  Inscription: Pick<Inscription, "id"> & {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2" | "phoneNumber"> & {
      User: { email: string } | null;
      PrincipalSchool: {
        School: {
          name: string;
          District: {
            name: string;
            Municipality: {
              name: string;
            };
          };
        };
      }[];
    };
  };
}

export interface IGroupByUserCustom extends Pick<Inscription, "id"> {
  Person: Pick<Person, "id" | "phoneNumber"> & {
    email: string;
    fullName: string;
    school: string;
    district: string;
    municipality: string;
  };
}
