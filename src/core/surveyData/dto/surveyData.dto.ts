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
  @IsString()
  question: string;

  @IsString()
  answer: string;
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
