import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SchoolDto {
  @IsNotEmpty({ message: "El código es un campo obligatorio." })
  @IsNumber()
  code: number;

  @IsNotEmpty({ message: "El nombre es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto válida." })
  name: string;

  @IsNotEmpty({ message: "La zona es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La zona debe ser una cadena de texto válida." })
  zone: string;

  @IsNotEmpty({ message: "El sector es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El sector debe ser una cadena de texto válida." })
  sector: string;

  @IsNotEmpty({ message: "El id del distrito es un campo obligatorio." })
  @IsNumber()
  districtId: number;

  @IsNotEmpty({ message: "Las coordenadas son obligatorias." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "Las coordenadas debe ser una cadena de texto válida." })
  coordenates: string;

  @IsNotEmpty({ message: "El id de la cohorte es un campo obligatorio." })
  @IsNumber()
  cohortId: number;
}
