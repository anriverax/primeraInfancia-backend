import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class SurveyDataDto {
  @IsNotEmpty({ message: "El número de intento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El número de intento debe ser numérico." })
  bash: number;

  @IsNotEmpty({ message: "La encuesta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La encuesta debe ser un número." })
  appendixId: number;

  @IsNotEmpty({ message: "La pregunta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La pregunta debe ser un número." })
  questionId: number;

  @IsNotEmpty({ message: "La respuesta es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "La respuesta debe ser una cadena de texto." })
  responseDetail: string;

}

export class SurveyDataPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
