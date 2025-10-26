import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
  ArrayNotEmpty
} from "class-validator";

class SurveyItemDto {
  @IsNotEmpty({ message: "El texto de la pregunta es obligatorio." })
  @IsString({ message: "questionText debe ser una cadena de texto." })
  questionText: string;

  @IsNotEmpty({ message: "La respuesta es obligatoria." })
  @IsString({ message: "valueAnswer debe ser una cadena de texto." })
  valueAnswer: string;
}

export class SurveyDataDto {
  @IsNotEmpty({ message: "El número de intento es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El número de intento debe ser numérico." })
  bash: number;

  @IsNotEmpty({ message: "La encuesta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La encuesta debe ser un número." })
  appendixId: number;

  // Accept either JSON string or already-parsed array
  @IsNotEmpty({ message: "La encuesta (survey) es obligatoria." })
  @Transform(({ value }) => {
    // si viene como string JSON, parsearlo; si no, dejar como está
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value; // dejar que falle la validación si no es JSON válido
      }
    }
    return value;
  })
  @IsArray({ message: "La encuesta debe ser un arreglo." })
  @ArrayNotEmpty({ message: "La encuesta no puede ser un arreglo vacío." })
  @ValidateNested({ each: true })
  @Type(() => SurveyItemDto)
  survey: SurveyItemDto[];

  @IsNotEmpty({ message: "La inscripcion es obligatorio." })
  @IsNumber()
  @Min(1, { message: "La inscripcion debe ser un número." })
  inscriptionId: number;
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
