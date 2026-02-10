import { School } from "prisma/generated/client";

export interface ISchoolListResponse extends Pick<
  School,
  "id" | "code" | "name" | "zone" | "coordenates"
> {
  Cohort: {
    id: number;
    name: string;
  };
  District: {
    name: string;
    Municipality: {
      name: string;
      Department: {
        name: string;
        Zone: {
          name: string;
        };
      };
    };
  };

  Teacher: {
    deletedAt: Date | null;
  }[];
}

export interface ISchoolList extends Omit<ISchoolListResponse, "District" | "Teacher"> {
  districtName: string;
  municipalityName: string;
  departmentName: string;
  region: string;
  teachersCount: number;
}
