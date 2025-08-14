import { decryptTextTransformer } from "@/common/helpers/functions";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches
} from "class-validator";

enum TypeGender {
  M = "M",
  F = "F"
}

export class AuthDto {
  /* Personal Information */
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  firstName: string;

  @IsNotEmpty({ message: "El primer apellido es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El primer apellido debe ser una cadena de texto." })
  lastName1: string;

  @IsNotEmpty({ message: "El segundo apellido es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El segundo apellido debe ser una cadena de texto." })
  lastName2: string;

  @IsNotEmpty({ message: "El DUI es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La DUI debe ser una cadena de texto." })
  @Matches(/^\d{8}-\d{1}$/)
  dui: string;

  @IsNotEmpty({ message: "La dirección es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La dirección debe ser una cadena de texto." })
  address: string;

  @IsNotEmpty({ message: "El genero es obligatorio." })
  @IsString({ message: "El género debe ser una cadena de texto." })
  @IsEnum(TypeGender, { message: "El género debe ser M o F." })
  @IsIn(["M", "F"], { message: "El género debe ser 'M' o 'F'." })
  gender: TypeGender;

  @IsNotEmpty({ message: "El teléfono es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El teléfono debe ser una cadena de texto." })
  @Matches(/^(2|6|7)\d{3}-\d{4}$/)
  phoneNumber: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La fecha de nacimiento debe ser una cadena de texto." })
  birthdate: string;

  @IsNotEmpty({ message: "El distrito es obligatorio." })
  @IsNumber()
  districtId: number;

  @IsNotEmpty({ message: "El tipo de persona es obligatorio." })
  @IsNumber()
  typePersonId: number;

  /* Academic Information */

  @IsNotEmpty({ message: "La carrera es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La carrera debe ser una cadena de texto." })
  career: string;

  @IsOptional()
  @IsNumber()
  nip: number;

  /* Credential Information */

  // The user's e-mail address.
  @IsNotEmpty({ message: "El correo electrónico es un campo obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La correo electrónico debe ser una cadena de texto." })
  @IsEmail()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  email: string;

  // The user's password.
  @IsNotEmpty({ message: "La contraseña es un campo obligatorio." })
  @Transform(({ value }) => decryptTextTransformer(value as string))
  @IsString({ message: "La contraseña debe ser una cadena de texto válida." })
  passwd: string;

  @IsNotEmpty({ message: "El rol es obligatorio." })
  @IsNumber()
  roleId: number;
}

export class LoginDto {
  @IsNotEmpty({ message: "El correo electrónico es un campo obligatorio." })
  @Transform(({ value }) => decryptTextTransformer(value as string))
  @IsString()
  @IsEmail()
  value1: string;

  @IsNotEmpty({ message: "La contraseña es un campo obligatorio." })
  @Transform(({ value }) => decryptTextTransformer(value as string))
  @IsString()
  value2: string;
}

export class ChangePasswdDto {
  @IsNotEmpty({ message: "La contraseña antigua es un campo obligatorio." })
  @Transform(({ value }) => decryptTextTransformer(value as string))
  @IsString()
  value1: string;

  @IsNotEmpty({ message: "La nueva contraseña es un campo obligatorio." })
  @Transform(({ value }) => decryptTextTransformer(value as string))
  @IsString()
  value2: string;
}
