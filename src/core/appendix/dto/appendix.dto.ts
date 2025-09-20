import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class AppendixDto {
  @IsNotEmpty({ message: "El título es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El título debe ser una cadena de texto." })
  title: string;
  
  @IsNotEmpty({ message: "El sub título es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El sub título debe ser una cadena de texto." })
  subTitle: string;
  
  @IsNotEmpty({ message: "La descripción es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La descripción debe ser una cadena de texto." })
  description: string;
  
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
