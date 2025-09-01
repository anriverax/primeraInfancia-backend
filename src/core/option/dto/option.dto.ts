import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class OptionDto {
  @IsNotEmpty({ message: "El enunciado es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El enunciado debe ser una cadena de texto." })
  text: string;

  @IsNotEmpty({ message: "El valor de la opción es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El valor de la opción debe ser una cadena de texto." })
  value: string;

  @IsNotEmpty({ message: "La pregunta es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La pregunta debe ser un número." })
  questionId: number;
}

export class OptionPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
