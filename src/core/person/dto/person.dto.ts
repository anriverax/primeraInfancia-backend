import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class PersonDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  firstname: string;

  @IsNotEmpty({ message: "El primer apellido es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El primer apellido debe ser una cadena de texto." })
  lastname1: string;

  @IsNotEmpty({ message: "El segundo apellido es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El segundo apellido debe ser una cadena de texto." })
  lastname2: string;

  @IsNotEmpty({ message: "El dui es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El dui debe ser una cadena de texto." })
  dui: string;

  @IsNotEmpty({ message: "La dirección es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La dirección debe ser una cadena de texto." })
  address: string;

  @IsNotEmpty({ message: "El género es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El género debe ser una cadena de texto." })
  gender: string;

  @IsNotEmpty({ message: "El número de teléfono es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El número de teléfono debe ser una cadena de texto." })
  phoneNumber: string;

  @IsNotEmpty({ message: "La fecha de nacimiento es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La fecha de nacimiento debe ser una cadena de texto." })
  birthdate: string;

  @IsNotEmpty({ message: "La fotografía del dui es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La fotografía del dui debe ser una cadena de texto." })
  duiImage: string;

  @IsNumber()
  districtId: number;

  @IsNumber()
  isActive: boolean;

  @IsNumber()
  typePersonId: number;
}
