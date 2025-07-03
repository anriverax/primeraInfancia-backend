import { Department, District, Municipality } from "@prisma/client";

export type IDepartment = Omit<Department, "id" | "countryId">;

export interface IMunicipality extends Municipality {
  District: District[];
}
export interface IDepartmentWithInclude extends Department {
  Municipality: IMunicipality[];
}
