import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class TrainingEvaluationDto {
  @IsNumber()
  @Min(1, { message: "La calificación debe ser un número." })
  grade: number;

  @IsNumber()
  @Min(1, { message: "El instrumento de evaluciación debe ser un número." })
  evaluationInstrumentId: number;

  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  inscriptionId: number;
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
