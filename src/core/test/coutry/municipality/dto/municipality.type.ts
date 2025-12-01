import { Municipality } from "prisma/generated/client";

export interface CreateDistrict {
  name: string;
}

export interface IMunicipality extends Omit<Municipality, "id"> {
  District: {
    create: CreateDistrict[];
  };
}
