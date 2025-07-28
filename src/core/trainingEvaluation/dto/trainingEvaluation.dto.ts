import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class TrainingEvaluationDto {
  @IsNumber()
  @Min(1, { message: "La calificación debe ser un número." })
  grade: number;

  @IsNotEmpty({ message: "El comentario es obligatorio." })
  @Transform(({ value }) => value.trim())
  @IsString({ message: "El comentario debe ser una cadena de texto." })
  comment: string;

  @IsNumber()
  @Min(1, { message: "El instrumento de evaluciación debe ser un número." })
  evaluationInstrumentId: number;

  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  enrollmentId: number;
}

export class TrainingEvaluationPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
