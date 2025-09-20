import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class AnswerDto {
  @IsNotEmpty({ message: "El texto es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El texto debe ser una cadena de texto." })
  valueText: string;

  @IsNotEmpty({ message: "La pregunta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La pregunta debe ser una cadena de texto." })
  questionId: number;

  @IsNotEmpty({ message: "La aplicación es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La aplicación debe ser un número." })
  responseSessionId: number;
}

export class AnswerPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
