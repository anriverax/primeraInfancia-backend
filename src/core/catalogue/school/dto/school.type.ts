import { IPagination } from "@/common/helpers/types";
import { School } from "@prisma/client";

export type ICreateSchool = Omit<School, "id">;

export interface ISchool extends Pick<School, "id" | "name" | "code" | "coordenates"> {
  District: {
    id: number;
    name: string;
    Municipality: {
      id: number;
      name: string;
      Department: {
        id: number;
        name: string;
      };
    };
  };
  _count: { PrincipalSchool: number };
}

export interface IGetAllSchool extends Omit<ISchool, "District"> {
  ubication: string;
}

export interface ISchoolWithPagination {
  data: IGetAllSchool[];
  meta: IPagination;
}

export type IGetByIdSchool = Omit<ISchool, "_count"> & Pick<School, "zone">;
