import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class AppendixDto {
  @IsNotEmpty({ message: "El título es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El título debe ser una cadena de texto." })
  title: string;

  @IsNotEmpty({ message: "El sub título es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El sub título debe ser una cadena de texto." })
  subTitle: string;

  @IsNotEmpty({ message: "La descripción es obligatoria." })
  // @Transform(({ value }) => value.trim())
  @IsString({ message: "La descripción debe ser una cadena de texto." })
  description: string;

  @IsNotEmpty({ message: "La periocidad es obligatoria." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La periocidad debe ser una cadena de texto." })
  periodicity: string;

  @IsNotEmpty({ message: "El nombre del icono es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El nombre del icono debe ser una cadena de texto." })
  iconName: string;

  @IsNotEmpty({ message: "El color es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El color debe ser una cadena de texto." })
  color: string;

  @IsNotEmpty({ message: "El total de intentos es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El total de intentos debe ser un número." })
  total: number;
}

export class AppendixPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
