import { IPagination } from "@/common/helpers/types";
import { IGetZone } from "@/core/catalogue/zone/dto/zone.dto";
import { Group, Person } from "@prisma/client";

export type ICreateGroup = Pick<Group, "name" | "memberCount" | "zoneId" | "createdBy">;
export type IUpdateGroup = Pick<Group, "id" | "name" | "memberCount" | "zoneId" | "updatedBy">;
export type IDeleteGroup = Pick<Group, "id" | "deletedBy">;
export interface IGetAllGroup extends Pick<Group, "id" | "name" | "memberCount"> {
  Zone: Omit<IGetZone, "_count">;

  _count: {
    Inscription: number;
  };
}

export interface IGroupsWithPagination {
  data: IGetAllGroup[];
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
export interface IGetByIdGroup extends IGetAllGroup {
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
