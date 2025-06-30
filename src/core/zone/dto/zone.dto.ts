import { Zone } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class ZoneDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  name: string;
}

export type ICreateZone = Pick<Zone, "name" | "createdBy">;
export type IUpdateZone = Pick<Zone, "id" | "name" | "updatedBy">;
export type IDeleteZone = Pick<Zone, "id" | "deletedBy">;
export interface IGetZone extends Pick<Zone, "id" | "name"> {
  _count: {
    Group: number;
  };
}
