import { Zone, Municipality, Person } from "@prisma/client";

export interface IPerson extends Pick<Person, "id" | "phoneNumber"> {
  fullName?: string;
  User?: {
    email?: string;
  };
  District?: {
    Municipality?: Pick<Municipality, "id" | "name"> & {
      Department: {
        name: string;
        Zone: Pick<Zone, "name">;
      };
    };
  };
}
