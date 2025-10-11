import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class ModuleEvaluationDto {
  @IsNotEmpty({ message: "La calificación es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La calificación debe ser un número." })
  grade: number;

  @IsNotEmpty({ message: "El instrumento de evaluación es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El instrumento de evaluación debe ser un número." })
  evaluationInstrumentId: number;

  @IsNotEmpty({ message: "La inscripción es obligatoria." })
  @IsNumber()
  @Min(1, { message: "La inscripción debe ser un número." })
  inscriptionId: number;

  @IsNotEmpty({ message: "El módulo formativo es obligatorio." })
  @IsNumber()
  @Min(1, { message: "El módulo formativo debe ser un número." })
  trainingModuleId: number;
}

export class ModuleEvaluationPaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;
}
