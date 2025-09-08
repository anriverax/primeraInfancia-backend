import { Inscription, Person, PersonRole, PrincipalSchool, School } from "@prisma/client";

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
export interface IMentorAssignmentByUser {
  Inscription: InscriptionByUser;
}
export interface IMentorAssignmentBox {
  id: number;
  fullName: string;
}

export interface INewMentorAssignmentByUser extends IMentorAssignmentBox {
  School: Pick<School, "code" | "name" | "coordenates"> & {
    location: string;
  };
}

export interface IMentorAssignmentByUserResult {
  selectBox: IMentorAssignmentBox[];
  teachers: INewMentorAssignmentByUser[];
}
