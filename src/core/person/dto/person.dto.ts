import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class PersonDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  firstName: string;
  
  @IsNotEmpty({ message: "El primer apellido es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El primer apellido debe ser una cadena de texto." })
  lastName1: string;
  
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El segundo apellido debe ser una cadena de texto." })
  lastName2: string;
  
  @IsNotEmpty({ message: "El DUI es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El DUI debe ser una cadena de texto." })
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
  
  
  birthDate: Date;

  @IsNotEmpty({ message: "La profesión es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La profesión debe ser una cadena de texto." })
  career: string;
  
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El número de NIP debe ser una cadena de texto." })
  nip: string;
  
  @IsNotEmpty({ message: "El tipo de persona es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El tipo de persona debe ser un número." })
  typePersonId: number;
  
  @IsNotEmpty({ message: "El distrito es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El distrito debe ser un número." })
  districtId: number;
  
  @IsNotEmpty({ message: "La cohorte es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La cohorte debe ser un número." })
  cohortId: number;
  
}

export class PersonPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
