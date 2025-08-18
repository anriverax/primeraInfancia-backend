import { School } from "@prisma/client";

export type ISchool = Omit<School, "id">;
