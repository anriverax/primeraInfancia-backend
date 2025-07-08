import { Sector } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min, IsEnum, IsIn } from "class-validator";

export class SchoolDto {
  @IsNotEmpty({ message: "El nombre del centor escolar es requerido." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre del centro escolar debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "El sector del centor escolar es requerido." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El sector del centro escolar debe ser una cadena de texto." })
  @IsEnum(Sector, { message: "El sector debe ser PÚBLICO o PRIVADO" })
  @IsIn(["PÚBLICO", "PRIVADO"], { message: "El sector debe ser PÚBLICO o PRIVADO" })
  sector: Sector;

  @IsNotEmpty({ message: "El distrito del centor escolar es requerido." })
  @IsNumber()
  @Min(1, { message: "El distrito del centro escolar debe ser una cadena de texto." })
  districtId: number;

  @IsNotEmpty({ message: "La dirección del centor escolar es requerido." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La dirección del centro escolar debe ser una cadena de texto." })
  address: string;

  @IsNotEmpty({ message: "El email del centor escolar es requerido." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El email del centro escolar debe ser una cadena de texto." })
  email: string;

  @IsNotEmpty({ message: "Las coordenadas del centor escolar son requeridas." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "Las coordenadas del centro escolar debe ser una cadena de texto." })
  coordenates: string;

  @IsNotEmpty({ message: "El número de teléfono del centor escolar es requerido." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El número de teléfono del centro escolar debe ser una cadena de texto." })
  phoneNumber: string;
}
