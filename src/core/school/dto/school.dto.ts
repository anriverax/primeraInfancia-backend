import { School } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SchoolDto {
  @IsNotEmpty({ message: "El nombre del centor escolar es requerido." }),@Transform(({ value }) => value.trim()),@IsString({ message: "El nombre del centro escolar debe ser una cadena de texto." })
  name: string;
  @IsNotEmpty({ message: "El sector del centor escolar es requerido." }),@Transform(({ value }) => value.trim()),@IsString({ message: "El sector del centro escolar debe ser una cadena de texto." })
  sector: string;
  
  districtId: int;
  @IsNotEmpty({ message: "La dirección del centor escolar es requerido." }),@Transform(({ value }) => value.trim()),@IsString({ message: "La dirección del centro escolar debe ser una cadena de texto." })
  address: string;
  @IsNotEmpty({ message: "El email del centor escolar es requerido." }),@Transform(({ value }) => value.trim()),@IsString({ message: "El email del centro escolar debe ser una cadena de texto." })
  email: string;
  @IsNotEmpty({ message: "Las coordenadas del centor escolar son requeridas." }),@Transform(({ value }) => value.trim()),@IsString({ message: "Las coordenadas del centro escolar debe ser una cadena de texto." })
  coordenates: string;
  @IsNotEmpty({ message: "El número de teléfono del centor escolar es requerido." }),@Transform(({ value }) => value.trim()),@IsString({ message: "El número de teléfono del centro escolar debe ser una cadena de texto." })
  phoneNumber: string;
}

export type ICreateSchool = Pick<School, "name" | "sector" | "districtId" | "address" | "email" | "coordenates" | "phoneNumber" | "createdBy" >;
export type IUpdateSchool = Pick<School, "id" | "name" | "sector" | "districtId" | "address" | "email" | "coordenates" | "phoneNumber" | "updatedBy" >;
export type IDeleteSchool = Pick<School, "id" | "deletedBy" >;
export interface IGetSchool extends Pick<School, "id" | "name" | "sector" | "districtId" | "address" | "email" | "coordenates" | "phoneNumber" >{
    _count: {
    Group: number;
  };
};
