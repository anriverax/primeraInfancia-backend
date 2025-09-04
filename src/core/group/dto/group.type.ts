import { IPagination } from "@/common/helpers/types";
import { Group, Inscription, Person } from "@prisma/client";

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

export interface IGetByIdGroupWithFullName extends Omit<IGetByIdGroup, "GroupLeader" | "Inscription"> {
  GroupLeader: {
    id: number;
    Person: Pick<InscriptionPerson, "id" | "fullName">;
  }[];
  Inscription: GroupInscriptionWithFullName[];
}

export interface ILeader {
  id: number;
  PersonRole: {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;
  };
}

export interface IMentor {
  id: number;
  PersonRole: {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2"> & {
      WorkAssignment: {
        Municipality: {
          name: string;
        };
      };
    };
  };
}
export interface INewLeader {
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

export interface IInscriptionPerson extends Pick<Inscription, "id" | "deletedAt"> {
  teacher: Pick<Person, "id" | "phoneNumber"> & {
    fullName: string;
    User: {
      email: string;
      avatar: string | null;
    };
    school: string;
  };
}
