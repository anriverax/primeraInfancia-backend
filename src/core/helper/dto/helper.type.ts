import { IPagination } from "@/common/helpers/types";
import { Zone, Municipality, Person, School } from "@prisma/client";

interface IDistrict {
  name: string;
  Municipality?: Pick<Municipality, "id" | "name"> & {
    Department: {
      name: string;
      Zone: Pick<Zone, "name">;
    };
  };
}
export interface ISchool extends Pick<School, "id" | "name" | "coordenates"> {
  District?: IDistrict;
  address?: string;
}

export interface IPerson extends Pick<Person, "id" | "phoneNumber"> {
  fullName?: string;
  User?: {
    email?: string;
  };
  address: string;
  school: ISchool[];
}

export interface IPersonsWithPagination {
  data: IPerson[];
  meta: IPagination;
}
