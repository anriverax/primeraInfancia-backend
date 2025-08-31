import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class TrackingDto {
  @IsNotEmpty({ message: "El nombre es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  name: string;

  @IsNotEmpty({ message: "La descripción es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La descripción debe ser una cadena de texto." })
  description: string;

  @IsDate({ message: "La fecha de inicio debe estar en formato fecha" })
  start: Date;

  @IsDate({ message: "La fecha de fin debe estar en formato fecha" })
  finish: Date;

  @IsNotEmpty({ message: "El tipo de seguimiento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El tipo de seguimiento debe ser un número." })
  trackingTypeId: number;
}

export class TrackingPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
