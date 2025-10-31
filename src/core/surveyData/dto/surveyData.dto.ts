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
  ArrayNotEmpty,
  ValidateIf
} from "class-validator";

class SurveyItemDto {
  @IsString()
  question: string;

  // Puede ser string o un arreglo (de cualquier tipo)
  @Transform(({ value }) => {
    if (typeof value === "string") {
      // Si viene como string con JSON (p.ej. "[1,2]"), intentar parsearlo
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return value;
      } catch {
        return value;
      }
    }
    return value;
  })
  @ValidateIf((_, v) => typeof v === "string")
  @IsString()
  @ValidateIf((_, v) => Array.isArray(v))
  @IsArray()
  /* eslint-disable @typescript-eslint/no-explicit-any */
  answer: string | any[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  @IsNumber()
  index: number;
}

export class SurveyDataDto {
  @IsNotEmpty({ message: "La encuesta es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La encuesta debe ser un número." })
  appendixId: number;

  @IsNotEmpty({ message: "La encuesta (survey) es obligatoria." })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
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
