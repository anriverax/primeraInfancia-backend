import { IPagination } from "@/common/helpers/types";
import { Department, Group, Person } from "@prisma/client";

export interface IGroup extends Pick<Group, "id"> {
  Department: Pick<Department, "id" | "name">;
  _count?: {
    Inscription: number;
  };
}

export interface IGroupsWithPagination {
  data: IGroup[] & { memberCount: number }[];
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
