import { Municipality } from "@prisma/client";

export interface CreateDistrict {
  name: string;
}

export interface IMunicipality extends Omit<Municipality, "id"> {
  District: {
    create: CreateDistrict[];
  };
}
