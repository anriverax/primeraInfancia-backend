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

interface GroupInscription extends Pick<Inscription, "id" | "deletedAt"> {
  PersonRole: {
    Person: InscriptionPerson;
  };
}

export interface IGetByIdGroup extends IGroup {
  GroupLeader: {
    PersonRole: {
      id: number;
      Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;
    };
  }[];
  GroupMentors: {
    PersonRole: {
      Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2"> & {
        WorkAssignment: {
          Municipality: {
            name: string;
          };
        }[];
      };
    };
  }[];
  Inscription: GroupInscription[];
}

export interface IGetByIdGroupWithFullName extends IGroup {
  leaders: INewLeader;
  inscriptionPerson: IInscriptionPerson[];
  mentors: INewMentor[];
}

export interface ILeader {
  PersonRole: {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2">;
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

export interface IMentor {
  PersonRole: {
    Person: Pick<Person, "id" | "firstName" | "lastName1" | "lastName2"> & {
      WorkAssignment: {
        Municipality: {
          name: string;
        };
      }[];
    };
  };
}

export interface INewMentor {
  mentor: {
    id: number;
    fullName: string;
    assignedMunicipality: string;
  };
}
